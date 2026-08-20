"""Re-fetch blog post bodies and metadata from live finprov.com pages."""

from __future__ import annotations

import sys
import time
from pathlib import Path

from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.utils import OperationalError

BACKEND_ROOT = Path(__file__).resolve().parents[3]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from migration.live_slugs import fetch_live_post_slugs, live_url_for_slug  # noqa: E402
from migration.wp_blog import normalize_wp_html, parse_post_date, rank_math_to_blog_seo  # noqa: E402
from migration.wp_scrape import fetch_live_page  # noqa: E402
from blog.models import Author, BlogPost, BlogPostSection  # noqa: E402
from seo.models import SEOMeta  # noqa: E402

SITE_BASE = "https://finprov.com"


def ensure_author(scraped_author) -> Author | None:
    if not scraped_author or not scraped_author.name:
        return None
    defaults = {"role": scraped_author.role or "Contributor"}
    if scraped_author.bio:
        defaults["bio"] = scraped_author.bio[:2000]
    author, created = Author.objects.get_or_create(name=scraped_author.name[:255], defaults=defaults)
    if not created:
        changed = False
        if scraped_author.role and author.role in {"", "Contributor"} and scraped_author.role != author.role:
            author.role = scraped_author.role
            changed = True
        if scraped_author.bio and not author.bio.strip():
            author.bio = scraped_author.bio[:2000]
            changed = True
        if changed:
            author.save(update_fields=["role", "bio"])
    return author


def save_resynced_post(post, scraped, body: str, *, retries: int = 5) -> None:
    """Persist scraped blog content with retries for SQLite lock contention."""
    last_error: Exception | None = None
    for attempt in range(retries):
        try:
            with transaction.atomic():
                author = ensure_author(scraped.author)
                fields = {
                    "title": scraped.title[:255],
                    "excerpt": scraped.excerpt[:500] if scraped.excerpt else post.excerpt,
                    "cover_image_alt": scraped.title[:255],
                }
                parsed_date = parse_post_date(scraped.published_date)
                if parsed_date:
                    fields["published_date"] = parsed_date
                if author:
                    fields["author"] = author

                for key, value in fields.items():
                    setattr(post, key, value)
                post.save(update_fields=list(fields.keys()))

                post.sections.all().delete()
                BlogPostSection.objects.create(
                    post=post,
                    heading="",
                    body=body,
                    display_order=0,
                    is_active=True,
                )

                seo_defaults = rank_math_to_blog_seo({}, slug=post.slug)
                seo_defaults["seo_title"] = (scraped.seo_title or scraped.title)[:255]
                seo_defaults["meta_description"] = (scraped.meta_description or scraped.excerpt)[:320]
                seo_defaults["canonical_url"] = scraped.canonical_url[:200]
                seo_defaults["meta_robots"] = scraped.meta_robots
                SEOMeta.objects.update_or_create(blog_post=post, defaults=seo_defaults)
            return
        except OperationalError as exc:
            last_error = exc
            if "locked" not in str(exc).lower():
                raise
            time.sleep(1.5 * (attempt + 1))
    if last_error:
        raise last_error


class Command(BaseCommand):
    help = "Re-sync published blog post content from live finprov.com (body, title, excerpt, author, SEO)."

    def add_arguments(self, parser):
        parser.add_argument("--slug", action="append", default=[], help="Limit to specific slug(s).")
        parser.add_argument("--after-slug", default="", help="Skip posts until after this slug (alphabetical resume).")
        parser.add_argument("--limit", type=int, default=0, help="Process at most N posts (0 = all).")
        parser.add_argument("--delay", type=float, default=0.35, help="Delay between live fetches (seconds).")
        parser.add_argument("--dry-run", action="store_true", help="Fetch and report without writing.")
        parser.add_argument("--include-drafts", action="store_true", help="Also resync draft blog posts.")
        parser.add_argument(
            "--from-sitemap",
            action="store_true",
            help="Use live post sitemap slugs instead of CMS slugs (creates nothing for missing slugs).",
        )
        parser.add_argument(
            "--only-corrupted",
            action="store_true",
            help="Only re-sync posts whose body still contains the Latest Posts widget markup.",
        )
        parser.add_argument(
            "--verify",
            action="store_true",
            help="After syncing, print how many published posts still have corrupted Latest Posts widget bodies.",
        )

    def handle(self, *args, **options):
        if options["from_sitemap"]:
            slugs = sorted(fetch_live_post_slugs())
            posts = BlogPost.objects.filter(slug__in=slugs)
            if not options["include_drafts"]:
                posts = posts.filter(status=BlogPost.STATUS_PUBLISHED)
        else:
            posts = BlogPost.objects.all()
            if not options["include_drafts"]:
                posts = posts.filter(status=BlogPost.STATUS_PUBLISHED)
            posts = posts.order_by("slug")

        if options["slug"]:
            posts = posts.filter(slug__in=options["slug"])
        if options["only_corrupted"]:
            posts = posts.filter(
                sections__body__icontains="elementor-posts-container",
                sections__is_active=True,
            ).distinct()
        if options["after_slug"]:
            posts = posts.filter(slug__gt=options["after_slug"])
        if options["limit"]:
            posts = posts[: options["limit"]]

        posts = list(posts)
        if not posts:
            self.stdout.write(self.style.WARNING("No blog posts matched."))
            return

        self.stdout.write(f"Re-syncing {len(posts)} blog posts from {SITE_BASE} ...")
        self.stdout.flush()

        updated = failed = skipped = 0

        for index, post in enumerate(posts):
            if index and options["delay"]:
                time.sleep(options["delay"])

            url = live_url_for_slug(post.slug)
            scraped = fetch_live_page(url, slug=post.slug)

            if scraped.status_code != 200:
                failed += 1
                self.stdout.write(self.style.WARNING(f"FAIL {post.slug} HTTP {scraped.status_code} {scraped.error}"))
                continue

            if scraped.content_type != "blog" or not scraped.body_html.strip():
                skipped += 1
                self.stdout.write(self.style.WARNING(f"SKIP {post.slug} (not a blog page or empty body)"))
                continue

            body = normalize_wp_html(scraped.body_html)
            if options["dry_run"]:
                self.stdout.write(f"OK {post.slug} body_len={len(body)} title={scraped.title[:60]!r}")
                self.stdout.flush()
                updated += 1
                continue

            try:
                save_resynced_post(post, scraped, body)
            except OperationalError as exc:
                failed += 1
                self.stdout.write(self.style.ERROR(f"DB LOCK {post.slug}: {exc}"))
                self.stdout.flush()
                continue

            updated += 1
            self.stdout.write(f"OK {post.slug} ({len(body)} chars)")
            self.stdout.flush()

        self.stdout.write(self.style.SUCCESS(f"Done. Updated: {updated}, skipped: {skipped}, failed: {failed}"))
        if options["dry_run"]:
            self.stdout.write(self.style.WARNING("Dry run only — no database writes were performed."))

        if options["verify"] or options["only_corrupted"]:
            remaining = BlogPostSection.objects.filter(
                body__icontains="elementor-posts-container",
                is_active=True,
                post__status=BlogPost.STATUS_PUBLISHED,
            ).count()
            if remaining:
                self.stdout.write(self.style.WARNING(f"Corrupted bodies remaining: {remaining}"))
            else:
                self.stdout.write(self.style.SUCCESS("All published blog bodies verified clean."))

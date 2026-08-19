import json
import sys
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils.text import slugify

BACKEND_ROOT = Path(__file__).resolve().parents[3]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from migration.wp_blog import normalize_wp_html, rank_math_to_blog_seo  # noqa: E402
from migration.wp_scrape import fetch_live_page  # noqa: E402
from blog.models import Author, BlogCategory, BlogPost, BlogPostSection  # noqa: E402
from modules.models import LandingPageBody  # noqa: E402
from pages.models import Page, PageType  # noqa: E402
from seo.models import SEOMeta  # noqa: E402

DEFAULT_GAP_REPORT = BACKEND_ROOT / "migration" / "live_sitemap_gap_report.json"
JUNK_SLUGS = {"test-new", "all-courses-new", "business-old", "sample-page"}


class Command(BaseCommand):
    help = "Scrape live finprov.com URLs missing from CMS (from live_sitemap_gap_report.json) and import as drafts."

    def add_arguments(self, parser):
        parser.add_argument("--gap-report", type=Path, default=DEFAULT_GAP_REPORT)
        parser.add_argument("--limit", type=int, default=0, help="Only scrape N URLs (0 = all missing).")
        parser.add_argument("--slug", action="append", default=[], help="Scrape specific slug(s) only.")
        parser.add_argument("--dry-run", action="store_true")
        parser.add_argument("--force", action="store_true", help="Overwrite existing CMS records for the slug.")

    @transaction.atomic
    def handle(self, *args, **options):
        gap_path = options["gap_report"].resolve()
        if not gap_path.exists():
            raise CommandError(f"Gap report not found: {gap_path}. Run analyze_live_sitemap_folder.py first.")

        payload = json.loads(gap_path.read_text(encoding="utf-8"))
        missing = [row for row in payload.get("missing_all", []) if row.get("slug") not in JUNK_SLUGS]
        if options["slug"]:
            wanted = set(options["slug"])
            missing = [row for row in missing if row["slug"] in wanted]
        if options["limit"]:
            missing = missing[: options["limit"]]

        if not missing:
            raise CommandError("No missing URLs to scrape.")

        self.stdout.write(f"Scraping {len(missing)} live URLs from finprov.com ...")
        landing_type, _ = PageType.objects.get_or_create(name="Landing Page", defaults={"slug": "landing-page"})
        blog_category, _ = BlogCategory.objects.get_or_create(name="Articles", defaults={"slug": "articles"})
        author, _ = Author.objects.get_or_create(name="Finprov Learning", defaults={"role": "Contributor"})

        def resolve_author(scraped_author):
            if not scraped_author or not scraped_author.name:
                return author
            obj, _ = Author.objects.get_or_create(
                name=scraped_author.name[:255],
                defaults={"role": scraped_author.role or "Contributor", "bio": scraped_author.bio[:2000]},
            )
            return obj

        created_pages = updated_pages = created_blogs = updated_blogs = skipped = failed = 0

        for row in missing:
            scraped = fetch_live_page(row["url"], slug=row["slug"])
            if scraped.status_code != 200 or not scraped.body_html.strip():
                failed += 1
                self.stdout.write(self.style.WARNING(f"FAIL {scraped.slug} ({scraped.status_code}) {scraped.error}"))
                continue

            content_type = scraped.content_type if scraped.content_type in {"blog", "landing"} else "blog"
            if content_type == "blog":
                existing = BlogPost.objects.filter(slug=scraped.slug).first()
                if existing and not options["force"]:
                    skipped += 1
                    continue
                if options["dry_run"]:
                    created_blogs += int(existing is None)
                    updated_blogs += int(existing is not None)
                    continue
                post, was_created = BlogPost.objects.update_or_create(
                    slug=scraped.slug,
                    defaults={
                        "title": scraped.title,
                        "excerpt": scraped.excerpt,
                        "category": blog_category,
                        "author": resolve_author(scraped.author),
                        "cover_image_alt": scraped.title,
                        "status": BlogPost.STATUS_DRAFT,
                    },
                )
                post.sections.all().delete()
                BlogPostSection.objects.create(
                    post=post, heading="", body=normalize_wp_html(scraped.body_html), display_order=0, is_active=True
                )
                seo_defaults = rank_math_to_blog_seo({}, slug=scraped.slug)
                seo_defaults["seo_title"] = scraped.seo_title or scraped.title
                seo_defaults["meta_description"] = scraped.meta_description or scraped.excerpt
                seo_defaults["canonical_url"] = scraped.canonical_url[:200]
                seo_defaults["meta_robots"] = scraped.meta_robots
                seo_defaults["include_in_sitemap"] = False
                SEOMeta.objects.update_or_create(blog_post=post, defaults=seo_defaults)
                created_blogs += int(was_created)
                updated_blogs += int(not was_created)
            else:
                existing = Page.objects.filter(slug=scraped.slug).first()
                if existing and not options["force"]:
                    skipped += 1
                    continue
                if options["dry_run"]:
                    created_pages += int(existing is None)
                    updated_pages += int(existing is not None)
                    continue
                page, was_created = Page.objects.update_or_create(
                    slug=scraped.slug,
                    defaults={
                        "name": scraped.title,
                        "page_type": landing_type,
                        "status": Page.STATUS_DRAFT,
                    },
                )
                LandingPageBody.objects.update_or_create(
                    page=page,
                    defaults={
                        "h1": scraped.title[:255],
                        "body": scraped.body_html,
                        "display_order": 0,
                        "is_active": True,
                    },
                )
                from migration.wp_sql import rank_math_to_seo

                seo_defaults = rank_math_to_seo({}, slug=scraped.slug)
                seo_defaults["seo_title"] = scraped.seo_title or scraped.title
                seo_defaults["meta_description"] = scraped.meta_description or scraped.excerpt
                seo_defaults["canonical_url"] = scraped.canonical_url[:200]
                seo_defaults["include_in_sitemap"] = False
                SEOMeta.objects.update_or_create(page=page, defaults=seo_defaults)
                created_pages += int(was_created)
                updated_pages += int(not was_created)

            self.stdout.write(f"OK {scraped.slug} ({content_type})")

        self.stdout.write(self.style.SUCCESS("Live scrape import complete."))
        self.stdout.write(f"Landing pages created/updated: {created_pages}/{updated_pages}")
        self.stdout.write(f"Blog posts created/updated: {created_blogs}/{updated_blogs}")
        self.stdout.write(f"Skipped: {skipped} Failed: {failed}")
        if options["dry_run"]:
            self.stdout.write(self.style.WARNING("Dry run only — no database writes were performed."))

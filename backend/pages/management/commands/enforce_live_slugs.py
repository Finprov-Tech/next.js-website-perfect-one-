"""Enforce finprov.com slug parity — remove demo slugs, add redirects, audit CMS."""

from __future__ import annotations

import sys
from pathlib import Path

from django.core.management.base import BaseCommand
from django.db import transaction

BACKEND_ROOT = Path(__file__).resolve().parents[3]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from migration.live_slugs import (  # noqa: E402
    DEMO_ONLY_BLOG_SLUGS,
    DEMO_TO_LIVE_BLOG_SLUGS,
    fetch_live_post_slugs,
    normalize_path,
    slug_exists_on_live,
)
from blog.models import BlogPost  # noqa: E402
from seo.models import Redirect  # noqa: E402


class Command(BaseCommand):
    help = "Remove demo blog slugs and align CMS URLs with finprov.com (source of truth)."

    def add_arguments(self, parser):
        parser.add_argument("--audit", action="store_true", help="Compare published CMS blog slugs vs live post sitemap.")
        parser.add_argument("--apply", action="store_true", help="Delete demo posts and create 301 redirects.")
        parser.add_argument("--verify-live", action="store_true", help="HEAD-check CMS slugs against finprov.com (slow).")

    def handle(self, *args, **options):
        if not any((options["audit"], options["apply"], options["verify_live"])):
            options["audit"] = True
            options["apply"] = True

        if options["audit"]:
            self._audit()

        if options["apply"]:
            with transaction.atomic():
                deleted, redirects = self._apply_demo_cleanup()
            self.stdout.write(self.style.SUCCESS(f"Deleted {deleted} demo blog records."))
            self.stdout.write(self.style.SUCCESS(f"Created/updated {redirects} demo slug redirects."))

        if options["verify_live"]:
            self._verify_live_slugs()

    def _audit(self):
        live_slugs = fetch_live_post_slugs()
        cms_slugs = set(BlogPost.objects.filter(status=BlogPost.STATUS_PUBLISHED).values_list("slug", flat=True))
        missing_on_cms = sorted(live_slugs - cms_slugs)
        extra_on_cms = sorted(cms_slugs - live_slugs)

        self.stdout.write(self.style.MIGRATE_HEADING("Blog slug parity (finprov.com post sitemaps vs CMS)"))
        self.stdout.write(f"Live sitemap posts: {len(live_slugs)}")
        self.stdout.write(f"CMS published posts: {len(cms_slugs)}")
        self.stdout.write(f"On live, missing in CMS: {len(missing_on_cms)}")
        if missing_on_cms[:10]:
            self.stdout.write(f"  sample: {missing_on_cms[:10]}")
        self.stdout.write(f"In CMS, not in live post sitemap: {len(extra_on_cms)}")
        if extra_on_cms[:10]:
            self.stdout.write(f"  sample: {extra_on_cms[:10]}")
        self.stdout.write(
            "Note: finprov.com is the slug source of truth — every public URL path must match the live site."
        )

    def _apply_demo_cleanup(self) -> tuple[int, int]:
        demo_slugs = set(DEMO_TO_LIVE_BLOG_SLUGS.keys()) | set(DEMO_ONLY_BLOG_SLUGS)
        deleted, _ = BlogPost.objects.filter(slug__in=demo_slugs).delete()

        redirect_count = 0
        for old_slug, new_slug in DEMO_TO_LIVE_BLOG_SLUGS.items():
            Redirect.objects.update_or_create(
                old_path=normalize_path(old_slug),
                defaults={"new_path": normalize_path(new_slug), "redirect_type": Redirect.REDIRECT_301, "is_active": True},
            )
            redirect_count += 1

        for old_slug in DEMO_ONLY_BLOG_SLUGS:
            Redirect.objects.update_or_create(
                old_path=normalize_path(old_slug),
                defaults={"new_path": "/blog/", "redirect_type": Redirect.REDIRECT_301, "is_active": True},
            )
            redirect_count += 1

        return deleted, redirect_count

    def _verify_live_slugs(self):
        self.stdout.write("Checking published CMS blog slugs against live finprov.com …")
        missing = []
        for slug in BlogPost.objects.filter(status=BlogPost.STATUS_PUBLISHED).values_list("slug", flat=True).iterator():
            if not slug_exists_on_live(slug):
                missing.append(slug)
        self.stdout.write(f"Published CMS slugs with no live URL: {len(missing)}")
        if missing[:20]:
            self.stdout.write(f"  sample: {missing[:20]}")

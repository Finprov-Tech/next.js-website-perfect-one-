import sys
import time
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError

BACKEND_ROOT = Path(__file__).resolve().parents[3]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from migration.wp_blog import parse_post_date  # noqa: E402
from migration.wp_scrape import fetch_live_page  # noqa: E402
from migration.wp_sql import load_published_posts  # noqa: E402
from blog.models import BlogPost  # noqa: E402

DEFAULT_SQL = Path(r"C:\Users\FINPROV\Desktop\finprovadmin_finprov.sql")
SITE_BASE = "https://finprov.com"


class Command(BaseCommand):
    help = "Backfill missing blog published_date values from WordPress SQL and live pages."

    def add_arguments(self, parser):
        parser.add_argument("--sql", type=Path, default=DEFAULT_SQL)
        parser.add_argument("--live", action="store_true", help="Scrape finprov.com for posts still missing dates.")
        parser.add_argument("--limit", type=int, default=0, help="Only process N posts (0 = all missing).")
        parser.add_argument("--dry-run", action="store_true")

    def handle(self, *args, **options):
        sql_path = options["sql"].resolve()
        missing = list(BlogPost.objects.filter(published_date__isnull=True).order_by("slug"))
        if options["limit"]:
            missing = missing[: options["limit"]]

        if not missing:
            self.stdout.write(self.style.SUCCESS("No blog posts with missing published_date."))
            return

        self.stdout.write(f"Found {len(missing)} posts without published_date.")

        wp_by_slug: dict[str, str] = {}
        if sql_path.exists():
            for wp_post in load_published_posts(sql_path):
                slug = (wp_post.post_name or "").strip().lower()
                if slug and wp_post.post_date:
                    wp_by_slug[slug] = wp_post.post_date
            self.stdout.write(f"Loaded {len(wp_by_slug)} WordPress post dates from {sql_path.name}.")
        else:
            self.stdout.write(self.style.WARNING(f"SQL dump not found: {sql_path} — skipping SQL backfill."))

        updated_sql = updated_live = failed = 0

        for post in missing:
            wp_date = wp_by_slug.get(post.slug)
            parsed = parse_post_date(wp_date) if wp_date else None
            if parsed:
                if not options["dry_run"]:
                    post.published_date = parsed
                    post.save(update_fields=["published_date"])
                updated_sql += 1
                continue

            if not options["live"]:
                continue

            scraped = fetch_live_page(f"{SITE_BASE}/{post.slug}/", slug=post.slug)
            if scraped.status_code != 200 or not scraped.published_date:
                failed += 1
                self.stdout.write(self.style.WARNING(f"SKIP {post.slug} (no live date)"))
                continue

            parsed = parse_post_date(scraped.published_date)
            if not parsed:
                failed += 1
                continue

            if not options["dry_run"]:
                post.published_date = parsed
                post.save(update_fields=["published_date"])
            updated_live += 1
            time.sleep(0.4)

        self.stdout.write(
            self.style.SUCCESS(
                f"SQL backfill: {updated_sql}, live backfill: {updated_live}, failed/skipped: {failed}"
            )
        )

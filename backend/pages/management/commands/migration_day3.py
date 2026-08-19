import json
import sys
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

BACKEND_ROOT = Path(__file__).resolve().parents[3]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from migration.day3 import fix_seo_templates, parity_report, publish_migration  # noqa: E402
from blog.models import BlogPost  # noqa: E402
from courses.models import Course  # noqa: E402
from pages.models import Page  # noqa: E402
from seo.models import Redirect, SEOMeta  # noqa: E402

DEFAULT_SITEMAP = (
    Path(__file__).resolve().parents[4]
    / "next.js-website-perfect-one-"
    / "scratch"
    / "live_sitemap_pages.json"
)


class Command(BaseCommand):
    help = "Day 3 migration QA: slug parity report, SEO template cleanup, and bulk publish."

    def add_arguments(self, parser):
        parser.add_argument("--sitemap", type=Path, default=DEFAULT_SITEMAP)
        parser.add_argument("--report", action="store_true", help="Print slug parity report against live sitemap JSON.")
        parser.add_argument("--fix-seo", action="store_true", help="Replace unresolved Rank Math template tokens in SEO titles.")
        parser.add_argument("--publish", action="store_true", help="Publish WP-migrated pages/courses/blogs and enable sitemap flags.")
        parser.add_argument(
            "--include-legacy-courses",
            action="store_true",
            help="Also publish non-WordPress course records (legacy TypeScript import).",
        )
        parser.add_argument("--all", action="store_true", help="Run report, fix-seo, and publish in one pass.")

    def handle(self, *args, **options):
        run_report = options["report"] or options["all"]
        run_fix_seo = options["fix_seo"] or options["all"]
        run_publish = options["publish"] or options["all"]

        if not any((run_report, run_fix_seo, run_publish)):
            raise CommandError("Specify at least one of --report, --fix-seo, --publish, or --all.")

        sitemap_path = options["sitemap"].resolve()
        if run_report:
            if not sitemap_path.exists():
                raise CommandError(f"Live sitemap JSON not found: {sitemap_path}")
            self._print_report(sitemap_path)

        if run_fix_seo:
            fixed = fix_seo_templates()
            self.stdout.write(self.style.SUCCESS(f"Fixed {fixed} SEO titles with Rank Math template tokens."))

        if run_publish:
            with transaction.atomic():
                stats = publish_migration(include_legacy_courses=options["include_legacy_courses"])
            self.stdout.write(self.style.SUCCESS("Migration publish complete."))
            self.stdout.write(f"Pages published: {stats['pages_published']}")
            self.stdout.write(f"Courses published: {stats['courses_published']}")
            self.stdout.write(f"Blog posts published: {stats['blogs_published']}")
            self.stdout.write(f"SEO sitemap flags enabled: {stats['seo_sitemap_enabled']}")
            self._print_live_counts()

    def _print_report(self, sitemap_path: Path):
        report = parity_report(sitemap_path)
        self.stdout.write(self.style.MIGRATE_HEADING("Slug parity vs live sitemap"))
        for section in ("pages", "courses", "blogs"):
            data = report[section]
            self.stdout.write(
                f"{section}: live={data['live']} cms={data['cms']} overlap={data['overlap']} "
                f"missing_in_cms={data['missing_in_cms_count']} extra_in_cms={data['extra_in_cms_count']}"
            )
            if data["missing_in_cms"]:
                self.stdout.write(f"  missing sample: {data['missing_in_cms'][:10]}")
            if data["extra_in_cms"]:
                self.stdout.write(f"  extra sample: {data['extra_in_cms'][:10]}")

        report_path = BACKEND_ROOT / "migration" / "day3_parity_report.json"
        report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
        self.stdout.write(f"Full report written to {report_path}")

    def _print_live_counts(self):
        self.stdout.write(self.style.MIGRATE_HEADING("Current CMS visibility (public API)"))
        self.stdout.write(f"Published pages: {Page.objects.filter(status=Page.STATUS_PUBLISHED).count()}")
        self.stdout.write(f"Published courses: {Course.objects.filter(status=Course.STATUS_PUBLISHED, is_active=True).count()}")
        self.stdout.write(f"Published blog posts: {BlogPost.objects.filter(status=BlogPost.STATUS_PUBLISHED).count()}")
        self.stdout.write(f"Active redirects: {Redirect.objects.filter(is_active=True).count()}")
        self.stdout.write(f"SEO in sitemap: {SEOMeta.objects.filter(include_in_sitemap=True).count()}")

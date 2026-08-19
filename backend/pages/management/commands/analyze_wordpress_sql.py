import json
import sys
from dataclasses import asdict
from pathlib import Path

from django.core.management.base import BaseCommand

BACKEND_ROOT = Path(__file__).resolve().parents[3]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from migration.wp_sql import build_inventory  # noqa: E402


class Command(BaseCommand):
    help = "Analyze a phpMyAdmin WordPress SQL dump and write a migration inventory JSON report."

    def add_arguments(self, parser):
        default = Path(r"C:\Users\FINPROV\Desktop\finprovadmin_finprov.sql")
        parser.add_argument("--sql", type=Path, default=default, help="Path to the WordPress .sql export")
        parser.add_argument(
            "--output",
            type=Path,
            default=Path(__file__).resolve().parents[4] / "migration" / "wp_inventory.json",
            help="Where to write the inventory JSON report",
        )

    def handle(self, *args, **options):
        sql_path = options["sql"].resolve()
        output_path = options["output"].resolve()

        if not sql_path.exists():
            self.stderr.write(self.style.ERROR(f"SQL file not found: {sql_path}"))
            return

        self.stdout.write(f"Analyzing {sql_path} ...")
        inventory = build_inventory(sql_path)
        payload = asdict(inventory)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")

        self.stdout.write(self.style.SUCCESS(f"Wrote inventory to {output_path}"))
        self.stdout.write(f"Site URL: {inventory.siteurl}")
        self.stdout.write(f"Total wp_posts rows parsed: {inventory.total_rows}")
        self.stdout.write(f"Published by type: {inventory.published_by_type}")
        self.stdout.write(f"Migration targets: {inventory.migration_targets}")
        self.stdout.write(f"Rank Math redirects (approx): {inventory.rank_math_redirects}")

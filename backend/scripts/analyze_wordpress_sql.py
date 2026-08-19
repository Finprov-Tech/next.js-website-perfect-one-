#!/usr/bin/env python3
"""Standalone WordPress SQL inventory — no Django required."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from migration.wp_sql import build_inventory  # noqa: E402


def main() -> None:
    sql_path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(r"C:\Users\FINPROV\Desktop\finprovadmin_finprov.sql")
    output_path = ROOT / "migration" / "wp_inventory.json"
    if not sql_path.exists():
        raise SystemExit(f"SQL file not found: {sql_path}")

    print(f"Analyzing {sql_path} ...")
    inventory = build_inventory(sql_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(inventory.__dict__, indent=2), encoding="utf-8")

    print(f"Wrote {output_path}")
    print(f"Site URL: {inventory.siteurl}")
    print(f"Total wp_posts rows: {inventory.total_rows}")
    print(f"Published by type: {inventory.published_by_type}")
    print(f"Migration targets: {inventory.migration_targets}")
    print(f"Static page slugs found: {inventory.static_page_slugs}")


if __name__ == "__main__":
    main()

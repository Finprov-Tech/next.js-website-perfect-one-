"""Parse Rank Math redirection rows from a phpMyAdmin SQL dump."""

from __future__ import annotations

import re
from dataclasses import dataclass
from urllib.parse import urlparse

from migration.wp_sql import _extract_tuple_strings, _iter_insert_sections, _parse_tuple

PATTERN_RE = re.compile(r's:7:"pattern";s:\d+:"((?:\\.|[^"\\])*)"')
COMPARISON_RE = re.compile(r's:10:"comparison";s:\d+:"([^"]+)"')
WP_PREFIX_REWRITES = (
    ("sfwd-courses/", "courses/"),
    ("product/", "courses/"),
)


@dataclass
class WpRedirect:
    wp_id: int
    pattern: str
    url_to: str
    header_code: int
    status: str
    comparison: str


def _unescape_php(value: str) -> str:
    return value.replace('\\"', '"').replace("\\\\", "\\")


def parse_redirect_sources(raw: str) -> tuple[str, str]:
    pattern_match = PATTERN_RE.search(raw or "")
    comparison_match = COMPARISON_RE.search(raw or "")
    pattern = _unescape_php(pattern_match.group(1)).strip() if pattern_match else ""
    comparison = comparison_match.group(1).strip() if comparison_match else "exact"
    return pattern, comparison


def normalize_site_path(raw: str, *, site_base: str = "https://finprov.com") -> str:
    value = (raw or "").strip()
    if not value:
        return "/"
    if value.startswith("http://") or value.startswith("https://"):
        path = urlparse(value).path or "/"
    else:
        path = value if value.startswith("/") else f"/{value}"
    path = re.sub(r"/+", "/", path)
    if not path.endswith("/"):
        path = f"{path}/"
    return path


def rewrite_wp_path(path: str) -> str:
    cleaned = path.strip().strip("/")
    for old_prefix, new_prefix in WP_PREFIX_REWRITES:
        if cleaned.startswith(old_prefix):
            cleaned = new_prefix + cleaned[len(old_prefix) :]
            break
    return normalize_site_path(cleaned)


def map_wp_redirect(row: WpRedirect) -> dict[str, object] | None:
    if row.status != "active" or row.comparison != "exact" or not row.pattern or not row.url_to:
        return None

    old_path = rewrite_wp_path(row.pattern)
    new_path = rewrite_wp_path(row.url_to)
    if old_path == new_path:
        return None

    redirect_type = 301 if int(row.header_code or 301) == 301 else 302
    return {
        "old_path": old_path[:255],
        "new_path": new_path[:255],
        "redirect_type": redirect_type,
        "is_active": True,
        "wp_id": row.wp_id,
    }


def iter_rank_math_redirections(sql_path) -> list[WpRedirect]:
    rows: list[WpRedirect] = []
    for section in _iter_insert_sections(sql_path, "wp_rank_math_redirections"):
        for tuple_text in _extract_tuple_strings(section):
            try:
                values, _ = _parse_tuple(tuple_text, 0, 9)
            except ValueError:
                continue
            pattern, comparison = parse_redirect_sources(str(values[1] or ""))
            rows.append(
                WpRedirect(
                    wp_id=int(values[0]),
                    pattern=pattern,
                    url_to=str(values[2] or ""),
                    header_code=int(values[3] or 301),
                    status=str(values[5] or ""),
                    comparison=comparison,
                )
            )
    rows.sort(key=lambda row: row.wp_id)
    return rows

"""Map WordPress blog posts into Django BlogPost payloads."""

from __future__ import annotations

import hashlib
import html
import json
import re
from datetime import date, datetime
from typing import Any

from migration.wp_sql import WpPost

TAG_RE = re.compile(r"<[^>]+>")
WP_BLOCK_COMMENT_RE = re.compile(r"<!--\s*/?wp:[^>]*-->", re.I)
CORRUPTED_NEWLINE_RE = re.compile(r"(?<=[>])n+(?=<)")


def normalize_wp_html(raw: str) -> str:
    """Clean Gutenberg block comments and newline corruption from SQL import."""
    if not raw:
        return ""
    text = WP_BLOCK_COMMENT_RE.sub("", raw)
    text = CORRUPTED_NEWLINE_RE.sub("", text)
    text = re.sub(r"^\s*n+(?=<)", "", text)
    return text.strip()


def strip_html(text: str) -> str:
    text = html.unescape(text or "")
    text = TAG_RE.sub(" ", text)
    return re.sub(r"\s+", " ", text).strip()


def parse_post_date(raw: str) -> date | None:
    if not raw:
        return None
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d"):
        try:
            return datetime.strptime(raw[:19], fmt).date()
        except ValueError:
            continue
    return None


def estimate_read_time(text: str) -> str:
    words = len(strip_html(text).split())
    if words <= 0:
        return ""
    minutes = max(1, round(words / 200))
    return f"{minutes} min read"


def map_wp_post(
    wp_post: WpPost,
    meta: dict[str, str],
    *,
    category_name: str = "",
    author_name: str = "",
) -> dict[str, Any]:
    slug = wp_post.post_name.strip().lower()
    excerpt = strip_html(wp_post.post_excerpt) or strip_html(meta.get("rank_math_description", ""))[:500]
    if not excerpt and wp_post.post_content:
        excerpt = strip_html(wp_post.post_content)[:500]

    payload = {
        "title": (wp_post.post_title or slug.replace("-", " ").title())[:255],
        "slug": slug,
        "excerpt": excerpt,
        "body": normalize_wp_html(wp_post.post_content),
        "published_date": parse_post_date(wp_post.post_date),
        "read_time": estimate_read_time(wp_post.post_content),
        "category_name": category_name or "Articles",
        "author_name": author_name or "Finprov Learning",
        "wp_post_id": wp_post.wp_id,
        "thumbnail_id": (meta.get("_thumbnail_id") or "").strip(),
        "import_source": "wordpress_sql",
    }
    payload["source_hash"] = hashlib.sha256(
        json.dumps(
            {key: value for key, value in payload.items() if key != "source_hash"},
            ensure_ascii=False,
            sort_keys=True,
            default=str,
        ).encode()
    ).hexdigest()
    return payload


def rank_math_to_blog_seo(meta: dict[str, str], *, slug: str, site_base: str = "https://finprov.com") -> dict[str, str]:
    from migration.wp_sql import rank_math_to_seo

    seo = rank_math_to_seo(meta, slug=slug, site_base=site_base)
    canonical = meta.get("rank_math_canonical_url", "").strip()
    if not canonical:
        blog_url = f"{site_base.rstrip('/')}/blog/{slug}/"
        seo["canonical_url"] = blog_url[:200]
        seo["og_url"] = blog_url[:200]
    seo["schema_type"] = "blogposting"
    seo["include_in_sitemap"] = False
    return seo

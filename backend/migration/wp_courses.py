"""Map LearnDash course rows + postmeta into Django Course field payloads."""

from __future__ import annotations

import hashlib
import html
import json
import re
from typing import Any

from migration.wp_sql import WpPost

LI_RE = re.compile(r"<li[^>]*>(.*?)</li>", re.I | re.S)
FAQ_QUESTION_RE = re.compile(r's:8:"question";s:\d+:"((?:\\.|[^"\\])*)"')
FAQ_ANSWER_RE = re.compile(r's:6:"answer";s:\d+:"((?:\\.|[^"\\])*)"')


def strip_html(text: str) -> str:
    text = html.unescape(text or "")
    text = re.sub(r"<br\s*/?>", "\n", text, flags=re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def parse_html_list(html_text: str) -> list[str]:
    items: list[str] = []
    for match in LI_RE.finditer(html_text or ""):
        item = strip_html(match.group(1))
        if item:
            items.append(item)
    return items


def _unescape_php_string(value: str) -> str:
    return (
        value.replace('\\"', '"')
        .replace("\\r\\n", "\n")
        .replace("\\n", "\n")
        .replace("rn", "\n")
    )


def parse_faq_entries(raw: str) -> list[dict[str, str]]:
    if not raw or not raw.strip():
        return []
    questions = FAQ_QUESTION_RE.findall(raw)
    answers = FAQ_ANSWER_RE.findall(raw)
    entries: list[dict[str, str]] = []
    for question, answer in zip(questions, answers):
        entries.append(
            {
                "question": _unescape_php_string(question).strip()[:500],
                "answer": _unescape_php_string(answer).strip(),
            }
        )
    return entries


def infer_category(slug: str, title: str) -> str:
    blob = f"{slug} {title}".lower()
    if any(keyword in blob for keyword in ("gulf", "uae", "vat", "gaap", "sap-s-4hana")):
        return "Gulf"
    if any(keyword in blob for keyword in ("marketing", "seo", "digital")):
        return "Marketing"
    if any(keyword in blob for keyword in ("analytics", "data", "excel", "mis", "bi ")):
        return "Analytics"
    if any(keyword in blob for keyword in ("gst", "tax", "tds", "itr", "income-tax")):
        return "Taxation"
    return "Finance"


def infer_program_type(slug: str, title: str) -> str:
    blob = f"{slug} {title}".lower()
    if any(keyword in blob for keyword in ("job-assured", "job assured", "basp", "cbat", "chrpp")):
        return "Job Assured"
    if any(keyword in blob for keyword in ("executive", "bootcamp", "boot-camp", "leadership")):
        return "Executive"
    return "Certification"


def map_wp_course(wp_post: WpPost, meta: dict[str, str]) -> dict[str, Any]:
    slug = wp_post.post_name.strip().lower()
    highlights: list[str] = []
    for index in range(1, 7):
        title = (meta.get(f"key_highlights_{index}_title") or "").strip()
        description = (meta.get(f"key_highlights_{index}_description") or "").strip()
        if title and description:
            highlights.append(f"{title}: {description}")
        elif title:
            highlights.append(title)
        elif description:
            highlights.append(description)

    skills = parse_html_list(meta.get("skills_you_will_gain", ""))
    audiences = parse_html_list(meta.get("what_youll_learn", ""))
    fee_parts: list[str] = []
    sale_price = (meta.get("sale_price") or "").strip()
    regular_price = (meta.get("regular_price") or "").strip()
    if sale_price:
        fee_parts.append(sale_price)
    if regular_price and regular_price != sale_price:
        fee_parts.append(f"Regular: {regular_price}")

    short_description = strip_html(meta.get("_learndash_course_grid_short_description") or wp_post.post_content)
    hero_description = strip_html(meta.get("about_the_course", ""))

    payload = {
        "title": (wp_post.post_title or slug.replace("-", " ").title())[:255],
        "slug": slug,
        "short_description": short_description,
        "hero_description": hero_description,
        "duration": (meta.get("duration") or "")[:100],
        "mode": (meta.get("language") or "")[:100],
        "fee_summary": ", ".join(fee_parts)[:500],
        "online_fees": sale_price[:255],
        "offline_fees": regular_price[:255],
        "highlights": highlights,
        "skills": skills,
        "audiences": audiences,
        "faqs": parse_faq_entries(meta.get("faq", "")),
        "category": infer_category(slug, wp_post.post_title),
        "program_type": infer_program_type(slug, wp_post.post_title),
        "wp_post_id": wp_post.wp_id,
        "import_source": "wordpress_sql",
    }
    payload["source_hash"] = hashlib.sha256(
        json.dumps(payload, ensure_ascii=False, sort_keys=True).encode()
    ).hexdigest()
    return payload


def rank_math_to_course_seo(meta: dict[str, str], *, slug: str, site_base: str = "https://finprov.com") -> dict[str, str]:
    from migration.wp_sql import decode_rank_math_robots, rank_math_to_seo

    seo = rank_math_to_seo(meta, slug=slug, site_base=site_base)
    canonical = meta.get("rank_math_canonical_url", "").strip()
    if not canonical:
        course_url = f"{site_base.rstrip('/')}/courses/{slug}/"
        seo["canonical_url"] = course_url[:200]
        seo["og_url"] = course_url[:200]
    seo["schema_type"] = "course"
    seo["include_in_sitemap"] = False
    if not seo["meta_robots"]:
        seo["meta_robots"] = decode_rank_math_robots(meta.get("rank_math_robots", ""))
    return seo

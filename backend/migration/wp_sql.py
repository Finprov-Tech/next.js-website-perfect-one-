"""Stream-parser for phpMyAdmin dumps — wp_posts and wp_postmeta."""

from __future__ import annotations

import html
import re
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterator

POSTS_INSERT = re.compile(r"INSERT INTO `wp_posts`", re.IGNORECASE)
POSTMETA_INSERT = re.compile(r"INSERT INTO `wp_postmeta`", re.IGNORECASE)

RANK_MATH_KEYS = {
    "rank_math_title",
    "rank_math_description",
    "rank_math_focus_keyword",
    "rank_math_canonical_url",
    "rank_math_robots",
    "rank_math_facebook_title",
    "rank_math_facebook_description",
    "rank_math_facebook_image",
    "rank_math_twitter_title",
    "rank_math_twitter_description",
}

COURSE_CONTENT_META_KEYS = {
    "_learndash_course_grid_short_description",
    "about_the_course",
    "what_youll_learn",
    "skills_you_will_gain",
    "duration",
    "regular_price",
    "sale_price",
    "faq",
    "language",
    "lectures",
    "quizzes",
    "assessments",
    "demo_class_link",
    "intro_video_url",
    "course_sections",
    "syllabus",
}
for _highlight_index in range(1, 7):
    COURSE_CONTENT_META_KEYS.add(f"key_highlights_{_highlight_index}_title")
    COURSE_CONTENT_META_KEYS.add(f"key_highlights_{_highlight_index}_description")

COURSE_META_KEYS = COURSE_CONTENT_META_KEYS | RANK_MATH_KEYS

BLOG_META_KEYS = RANK_MATH_KEYS | {"_thumbnail_id"}


@dataclass
class WpPost:
    wp_id: int
    post_author: int
    post_date: str
    post_title: str
    post_excerpt: str
    post_name: str
    post_status: str
    post_type: str
    post_parent: int
    post_content: str
    guid: str


@dataclass
class WpPostMeta:
    post_id: int
    meta_key: str
    meta_value: str


@dataclass
class WpInventory:
    database_hint: str = ""
    siteurl: str = ""
    home: str = ""
    total_rows: int = 0
    by_type: dict[str, int] = field(default_factory=dict)
    by_status: dict[str, int] = field(default_factory=dict)
    published_by_type: dict[str, int] = field(default_factory=dict)
    migration_targets: dict[str, int] = field(default_factory=dict)
    sample_slugs: dict[str, list[str]] = field(default_factory=dict)
    static_page_slugs: list[str] = field(default_factory=list)
    rank_math_redirects: int = 0


def _read_sql_string(data: str, i: int) -> tuple[str, int]:
    assert data[i] == "'"
    i += 1
    out: list[str] = []
    while i < len(data):
        ch = data[i]
        if ch == "\\" and i + 1 < len(data):
            out.append(data[i + 1])
            i += 2
            continue
        if ch == "'":
            if i + 1 < len(data) and data[i + 1] == "'":
                out.append("'")
                i += 2
                continue
            return "".join(out), i + 1
        out.append(ch)
        i += 1
    raise ValueError("need more data")


def _skip_ws(data: str, i: int) -> int:
    while i < len(data) and data[i] in " \t\r\n":
        i += 1
    return i


def _parse_sql_value(data: str, i: int) -> tuple[object, int]:
    i = _skip_ws(data, i)
    if i >= len(data):
        raise ValueError("need more data")
    if data[i] == "'":
        return _read_sql_string(data, i)
    if data.startswith("NULL", i):
        return None, i + 4
    num_match = re.match(r"-?\d+", data[i:])
    if num_match:
        text = num_match.group(0)
        return int(text), i + len(text)
    raise ValueError(f"unsupported literal: {data[i : i + 20]!r}")


def _parse_tuple(data: str, i: int, field_count: int) -> tuple[list[object], int]:
    i = _skip_ws(data, i)
    if i >= len(data) or data[i] != "(":
        raise ValueError("need more data")
    i += 1
    values: list[object] = []
    for idx in range(field_count):
        if idx:
            i = _skip_ws(data, i)
            if i >= len(data) or data[i] != ",":
                raise ValueError("need more data")
            i += 1
        i = _skip_ws(data, i)
        val, i = _parse_sql_value(data, i)
        values.append(val)
    i = _skip_ws(data, i)
    if i >= len(data) or data[i] != ")":
        raise ValueError("need more data")
    return values, i + 1


def _parse_posts_tuple(data: str, i: int) -> tuple[WpPost, int]:
    values, i = _parse_tuple(data, i, 23)
    return WpPost(
        wp_id=int(values[0]),
        post_author=int(values[1] or 0),
        post_date=str(values[2] or ""),
        post_title=str(values[5] or ""),
        post_excerpt=str(values[6] or ""),
        post_name=str(values[11] or ""),
        post_status=str(values[7] or ""),
        post_type=str(values[20] or ""),
        post_parent=int(values[17] or 0),
        post_content=str(values[4] or ""),
        guid=str(values[18] or ""),
    ), i


def _parse_postmeta_tuple(data: str, i: int) -> tuple[WpPostMeta, int]:
    values, i = _parse_tuple(data, i, 4)
    return WpPostMeta(
        post_id=int(values[1]),
        meta_key=str(values[2] or ""),
        meta_value=str(values[3] or "") if values[3] is not None else "",
    ), i


def _extract_tuple_strings(section: str) -> Iterator[str]:
    depth = 0
    in_string = False
    escape = False
    start = -1
    idx = 0
    while idx < len(section):
        ch = section[idx]
        if in_string:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == "'":
                if idx + 1 < len(section) and section[idx + 1] == "'":
                    idx += 1
                else:
                    in_string = False
            idx += 1
            continue
        if ch == "'":
            in_string = True
            idx += 1
            continue
        if ch == "(":
            if depth == 0:
                start = idx
            depth += 1
            idx += 1
            continue
        if ch == ")":
            depth -= 1
            if depth == 0 and start >= 0:
                yield section[start : idx + 1]
                start = -1
            idx += 1
            continue
        idx += 1


def _iter_insert_sections(sql_path: Path, table_name: str) -> Iterator[str]:
    marker = f"INSERT INTO `{table_name}`"
    collecting = False
    section_parts: list[str] = []

    with sql_path.open("r", encoding="utf-8", errors="replace") as handle:
        for line in handle:
            if not collecting:
                if marker not in line:
                    continue
                collecting = True
                values_at = line.find("VALUES")
                section_parts.append(line[values_at + 6 :] if values_at != -1 else "")
                if line.rstrip().endswith(";"):
                    collecting = False
                continue

            section_parts.append(line)
            if line.rstrip().endswith(";"):
                collecting = False

            if not collecting:
                yield "".join(section_parts)
                section_parts = []

        if section_parts:
            yield "".join(section_parts)


def iter_wp_posts(sql_path: Path) -> Iterator[WpPost]:
    for section in _iter_insert_sections(sql_path, "wp_posts"):
        for tuple_text in _extract_tuple_strings(section):
            try:
                post, _ = _parse_posts_tuple(tuple_text, 0)
            except ValueError:
                continue
            yield post


def iter_wp_postmeta(
    sql_path: Path,
    post_ids: set[int] | None = None,
    *,
    allowed_keys: set[str] | None = RANK_MATH_KEYS,
) -> Iterator[WpPostMeta]:
    for section in _iter_insert_sections(sql_path, "wp_postmeta"):
        for tuple_text in _extract_tuple_strings(section):
            try:
                row, _ = _parse_postmeta_tuple(tuple_text, 0)
            except ValueError:
                continue
            if post_ids is not None and row.post_id not in post_ids:
                continue
            if allowed_keys is not None and row.meta_key not in allowed_keys:
                continue
            yield row


def build_rank_math_index(sql_path: Path, post_ids: set[int]) -> dict[int, dict[str, str]]:
    index: dict[int, dict[str, str]] = defaultdict(dict)
    for row in iter_wp_postmeta(sql_path, post_ids, allowed_keys=RANK_MATH_KEYS):
        index[row.post_id][row.meta_key] = row.meta_value
    return dict(index)


def build_course_meta_index(sql_path: Path, post_ids: set[int]) -> dict[int, dict[str, str]]:
    index: dict[int, dict[str, str]] = defaultdict(dict)
    for row in iter_wp_postmeta(sql_path, post_ids, allowed_keys=COURSE_META_KEYS):
        index[row.post_id][row.meta_key] = row.meta_value
    return dict(index)


def build_blog_meta_index(sql_path: Path, post_ids: set[int]) -> dict[int, dict[str, str]]:
    index: dict[int, dict[str, str]] = defaultdict(dict)
    for row in iter_wp_postmeta(sql_path, post_ids, allowed_keys=BLOG_META_KEYS):
        index[row.post_id][row.meta_key] = row.meta_value
    return dict(index)


def _parse_terms_tuple(data: str, i: int) -> tuple[tuple[int, str, str], int]:
    values, i = _parse_tuple(data, i, 4)
    return (int(values[0]), str(values[1] or ""), str(values[2] or "")), i


def _parse_term_taxonomy_tuple(data: str, i: int) -> tuple[tuple[int, int, str], int]:
    values, i = _parse_tuple(data, i, 6)
    return (int(values[0]), int(values[1]), str(values[2] or "")), i


def _parse_term_relationship_tuple(data: str, i: int) -> tuple[tuple[int, int], int]:
    values, i = _parse_tuple(data, i, 3)
    return (int(values[0]), int(values[1])), i


def build_post_category_index(sql_path: Path, post_ids: set[int]) -> dict[int, str]:
    terms: dict[int, tuple[str, str]] = {}
    for section in _iter_insert_sections(sql_path, "wp_terms"):
        for tuple_text in _extract_tuple_strings(section):
            try:
                term_id, name, slug = _parse_terms_tuple(tuple_text, 0)[0]
            except ValueError:
                continue
            terms[term_id] = (name, slug)

    taxonomy_by_id: dict[int, tuple[int, str]] = {}
    for section in _iter_insert_sections(sql_path, "wp_term_taxonomy"):
        for tuple_text in _extract_tuple_strings(section):
            try:
                taxonomy_id, term_id, taxonomy = _parse_term_taxonomy_tuple(tuple_text, 0)[0]
            except ValueError:
                continue
            if taxonomy == "category":
                taxonomy_by_id[taxonomy_id] = (term_id, taxonomy)

    categories: dict[int, str] = {}
    for section in _iter_insert_sections(sql_path, "wp_term_relationships"):
        for tuple_text in _extract_tuple_strings(section):
            try:
                object_id, taxonomy_id = _parse_term_relationship_tuple(tuple_text, 0)[0]
            except ValueError:
                continue
            if object_id not in post_ids or taxonomy_id not in taxonomy_by_id:
                continue
            term_id, _taxonomy = taxonomy_by_id[taxonomy_id]
            name = terms.get(term_id, ("", ""))[0]
            if name and name.lower() != "uncategorized":
                categories.setdefault(object_id, name)
    return categories


def build_wp_user_index(sql_path: Path) -> dict[int, str]:
    users: dict[int, str] = {}
    for section in _iter_insert_sections(sql_path, "wp_users"):
        for tuple_text in _extract_tuple_strings(section):
            try:
                values, _ = _parse_tuple(tuple_text, 0, 10)
            except ValueError:
                continue
            user_id = int(values[0])
            display_name = str(values[8] or values[1] or "")
            if display_name:
                users[user_id] = display_name
    return users


def decode_rank_math_robots(raw: str) -> str:
    if not raw:
        return "index,follow"
    lowered = raw.lower()
    noindex = "noindex" in lowered
    nofollow = "nofollow" in lowered
    if noindex and nofollow:
        return "noindex,nofollow"
    if noindex:
        return "noindex,follow"
    if nofollow:
        return "index,nofollow"
    return "index,follow"


def rank_math_to_seo(meta: dict[str, str], *, slug: str, site_base: str = "https://finprov.com") -> dict[str, str]:
    title = html.unescape(meta.get("rank_math_title", "")).strip()
    description = html.unescape(meta.get("rank_math_description", "")).strip()
    focus_keyword = html.unescape(meta.get("rank_math_focus_keyword", "")).strip()
    canonical = meta.get("rank_math_canonical_url", "").strip() or f"{site_base.rstrip('/')}/{slug}/"
    og_title = html.unescape(meta.get("rank_math_facebook_title", "") or meta.get("rank_math_twitter_title", "") or title).strip()
    og_description = html.unescape(
        meta.get("rank_math_facebook_description", "") or meta.get("rank_math_twitter_description", "") or description
    ).strip()
    robots = decode_rank_math_robots(meta.get("rank_math_robots", ""))
    return {
        "seo_title": title[:255],
        "meta_description": description[:320],
        "focus_keyword": focus_keyword[:255],
        "canonical_url": canonical[:200],
        "meta_robots": robots,
        "og_title": og_title[:255],
        "og_description": og_description[:320],
        "og_url": canonical[:200],
        "schema_type": "webpage",
        "include_in_sitemap": False,
    }


MIGRATION_TYPES = {
    "page": "cms_page_or_landing",
    "post": "blog_post",
    "sfwd-courses": "course",
}

STATIC_PAGE_SLUGS = {
    "about",
    "contact",
    "team",
    "placement",
    "placements",
    "faq",
    "admission",
    "events",
    "testimonials",
    "privacy-policy",
    "terms-and-conditions",
    "verify-student-certificate",
    "all-courses",
    "business",
    "career",
    "blog",
    "home",
    "home-2",
    "sample-page",
}

PAGE_TYPE_BY_SLUG = {
    "home": "Home",
    "home-2": "Home",
    "about": "About",
    "all-courses": "Courses",
    "courses": "Courses",
    "course-details": "Courses",
    "blog": "Blogs",
    "placement": "Placements",
    "placements": "Placements",
    "contact": "Contact",
    "career": "Careers",
}


def classify_page_type(slug: str) -> str:
    return PAGE_TYPE_BY_SLUG.get(slug, "Landing Page")


def is_landing_page(slug: str) -> bool:
    if slug in {"sample-page"}:
        return False
    if slug in PAGE_TYPE_BY_SLUG and PAGE_TYPE_BY_SLUG[slug] != "Landing Page":
        return slug not in {"home", "home-2"} or True  # home still gets landing body from WP content
    return True


def _extract_option(sql_path: Path, option_name: str) -> str:
    needle = f"'{option_name}', '"
    with sql_path.open("r", encoding="utf-8", errors="replace") as handle:
        for line in handle:
            if needle not in line:
                continue
            start = line.index(needle) + len(needle)
            end = line.find("', '", start)
            if end == -1:
                continue
            return line[start:end]
    return ""


def _count_rank_math_redirects(sql_path: Path) -> int:
    count = 0
    with sql_path.open("r", encoding="utf-8", errors="replace") as handle:
        for line in handle:
            if "INSERT INTO `wp_rank_math_redirections`" in line:
                count += max(0, line.count("),("))
                count += 1
    return count


def build_inventory(sql_path: Path) -> WpInventory:
    inventory = WpInventory()
    inventory.database_hint = "finprovadmin_finprov"
    inventory.siteurl = _extract_option(sql_path, "siteurl")
    inventory.home = _extract_option(sql_path, "home")
    inventory.rank_math_redirects = _count_rank_math_redirects(sql_path)

    by_type: Counter[str] = Counter()
    by_status: Counter[str] = Counter()
    published_by_type: Counter[str] = Counter()
    migration_targets: Counter[str] = Counter()
    samples: dict[str, list[str]] = defaultdict(list)

    for post in iter_wp_posts(sql_path):
        inventory.total_rows += 1
        by_type[post.post_type] += 1
        by_status[post.post_status] += 1
        if post.post_status == "publish":
            published_by_type[post.post_type] += 1
            target = MIGRATION_TYPES.get(post.post_type, "review_or_skip")
            migration_targets[target] += 1
            if len(samples[post.post_type]) < 8 and post.post_name:
                samples[post.post_type].append(post.post_name)
            if post.post_type == "page" and post.post_name in STATIC_PAGE_SLUGS:
                inventory.static_page_slugs.append(post.post_name)

    inventory.by_type = dict(by_type)
    inventory.by_status = dict(by_status)
    inventory.published_by_type = dict(published_by_type)
    inventory.migration_targets = dict(migration_targets)
    inventory.sample_slugs = dict(samples)
    inventory.static_page_slugs = sorted(set(inventory.static_page_slugs))
    return inventory


def load_published_pages(sql_path: Path) -> list[WpPost]:
    pages = [post for post in iter_wp_posts(sql_path) if post.post_type == "page" and post.post_status == "publish"]
    pages.sort(key=lambda row: row.wp_id)
    return pages


def load_published_courses(sql_path: Path) -> list[WpPost]:
    courses = [
        post for post in iter_wp_posts(sql_path) if post.post_type == "sfwd-courses" and post.post_status == "publish"
    ]
    courses.sort(key=lambda row: row.wp_id)
    return courses


def load_published_posts(sql_path: Path) -> list[WpPost]:
    posts = [post for post in iter_wp_posts(sql_path) if post.post_type == "post" and post.post_status == "publish"]
    posts.sort(key=lambda row: row.wp_id)
    return posts

"""Day 3 helpers — slug parity, SEO cleanup, bulk publish."""

from __future__ import annotations

import json
import re
from pathlib import Path

from blog.models import BlogPost
from courses.models import Course, CourseAlias
from pages.models import Page
from seo.models import SEOMeta

RANK_MATH_TEMPLATE_TOKENS = ("%page%", "%sep%", "%sitename%")
DEFAULT_SITE_NAME = "Finprov Learning"
DEFAULT_SEP = "|"


def load_live_sitemap(path: Path) -> dict[str, set[str]]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    cms = set(payload.get("cmsLanding") or [])
    courses = set(payload.get("courses") or [])
    blogs = set(payload.get("blogs") or [])
    static = set(payload.get("static") or [])
    business = set(payload.get("business") or [])
    return {
        "cms_landing": cms,
        "courses": courses,
        "blogs": blogs,
        "static": static,
        "business": business,
    }


def cms_page_slugs() -> set[str]:
    return set(Page.objects.filter(wp_post_id__isnull=False).values_list("slug", flat=True))


def cms_course_slugs() -> set[str]:
    primary = set(Course.objects.values_list("slug", flat=True))
    aliases = set(CourseAlias.objects.values_list("slug", flat=True))
    return primary | aliases


def cms_blog_slugs() -> set[str]:
    return set(BlogPost.objects.values_list("slug", flat=True))


def parity_report(live_path: Path) -> dict[str, object]:
    live = load_live_sitemap(live_path)
    page_slugs = cms_page_slugs()
    course_slugs = cms_course_slugs()
    blog_slugs = cms_blog_slugs()

    live_cms = live["cms_landing"]
    live_courses = live["courses"]
    live_blogs = live["blogs"] | live_cms  # WP blog posts often live at root slug URLs

    return {
        "pages": {
            "live": len(live_cms),
            "cms": len(page_slugs),
            "missing_in_cms": sorted(live_cms - page_slugs)[:50],
            "missing_in_cms_count": len(live_cms - page_slugs),
            "extra_in_cms": sorted(page_slugs - live_cms)[:50],
            "extra_in_cms_count": len(page_slugs - live_cms),
            "overlap": len(live_cms & page_slugs),
        },
        "courses": {
            "live": len(live_courses),
            "cms": len(course_slugs),
            "missing_in_cms": sorted(live_courses - course_slugs)[:50],
            "missing_in_cms_count": len(live_courses - course_slugs),
            "extra_in_cms": sorted(course_slugs - live_courses)[:50],
            "extra_in_cms_count": len(course_slugs - live_courses),
            "overlap": len(live_courses & course_slugs),
        },
        "blogs": {
            "live": len(live_blogs),
            "cms": len(blog_slugs),
            "missing_in_cms": sorted(live_blogs - blog_slugs)[:50],
            "missing_in_cms_count": len(live_blogs - blog_slugs),
            "extra_in_cms": sorted(blog_slugs - live_blogs)[:50],
            "extra_in_cms_count": len(blog_slugs - live_blogs),
            "overlap": len(live_blogs & blog_slugs),
        },
    }


def seo_target_title(seo: SEOMeta) -> str:
    if seo.page_id:
        return seo.page.name
    if seo.blog_post_id:
        return seo.blog_post.title
    if seo.course_id:
        return seo.course.title
    return ""


def clean_seo_title(raw: str, *, fallback_title: str = "") -> str:
    title = (raw or "").strip()
    if not any(token in title for token in RANK_MATH_TEMPLATE_TOKENS):
        return title[:255]
    if fallback_title:
        return fallback_title[:255]
    cleaned = title
    for token in RANK_MATH_TEMPLATE_TOKENS:
        if token == "%page%":
            cleaned = cleaned.replace(token, fallback_title or "")
        elif token == "%sep%":
            cleaned = cleaned.replace(token, f" {DEFAULT_SEP} ")
        elif token == "%sitename%":
            cleaned = cleaned.replace(token, DEFAULT_SITE_NAME)
    cleaned = re.sub(r"\s+", " ", cleaned).strip(" |")
    return (cleaned or fallback_title)[:255]


def fix_seo_templates() -> int:
    updated = 0
    for seo in SEOMeta.objects.select_related("page", "blog_post", "course").iterator():
        if not any(token in (seo.seo_title or "") for token in RANK_MATH_TEMPLATE_TOKENS):
            continue
        fallback = seo_target_title(seo)
        new_title = clean_seo_title(seo.seo_title, fallback_title=fallback)
        if new_title and new_title != seo.seo_title:
            seo.seo_title = new_title
            seo.save(update_fields=["seo_title", "updated_at"])
            updated += 1
    return updated


def publish_migration(*, include_legacy_courses: bool = False) -> dict[str, int]:
    page_qs = Page.objects.filter(wp_post_id__isnull=False, status=Page.STATUS_DRAFT)
    course_qs = Course.objects.filter(source_payload__import_source="wordpress_sql", status=Course.STATUS_DRAFT)
    if include_legacy_courses:
        course_qs = Course.objects.filter(status=Course.STATUS_DRAFT)
    blog_qs = BlogPost.objects.filter(status=BlogPost.STATUS_DRAFT)

    pages_published = page_qs.update(status=Page.STATUS_PUBLISHED)
    courses_published = course_qs.update(status=Course.STATUS_PUBLISHED)
    blogs_published = blog_qs.update(status=BlogPost.STATUS_PUBLISHED)

    seo_page_ids = list(Page.objects.filter(wp_post_id__isnull=False).values_list("id", flat=True))
    seo_course_ids = list(
        Course.objects.filter(source_payload__import_source="wordpress_sql").values_list("id", flat=True)
    )
    if include_legacy_courses:
        seo_course_ids = list(Course.objects.values_list("id", flat=True))
    seo_blog_ids = list(BlogPost.objects.values_list("id", flat=True))

    seo_enabled = 0
    seo_enabled += SEOMeta.objects.filter(page_id__in=seo_page_ids, include_in_sitemap=False).update(include_in_sitemap=True)
    seo_enabled += SEOMeta.objects.filter(course_id__in=seo_course_ids, include_in_sitemap=False).update(include_in_sitemap=True)
    seo_enabled += SEOMeta.objects.filter(blog_post_id__in=seo_blog_ids, include_in_sitemap=False).update(include_in_sitemap=True)

    return {
        "pages_published": pages_published,
        "courses_published": courses_published,
        "blogs_published": blogs_published,
        "seo_sitemap_enabled": seo_enabled,
    }

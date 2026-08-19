"""Compare live finprov.com sitemap XML exports against Django CMS migration state."""

from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

import django

BACKEND = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cms.settings")
django.setup()

from blog.models import BlogPost  # noqa: E402
from courses.models import Course, CourseAlias  # noqa: E402
from pages.models import Page  # noqa: E402
from seo.models import Redirect  # noqa: E402

SITEMAP_DIR = Path(r"C:\Users\FINPROV\Desktop\finprov\Sitemap")
OUTPUT = BACKEND / "migration" / "live_sitemap_gap_report.json"

LOC_RE = re.compile(r"<loc>\s*(.*?)\s*</loc>", re.I | re.S)

NEXT_STATIC = {
    "about",
    "admission",
    "all-courses",
    "blog",
    "business",
    "career",
    "contact",
    "events",
    "faq",
    "placement",
    "placements",
    "privacy-policy",
    "team",
    "terms-and-conditions",
    "testimonials",
    "verify-student-certificate",
}


def parse_urls(folder: Path) -> list[str]:
    urls: list[str] = []
    for path in sorted(folder.glob("*.xml")):
        text = path.read_text(encoding="utf-8", errors="replace")
        if "<sitemapindex" in text:
            continue
        for match in LOC_RE.findall(text):
            url = match.strip()
            if url.startswith("http"):
                urls.append(url)
    return urls


def slug_from_url(url: str) -> tuple[str, str]:
    parsed = urlparse(url)
    path = parsed.path.strip("/")
    if not path:
        return "(home)", "home"
    segments = path.split("/")
    if segments[0] == "courses" and len(segments) == 2:
        return segments[1], "course"
    if segments[0] == "blog" and len(segments) == 2:
        return segments[1], "blog"
    if segments[0] == "career" and len(segments) == 2:
        return segments[1], "career"
    if segments[0] == "business" and len(segments) == 2:
        return segments[1], "business"
    if len(segments) == 1:
        if segments[0] in NEXT_STATIC:
            return segments[0], "static"
        return segments[0], "cms-landing"
    return path, "other"


def normalize_path(path: str) -> str:
    if not path.startswith("/"):
        path = f"/{path}"
    if not path.endswith("/"):
        path = f"{path}/"
    return path


def load_cms_indexes():
    pages = set(Page.objects.values_list("slug", flat=True))
    wp_pages = set(Page.objects.filter(wp_post_id__isnull=False).values_list("slug", flat=True))
    courses = set(Course.objects.values_list("slug", flat=True))
    aliases = set(CourseAlias.objects.values_list("slug", flat=True))
    blogs = set(BlogPost.objects.values_list("slug", flat=True))
    redirects_old = set(Redirect.objects.filter(is_active=True).values_list("old_path", flat=True))
    redirects_new = set(Redirect.objects.filter(is_active=True).values_list("new_path", flat=True))
    return {
        "pages": pages,
        "wp_pages": wp_pages,
        "courses": courses | aliases,
        "blogs": blogs,
        "redirects_old": redirects_old,
        "redirects_new": redirects_new,
    }


def classify(slug: str, url_type: str, cms: dict[str, set[str]]) -> str:
    path = normalize_path(slug if url_type != "course" else f"courses/{slug}")
    if url_type == "home":
        return "static-nextjs"
    if url_type == "static":
        return "static-nextjs"
    if url_type == "business":
        return "static-nextjs"
    if url_type == "career":
        return "static-nextjs"
    if url_type == "other":
        return "out-of-scope"
    if path in cms["redirects_old"]:
        return "redirect-source"
    if slug in cms["courses"]:
        return "course-cms"
    if slug in cms["blogs"]:
        return "blog-cms"
    if slug in cms["wp_pages"]:
        return "landing-cms"
    if slug in cms["pages"]:
        return "landing-cms-seed"
    if path in cms["redirects_new"]:
        return "redirect-target"
    return "missing"


def main():
    urls = parse_urls(SITEMAP_DIR)
    unique_urls = sorted(set(urls))
    cms = load_cms_indexes()

    by_type: dict[str, list[str]] = {}
    by_status: dict[str, list[dict[str, str]]] = {}
    for url in unique_urls:
        slug, url_type = slug_from_url(url)
        by_type.setdefault(url_type, []).append(url)
        status = classify(slug, url_type, cms)
        by_status.setdefault(status, []).append({"url": url, "slug": slug, "type": url_type})

    migratable = [u for u in unique_urls if slug_from_url(u)[1] in {"course", "cms-landing", "blog"}]
    missing = by_status.get("missing", [])

    report = {
        "source_folder": str(SITEMAP_DIR),
        "files_parsed": len(list(SITEMAP_DIR.glob("*.xml"))),
        "total_urls_raw": len(urls),
        "total_urls_unique": len(unique_urls),
        "by_url_type": {key: len(value) for key, value in sorted(by_type.items())},
        "by_migration_status": {key: len(value) for key, value in sorted(by_status.items())},
        "coverage": {
            "migratable_urls": len(migratable),
            "covered": len(migratable) - len([m for m in missing if m["type"] in {"course", "cms-landing", "blog"}]),
            "missing_migratable": len([m for m in missing if m["type"] in {"course", "cms-landing", "blog"}]),
        },
        "missing_sample": missing[:40],
        "missing_all": missing,
    }

    OUTPUT.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps({k: report[k] for k in report if k not in {"missing_sample", "missing_all"}}, indent=2))
    print(f"\nFull report: {OUTPUT}")
    print(f"Missing migratable URLs: {report['coverage']['missing_migratable']}")


if __name__ == "__main__":
    main()

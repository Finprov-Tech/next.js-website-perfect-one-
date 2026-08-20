"""Fetch and parse live finprov.com pages for gap-fill migration."""

from __future__ import annotations

import html
import re
import ssl
import time
import urllib.error
import urllib.request
from dataclasses import dataclass

from migration.wp_blog import normalize_wp_html

USER_AGENT = "FinprovMigrationBot/1.0 (+https://finprov.com)"
REQUEST_DELAY_SEC = 0.4

TITLE_RE = re.compile(r"<title[^>]*>(.*?)</title>", re.I | re.S)
META_DESC_RE = re.compile(
    r'<meta\s+(?:name="description"|property="og:description")\s+content="([^"]*)"',
    re.I,
)
CANONICAL_RE = re.compile(r'<link\s+rel="canonical"\s+href="([^"]+)"', re.I)
ROBOTS_RE = re.compile(r'<meta\s+name="robots"\s+content="([^"]+)"', re.I)
OG_TITLE_RE = re.compile(r'<meta\s+property="og:title"\s+content="([^"]+)"', re.I)
ARTICLE_PUBLISHED_RE = re.compile(
    r'<meta\s+property="article:published_time"\s+content="([^"]+)"',
    re.I,
)
TIME_DATETIME_RE = re.compile(r'<time[^>]+datetime="([^"]+)"', re.I)
ARTICLE_RE = re.compile(r'<article[^>]*class="[^"]*\bpost-\d+\b[^"]*"[^>]*>(.*)</article>', re.I | re.S)
ENTRY_CONTENT_RE = re.compile(
    r'<div[^>]*class="[^"]*\bentry-content\b[^"]*"[^>]*>(.*?)</div>\s*(?:<(?:footer|aside|div class="ast-single-entry-banner)|\Z)',
    re.I | re.S,
)
ELEMENTOR_POST_CONTENT_RE = re.compile(
    r'data-widget_type="theme-post-content\.default"[^>]*>\s*<div class="elementor-widget-container">(.*?)</div>\s*</div>',
    re.I | re.S,
)
H1_RE = re.compile(r"<h1[^>]*>(.*?)</h1>", re.I | re.S)
POST_TYPE_HINT_RE = re.compile(r'body[^>]+class="[^"]*\b(post|page|single-sfwd-courses)\b', re.I)


@dataclass
class ScrapedAuthor:
    name: str = ""
    bio: str = ""
    photo_url: str = ""
    role: str = ""


@dataclass
class ScrapedPage:
    url: str
    slug: str
    status_code: int
    title: str
    excerpt: str
    body_html: str
    canonical_url: str
    seo_title: str
    meta_description: str
    meta_robots: str
    content_type: str  # blog | landing | course | unknown
    published_date: str = ""
    author: ScrapedAuthor | None = None
    error: str = ""


def _strip_tags(text: str) -> str:
    text = html.unescape(re.sub(r"<[^>]+>", " ", text or ""))
    return re.sub(r"\s+", " ", text).strip()


def _detect_content_type(page_html: str) -> str:
    lowered = page_html.lower()
    if "single-sfwd-courses" in lowered or "type-sfwd-courses" in lowered:
        return "course"
    if "type-post" in lowered or "post-template-default" in lowered:
        return "blog"
    if "type-page" in lowered:
        return "landing"
    match = POST_TYPE_HINT_RE.search(page_html)
    if match:
        kind = match.group(1)
        if kind == "post":
            return "blog"
        if kind == "sfwd-courses":
            return "course"
        return "landing"
    return "unknown"


def _extract_balanced_div_inner(html: str, open_pos: int) -> str:
    """Return inner HTML for the div whose opening tag starts at open_pos."""
    tag_end = html.find(">", open_pos)
    if tag_end < 0:
        return ""
    depth = 1
    idx = tag_end + 1
    inner_start = idx
    while idx < len(html) and depth:
        next_open = html.find("<div", idx)
        next_close = html.find("</div>", idx)
        if next_close == -1:
            return ""
        if next_open != -1 and next_open < next_close:
            depth += 1
            idx = next_open + 4
        else:
            depth -= 1
            if depth == 0:
                return html[inner_start:next_close].strip()
            idx = next_close + 6
    return ""


def _extract_elementor_widget(html: str, widget_type: str) -> str:
    needle = f'data-widget_type="{widget_type}"'
    start = html.find(needle)
    if start < 0:
        return ""
    widget_open = html.rfind("<div", max(0, start - 400), start + 1)
    if widget_open < 0:
        return ""
    inner = _extract_balanced_div_inner(html, widget_open)
    if not inner:
        return ""
    container_needle = '<div class="elementor-widget-container">'
    cpos = inner.find(container_needle)
    if cpos >= 0:
        sub_open = inner.find("<div", cpos)
        if sub_open >= 0:
            return _extract_balanced_div_inner(inner, sub_open)
    return inner


def _looks_like_post_body(html: str) -> bool:
    if not html.strip():
        return False
    lowered = html.lower()
    if "elementor-posts-container" in lowered:
        return False
    if "elementor-post-navigation" in lowered:
        return False
    return True


def _infer_author_role(name: str) -> str:
    lowered = name.lower()
    if name.startswith("CA ") or lowered.startswith("ca "):
        return "Chartered Accountant"
    if name.startswith(("Ms.", "Mr.", "Mrs.", "Dr.")):
        return "Contributor"
    return "Contributor"


def extract_author_from_html(page_html: str) -> ScrapedAuthor | None:
    """Read the Elementor sidebar 'Author Info' widget from a live blog page."""
    marker = page_html.lower().find("author info")
    if marker < 0:
        return None
    chunk = page_html[marker : marker + 8000]
    name_match = re.search(r"<h[234][^>]*>\s*([^<]{3,120})\s*</h[234]>", chunk, re.I)
    if not name_match:
        return None
    name = _strip_tags(name_match.group(1))
    if not name or name.lower() == "author info":
        return None

    bio = ""
    bio_match = re.search(
        r"</h[234]>\s*(?:<div[^>]*>\s*)*<p[^>]*>(.*?)</p>",
        chunk[name_match.start() :],
        re.I | re.S,
    )
    if bio_match:
        bio = _strip_tags(bio_match.group(1))

    photo_url = ""
    photo_match = re.search(
        r'<img[^>]+src="([^"]+)"[^>]*>',
        chunk[: name_match.end() + 2000],
        re.I,
    )
    if photo_match:
        photo_url = photo_match.group(1)

    return ScrapedAuthor(
        name=name[:255],
        bio=bio[:2000],
        photo_url=photo_url,
        role=_infer_author_role(name),
    )


def _extract_body(page_html: str) -> str:
    single_match = re.search(
        r'elementor-location-single(.*?)(?=elementor-location-footer|<footer)',
        page_html,
        re.I | re.S,
    )
    scope = single_match.group(1) if single_match else page_html
    body = _extract_elementor_widget(scope, "theme-post-content.default")
    if _looks_like_post_body(body):
        return body
    body = _extract_elementor_widget(scope, "text-editor.default")
    if _looks_like_post_body(body):
        return body
    elementor = ELEMENTOR_POST_CONTENT_RE.search(page_html)
    if elementor:
        return elementor.group(1).strip()
    article = ARTICLE_RE.search(page_html)
    article_scope = article.group(1) if article else page_html
    content = ENTRY_CONTENT_RE.search(article_scope)
    if content:
        return content.group(1).strip()
    h1 = H1_RE.search(article_scope)
    if h1:
        return article_scope[h1.start() :].strip()
    return ""


def _fetch_page_html(url: str, *, timeout: float = 45.0, retries: int = 3) -> tuple[int, str, str]:
    """Fetch a live page with retries for transient SSL/network errors."""
    last_error = ""
    context = ssl.create_default_context()
    for attempt in range(retries):
        if attempt:
            time.sleep(0.6 * attempt)
        request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        try:
            with urllib.request.urlopen(request, timeout=timeout, context=context) as response:
                return response.getcode(), response.read().decode("utf-8", errors="replace"), ""
        except urllib.error.HTTPError as exc:
            return exc.code, "", str(exc)
        except Exception as exc:  # noqa: BLE001
            last_error = str(exc)
    return 0, "", last_error


def fetch_live_page(url: str, *, slug: str = "") -> ScrapedPage:
    slug = slug or url.rstrip("/").split("/")[-1]
    status, page_html, error = _fetch_page_html(url)
    if status != 200 or not page_html:
        return ScrapedPage(
            url=url,
            slug=slug,
            status_code=status,
            title="",
            excerpt="",
            body_html="",
            canonical_url="",
            seo_title="",
            meta_description="",
            meta_robots="",
            content_type="unknown",
            error=error,
        )

    title_match = TITLE_RE.search(page_html)
    title = _strip_tags(title_match.group(1)) if title_match else slug.replace("-", " ").title()
    og_title = OG_TITLE_RE.search(page_html)
    meta_desc = META_DESC_RE.search(page_html)
    canonical = CANONICAL_RE.search(page_html)
    robots = ROBOTS_RE.search(page_html)
    body = normalize_wp_html(_extract_body(page_html))
    excerpt = _strip_tags(body)[:500]
    content_type = _detect_content_type(page_html)
    author = extract_author_from_html(page_html) if content_type == "blog" else None
    published = ARTICLE_PUBLISHED_RE.search(page_html) or TIME_DATETIME_RE.search(page_html)

    return ScrapedPage(
        url=url,
        slug=slug,
        status_code=status,
        title=title[:255],
        excerpt=excerpt,
        body_html=body,
        canonical_url=canonical.group(1) if canonical else url,
        seo_title=(og_title.group(1) if og_title else title)[:255],
        meta_description=(meta_desc.group(1) if meta_desc else excerpt)[:320],
        meta_robots=robots.group(1) if robots else "index,follow",
        content_type=content_type,
        published_date=published.group(1) if published else "",
        author=author,
    )


def fetch_many(urls: list[tuple[str, str]], *, delay: float = REQUEST_DELAY_SEC) -> list[ScrapedPage]:
    results: list[ScrapedPage] = []
    for index, (url, slug) in enumerate(urls):
        if index:
            time.sleep(delay)
        results.append(fetch_live_page(url, slug=slug))
    return results

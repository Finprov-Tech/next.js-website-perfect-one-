"""Live finprov.com slug helpers — finprov.com is the URL source of truth."""

from __future__ import annotations

import re
import urllib.error
import urllib.request

SITE_BASE = "https://finprov.com"
USER_AGENT = "Mozilla/5.0 (compatible; FinprovMigrationBot/1.0)"

# Frontend seed slugs that never existed on finprov.com → real WP slug (if any).
DEMO_TO_LIVE_BLOG_SLUGS: dict[str, str] = {
    "cloud-based-accounting-transforming-industry": "how-cloud-based-accounting-is-transforming-industry",
    "tallyprime-features-simplify-gst-compliance": "tallyprime-features-that-simplify-gst-compliance",
    "top-10-reasons-choose-tally-software": "reasons-to-choose-tally-software-for-your-business",
    "accrual-vs-cash-accounting-method": "accrual-and-cash-accounting-differences",
    "10-simple-steps-begin-learning-tally-prime": "steps-to-learn-tally-prime",
}

# Demo-only articles with no live URL — send to blog index.
DEMO_ONLY_BLOG_SLUGS = (
    "sap-fico-vs-tally-which-to-learn-first",
    "5-power-bi-dashboards-every-analyst-should-know",
    "how-to-crack-your-first-finance-interview",
)


def normalize_path(path: str) -> str:
    path = path.strip()
    if not path.startswith("/"):
        path = f"/{path}"
    return path if path.endswith("/") else f"{path}/"


def live_url_for_slug(slug: str) -> str:
    return f"{SITE_BASE.rstrip('/')}/{slug.strip('/')}/"


def slug_exists_on_live(slug: str, *, timeout: float = 20.0) -> bool:
    request = urllib.request.Request(live_url_for_slug(slug), headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return 200 <= response.getcode() < 400
    except urllib.error.HTTPError as exc:
        return exc.code not in {404, 410}
    except Exception:
        return False


def fetch_live_post_slugs(*, timeout: float = 60.0) -> set[str]:
    """Return root-level slugs from finprov.com post-sitemap*.xml files."""
    index_req = urllib.request.Request(f"{SITE_BASE}/sitemap_index.xml", headers={"User-Agent": USER_AGENT})
    index_xml = urllib.request.urlopen(index_req, timeout=timeout).read().decode("utf-8", errors="replace")
    sitemaps = re.findall(r"<loc>\s*(https://finprov.com/post-sitemap\d*\.xml)\s*</loc>", index_xml, re.I)
    slugs: set[str] = set()
    for sitemap_url in sitemaps:
        req = urllib.request.Request(sitemap_url, headers={"User-Agent": USER_AGENT})
        xml = urllib.request.urlopen(req, timeout=timeout).read().decode("utf-8", errors="replace")
        for url in re.findall(r"<loc>\s*(https://finprov.com/[^<]+)\s*</loc>", xml, re.I):
            slug = url.rstrip("/").split("/")[-1]
            if slug:
                slugs.add(slug)
    return slugs

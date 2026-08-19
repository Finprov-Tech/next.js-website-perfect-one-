"""Backfill blog section HTML and author details from live finprov.com pages."""

from __future__ import annotations

import sys
import time
from pathlib import Path

from django.core.management.base import BaseCommand

BACKEND_ROOT = Path(__file__).resolve().parents[3]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from migration.wp_blog import normalize_wp_html  # noqa: E402
from migration.wp_scrape import fetch_live_page  # noqa: E402
from blog.models import Author, BlogPost, BlogPostSection  # noqa: E402

SITE_BASE = "https://finprov.com"


def ensure_author(name: str, *, role: str = "", bio: str = "") -> Author:
    defaults = {"role": role or "Contributor"}
    if bio:
        defaults["bio"] = bio
    author, created = Author.objects.get_or_create(name=name[:255], defaults=defaults)
    if not created:
        changed = False
        if role and author.role in {"", "Contributor"} and role != author.role:
            author.role = role
            changed = True
        if bio and not author.bio.strip():
            author.bio = bio
            changed = True
        if changed:
            author.save(update_fields=["role", "bio"])
    return author


class Command(BaseCommand):
    help = "Normalize migrated blog HTML and backfill author details from live finprov.com pages."

    def add_arguments(self, parser):
        parser.add_argument("--body-only", action="store_true", help="Only normalize stored section HTML.")
        parser.add_argument("--authors-only", action="store_true", help="Only backfill authors from live pages.")
        parser.add_argument("--slug", action="append", default=[], help="Limit to specific slug(s).")
        parser.add_argument("--limit", type=int, default=0, help="Process at most N posts (0 = all).")
        parser.add_argument("--delay", type=float, default=0.35, help="Delay between live fetches (seconds).")

    def handle(self, *args, **options):
        do_body = not options["authors_only"]
        do_authors = not options["body_only"]

        posts = BlogPost.objects.filter(status=BlogPost.STATUS_PUBLISHED).order_by("slug")
        if options["slug"]:
            posts = posts.filter(slug__in=options["slug"])
        if options["limit"]:
            posts = posts[: options["limit"]]

        body_updated = author_updated = author_failed = 0

        if do_body:
            for section in BlogPostSection.objects.filter(post__in=posts, is_active=True):
                cleaned = normalize_wp_html(section.body)
                if cleaned != section.body:
                    section.body = cleaned
                    section.save(update_fields=["body"])
                    body_updated += 1
            self.stdout.write(self.style.SUCCESS(f"Normalized {body_updated} blog section bodies."))

        if do_authors:
            for index, post in enumerate(posts):
                if index and options["delay"]:
                    time.sleep(options["delay"])
                url = f"{SITE_BASE.rstrip('/')}/{post.slug}/"
                scraped = fetch_live_page(url, slug=post.slug)
                if scraped.status_code != 200 or not scraped.author or not scraped.author.name:
                    author_failed += 1
                    self.stdout.write(self.style.WARNING(f"No author: {post.slug} ({scraped.status_code})"))
                    continue
                author = ensure_author(
                    scraped.author.name,
                    role=scraped.author.role,
                    bio=scraped.author.bio,
                )
                if post.author_id != author.id:
                    post.author = author
                    post.save(update_fields=["author"])
                    author_updated += 1
                    self.stdout.write(f"Author: {post.slug} -> {author.name}")

            self.stdout.write(self.style.SUCCESS(f"Updated authors on {author_updated} posts."))
            if author_failed:
                self.stdout.write(self.style.WARNING(f"Could not resolve author for {author_failed} posts."))

"""Audit published blog bodies for corrupted Latest Posts widget imports."""

from __future__ import annotations

import sys
from pathlib import Path

from django.core.management.base import BaseCommand
from django.db.models import Q

BACKEND_ROOT = Path(__file__).resolve().parents[3]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from blog.models import BlogPost, BlogPostSection  # noqa: E402

CORRUPTION_MARKERS = (
    "elementor-posts-container",
    "elementor-post-navigation",
)


class Command(BaseCommand):
    help = "Report published blog posts whose body still looks like a sidebar Latest Posts widget."

    def add_arguments(self, parser):
        parser.add_argument("--list", action="store_true", help="Print corrupted slugs.")

    def handle(self, *args, **options):
        published = BlogPost.objects.filter(status=BlogPost.STATUS_PUBLISHED).count()
        marker_q = Q()
        for marker in CORRUPTION_MARKERS:
            marker_q |= Q(body__icontains=marker)

        corrupted_qs = BlogPostSection.objects.filter(
            is_active=True,
            post__status=BlogPost.STATUS_PUBLISHED,
        ).filter(marker_q)

        corrupted_posts = (
            BlogPost.objects.filter(status=BlogPost.STATUS_PUBLISHED, sections__in=corrupted_qs.values("id"))
            .distinct()
            .order_by("slug")
        )
        corrupted = corrupted_posts.count()
        empty = BlogPostSection.objects.filter(
            is_active=True,
            post__status=BlogPost.STATUS_PUBLISHED,
            body__regex=r"^\s*$",
        ).count()

        self.stdout.write(f"Published blog posts: {published}")
        self.stdout.write(f"Corrupted (Latest Posts widget): {corrupted}")
        self.stdout.write(f"Empty bodies: {empty}")
        self.stdout.write(f"Clean: {published - corrupted - empty}")

        if options["list"] and corrupted:
            for post in corrupted_posts:
                self.stdout.write(post.slug)

        if corrupted:
            self.stdout.write(self.style.WARNING("Run: python manage.py resync_blog_from_live --only-corrupted --verify"))
        else:
            self.stdout.write(self.style.SUCCESS("All published blog bodies look clean."))

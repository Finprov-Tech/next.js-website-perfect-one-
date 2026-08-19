import sys
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils.text import slugify

BACKEND_ROOT = Path(__file__).resolve().parents[3]
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from migration.wp_blog import map_wp_post, rank_math_to_blog_seo  # noqa: E402
from migration.wp_redirects import iter_rank_math_redirections, map_wp_redirect  # noqa: E402
from migration.wp_courses import map_wp_course, rank_math_to_course_seo  # noqa: E402
from migration.wp_sql import (  # noqa: E402
    build_blog_meta_index,
    build_course_meta_index,
    build_post_category_index,
    build_rank_math_index,
    build_wp_user_index,
    classify_page_type,
    load_published_courses,
    load_published_pages,
    load_published_posts,
    rank_math_to_seo,
)
from blog.models import Author, BlogCategory, BlogPost, BlogPostSection  # noqa: E402
from courses.models import (  # noqa: E402
    Course,
    CourseAlias,
    CourseAudience,
    CourseCategory,
    CourseFAQ,
    CourseHighlight,
    CourseProgramType,
    CourseSkill,
)
from courses.review import sync_course_review_issues  # noqa: E402
from modules.models import LandingPageBody  # noqa: E402
from pages.models import Page, PageType  # noqa: E402
from seo.models import Redirect, SEOMeta  # noqa: E402

DEFAULT_SQL = Path(r"C:\Users\FINPROV\Desktop\finprovadmin_finprov.sql")
SKIP_PAGE_SLUGS = {"sample-page", "courses", "course-details", "entrepreuers-managers"}

CATEGORY_LABELS = {
    "Finance": "Finance & Accounting",
    "Taxation": "Taxation",
    "Analytics": "Data Analytics",
    "Marketing": "Digital Marketing",
    "Gulf": "Gulf Careers",
}


def _unique_slug(base_slug: str, wp_id: int, reserved: set[str]) -> str:
    slug = base_slug or f"page-{wp_id}"
    if slug not in reserved:
        reserved.add(slug)
        return slug
    candidate = f"{slug}-wp{wp_id}"
    if candidate not in reserved:
        reserved.add(candidate)
        return candidate
    suffix = 2
    while f"{slug}-{suffix}" in reserved:
        suffix += 1
    final_slug = f"{slug}-{suffix}"
    reserved.add(final_slug)
    return final_slug


def _ensure_course_lookups():
    categories = {}
    for index, name in enumerate(["Finance", "Taxation", "Analytics", "Marketing", "Gulf"]):
        categories[name], _ = CourseCategory.objects.update_or_create(
            slug=name.lower(),
            defaults={
                "name": name,
                "display_label": CATEGORY_LABELS[name],
                "display_order": index,
                "is_active": True,
            },
        )
    program_types = {}
    for index, name in enumerate(["Job Assured", "Certification", "Executive"]):
        program_types[name], _ = CourseProgramType.objects.update_or_create(
            slug=name.lower().replace(" ", "-"),
            defaults={"name": name, "display_order": index, "is_active": True},
        )
    return categories, program_types


def _find_course_by_wp(wp_post_id: int, slug: str):
    course = Course.objects.filter(source_payload__wp_post_id=wp_post_id).first()
    if course:
        return course
    return Course.objects.filter(slug=slug).first()


def _replace_course_list(model, course, values: list[str], related_name: str):
    if not values:
        return
    getattr(course, related_name).all().delete()
    model.objects.bulk_create(
        [model(course=course, text=value, display_order=index) for index, value in enumerate(values)]
    )


def _replace_course_faqs(course, faqs: list[dict[str, str]]):
    if not faqs:
        return
    course.faqs.all().delete()
    CourseFAQ.objects.bulk_create(
        [
            CourseFAQ(course=course, question=item["question"], answer=item["answer"], display_order=index)
            for index, item in enumerate(faqs)
        ]
    )


def _ensure_author(name: str) -> Author:
    author, _ = Author.objects.get_or_create(name=name[:255], defaults={"role": "Contributor"})
    return author


def _ensure_blog_category(name: str, cache: dict[str, BlogCategory]) -> BlogCategory:
    if name in cache:
        return cache[name]
    category, _ = BlogCategory.objects.get_or_create(
        name=name[:100],
        defaults={"slug": slugify(name)[:100], "display_order": len(cache)},
    )
    cache[name] = category
    return category


class Command(BaseCommand):
    help = "Import published WordPress content (pages, courses, posts) and Rank Math SEO from a phpMyAdmin SQL dump."

    def add_arguments(self, parser):
        parser.add_argument("--sql", type=Path, default=DEFAULT_SQL)
        parser.add_argument(
            "--only",
            choices=("pages", "posts", "courses", "redirects", "all"),
            default="pages",
            help="Import pages (Day 1), courses (Day 2), or future content types.",
        )
        parser.add_argument("--dry-run", action="store_true")
        parser.add_argument("--force", action="store_true", help="Re-import rows even when already imported.")

    def handle(self, *args, **options):
        only = options["only"]
        if only == "pages":
            self._import_pages(options)
        elif only == "courses":
            self._import_courses(options)
        elif only == "posts":
            self._import_posts(options)
        elif only == "redirects":
            self._import_redirects(options)
        elif only == "all":
            self._import_pages(options)
            self._import_courses(options)
            self._import_posts(options)
            self._import_redirects(options)
        else:
            raise CommandError(f"The {only!r} import path is not implemented yet.")

    @transaction.atomic
    def _import_pages(self, options):
        sql_path = options["sql"].resolve()
        if not sql_path.exists():
            raise CommandError(f"SQL file not found: {sql_path}")

        pages = load_published_pages(sql_path)
        pages = [page for page in pages if page.post_name not in SKIP_PAGE_SLUGS]
        page_ids = {page.wp_id for page in pages}
        self.stdout.write(f"Found {len(pages)} published WordPress pages to import.")

        rank_math = build_rank_math_index(sql_path, page_ids)
        self.stdout.write(f"Loaded Rank Math meta for {len(rank_math)} pages.")

        page_types = {row.name: row for row in PageType.objects.all()}

        reserved_slugs = set(Page.objects.values_list("slug", flat=True))
        created = updated = skipped = landing_bodies = seo_rows = 0
        homepage_set = Page.objects.filter(is_homepage=True).exists()

        for wp_page in pages:
            type_name = classify_page_type(wp_page.post_name)
            page_type = page_types.get(type_name)
            if page_type is None:
                page_type, _ = PageType.objects.get_or_create(name=type_name, defaults={"slug": slugify(type_name)})
                page_types[type_name] = page_type

            existing = Page.objects.filter(wp_post_id=wp_page.wp_id).first()
            if existing and not options["force"]:
                skipped += 1
                continue

            slug = wp_page.post_name.strip().lower()
            if not slug:
                slug = slugify(wp_page.post_title) or f"page-{wp_page.wp_id}"
            if existing:
                slug = existing.slug
            elif Page.objects.filter(slug=slug).exclude(wp_post_id=wp_page.wp_id).exists():
                slug = _unique_slug(slug, wp_page.wp_id, reserved_slugs)
            else:
                reserved_slugs.add(slug)

            is_homepage = False
            if not homepage_set and wp_page.post_title.strip().lower() == "home":
                is_homepage = True
                homepage_set = True

            defaults = {
                "name": wp_page.post_title[:255] or slug.replace("-", " ").title(),
                "slug": slug,
                "page_type": page_type,
                "status": Page.STATUS_DRAFT,
                "is_homepage": is_homepage,
            }

            if options["dry_run"]:
                created += 1
                if wp_page.post_content.strip():
                    landing_bodies += 1
                if wp_page.wp_id in rank_math:
                    seo_rows += 1
                continue

            page, was_created = Page.objects.update_or_create(
                wp_post_id=wp_page.wp_id,
                defaults=defaults,
            )
            created += int(was_created)
            updated += int(not was_created)

            if wp_page.post_content.strip():
                LandingPageBody.objects.update_or_create(
                    page=page,
                    defaults={
                        "h1": (wp_page.post_title or slug.replace("-", " ").title())[:255],
                        "body": wp_page.post_content,
                        "display_order": 0,
                        "is_active": True,
                    },
                )
                landing_bodies += 1

            seo_defaults = rank_math_to_seo(rank_math.get(wp_page.wp_id, {}), slug=slug)
            if not seo_defaults["seo_title"]:
                seo_defaults["seo_title"] = (wp_page.post_title or slug.replace("-", " ").title())[:255]
            SEOMeta.objects.update_or_create(page=page, defaults=seo_defaults)
            seo_rows += 1

        self.stdout.write(self.style.SUCCESS("WordPress page import complete."))
        self.stdout.write(f"Created: {created}")
        self.stdout.write(f"Updated: {updated}")
        self.stdout.write(f"Skipped (already imported): {skipped}")
        self.stdout.write(f"Landing bodies written: {landing_bodies}")
        self.stdout.write(f"SEO rows written: {seo_rows}")
        if options["dry_run"]:
            self.stdout.write(self.style.WARNING("Dry run only — no database writes were performed."))

    @transaction.atomic
    def _import_courses(self, options):
        sql_path = options["sql"].resolve()
        if not sql_path.exists():
            raise CommandError(f"SQL file not found: {sql_path}")

        wp_courses = load_published_courses(sql_path)
        course_ids = {course.wp_id for course in wp_courses}
        self.stdout.write(f"Found {len(wp_courses)} published WordPress courses to import.")

        meta_index = build_course_meta_index(sql_path, course_ids)
        self.stdout.write(f"Loaded course meta for {len(meta_index)} courses.")

        categories, program_types = _ensure_course_lookups()
        reserved_slugs = set(Course.objects.values_list("slug", flat=True))
        created = updated = skipped = seo_rows = 0
        highlights_written = skills_written = faqs_written = 0

        for order, wp_course in enumerate(wp_courses):
            payload = map_wp_course(wp_course, meta_index.get(wp_course.wp_id, {}))
            existing = _find_course_by_wp(payload["wp_post_id"], payload["slug"])
            if existing and not options["force"]:
                if (
                    existing.source_payload.get("import_source") == "wordpress_sql"
                    and existing.source_hash == payload["source_hash"]
                ):
                    skipped += 1
                    continue

            slug = payload["slug"]
            if existing:
                slug = existing.slug
            elif slug in reserved_slugs:
                slug = _unique_slug(slug, payload["wp_post_id"], reserved_slugs)
            else:
                reserved_slugs.add(slug)

            review_notes = []
            if slug != payload["slug"]:
                review_notes.append(
                    {
                        "code": "canonical_slug_mismatch",
                        "canonical_url": f"https://finprov.com/courses/{payload['slug']}/",
                        "primary_slug": slug,
                    }
                )

            defaults = {
                "title": payload["title"],
                "slug": slug,
                "category": categories[payload["category"]],
                "program_type": program_types[payload["program_type"]],
                "duration": payload["duration"],
                "mode": payload["mode"],
                "short_description": payload["short_description"],
                "hero_description": payload["hero_description"],
                "fee_summary": payload["fee_summary"],
                "online_fees": payload["online_fees"],
                "offline_fees": payload["offline_fees"],
                "image_alt": payload["title"],
                "display_order": order,
                "is_active": True,
                "status": Course.STATUS_DRAFT,
                "source_payload": payload,
                "source_hash": payload["source_hash"],
                "needs_content_review": bool(review_notes),
                "needs_url_review": bool(review_notes),
                "review_notes": review_notes,
            }

            if options["dry_run"]:
                created += int(existing is None)
                updated += int(existing is not None)
                if payload["highlights"]:
                    highlights_written += 1
                if payload["skills"]:
                    skills_written += 1
                if payload["faqs"]:
                    faqs_written += 1
                seo_rows += 1
                continue

            if existing:
                for field, value in defaults.items():
                    setattr(existing, field, value)
                existing.save()
                course = existing
                was_created = False
            else:
                course = Course.objects.create(**defaults)
                was_created = True

            created += int(was_created)
            updated += int(not was_created)

            _replace_course_list(CourseHighlight, course, payload["highlights"], "highlights")
            if payload["highlights"]:
                highlights_written += 1
            _replace_course_list(CourseSkill, course, payload["skills"], "skills")
            if payload["skills"]:
                skills_written += 1
            _replace_course_list(CourseAudience, course, payload["audiences"], "audiences")
            _replace_course_faqs(course, payload["faqs"])
            if payload["faqs"]:
                faqs_written += 1

            if slug != payload["slug"]:
                CourseAlias.objects.update_or_create(slug=payload["slug"], defaults={"course": course})

            rank_meta = {
                key: value
                for key, value in meta_index.get(wp_course.wp_id, {}).items()
                if key.startswith("rank_math_")
            }
            seo_defaults = rank_math_to_course_seo(rank_meta, slug=slug)
            if not seo_defaults["seo_title"]:
                seo_defaults["seo_title"] = payload["title"][:255]
            if not seo_defaults["meta_description"] and payload["short_description"]:
                seo_defaults["meta_description"] = payload["short_description"][:320]
            SEOMeta.objects.update_or_create(course=course, defaults=seo_defaults)
            seo_rows += 1
            sync_course_review_issues(course, review_notes)

        self.stdout.write(self.style.SUCCESS("WordPress course import complete."))
        self.stdout.write(f"Created: {created}")
        self.stdout.write(f"Updated: {updated}")
        self.stdout.write(f"Skipped (unchanged): {skipped}")
        self.stdout.write(f"Highlights written: {highlights_written}")
        self.stdout.write(f"Skills written: {skills_written}")
        self.stdout.write(f"FAQs written: {faqs_written}")
        self.stdout.write(f"SEO rows written: {seo_rows}")
        self.stdout.write(f"Total courses in DB: {Course.objects.count()}")
        if options["dry_run"]:
            self.stdout.write(self.style.WARNING("Dry run only — no database writes were performed."))

    @transaction.atomic
    def _import_posts(self, options):
        sql_path = options["sql"].resolve()
        if not sql_path.exists():
            raise CommandError(f"SQL file not found: {sql_path}")

        wp_posts = load_published_posts(sql_path)
        post_ids = {post.wp_id for post in wp_posts}
        self.stdout.write(f"Found {len(wp_posts)} published WordPress blog posts to import.")

        meta_index = build_blog_meta_index(sql_path, post_ids)
        category_index = build_post_category_index(sql_path, post_ids)
        user_index = build_wp_user_index(sql_path)
        self.stdout.write(f"Loaded blog meta for {len(meta_index)} posts.")
        self.stdout.write(f"Mapped categories for {len(category_index)} posts.")

        blog_categories: dict[str, BlogCategory] = {}
        default_author = _ensure_author("Finprov Learning")
        reserved_slugs = set(BlogPost.objects.values_list("slug", flat=True))
        created = updated = skipped = sections_written = seo_rows = 0

        for order, wp_post in enumerate(wp_posts):
            author_name = user_index.get(wp_post.post_author, default_author.name)
            payload = map_wp_post(
                wp_post,
                meta_index.get(wp_post.wp_id, {}),
                category_name=category_index.get(wp_post.wp_id, "Articles"),
                author_name=author_name,
            )
            existing = BlogPost.objects.filter(slug=payload["slug"]).first()
            if existing and not options["force"]:
                skipped += 1
                continue

            slug = payload["slug"]
            if not slug:
                slug = slugify(payload["title"]) or f"post-{payload['wp_post_id']}"
            if existing:
                slug = existing.slug
            elif slug in reserved_slugs:
                slug = _unique_slug(slug, payload["wp_post_id"], reserved_slugs)
            else:
                reserved_slugs.add(slug)

            category = _ensure_blog_category(payload["category_name"], blog_categories)
            author = _ensure_author(payload["author_name"])

            defaults = {
                "title": payload["title"],
                "slug": slug,
                "excerpt": payload["excerpt"],
                "category": category,
                "author": author,
                "published_date": payload["published_date"],
                "read_time": payload["read_time"],
                "cover_image_alt": payload["title"],
                "display_order": order,
                "status": BlogPost.STATUS_DRAFT,
                "is_featured": False,
            }

            if options["dry_run"]:
                created += int(existing is None)
                updated += int(existing is not None)
                if payload["body"].strip():
                    sections_written += 1
                seo_rows += 1
                continue

            post, was_created = BlogPost.objects.update_or_create(slug=slug, defaults=defaults)
            created += int(was_created)
            updated += int(not was_created)

            if payload["body"].strip():
                post.sections.all().delete()
                BlogPostSection.objects.create(
                    post=post,
                    heading="",
                    body=payload["body"],
                    display_order=0,
                    is_active=True,
                )
                sections_written += 1

            rank_meta = {
                key: value
                for key, value in meta_index.get(wp_post.wp_id, {}).items()
                if key.startswith("rank_math_")
            }
            seo_defaults = rank_math_to_blog_seo(rank_meta, slug=slug)
            if not seo_defaults["seo_title"]:
                seo_defaults["seo_title"] = payload["title"][:255]
            if not seo_defaults["meta_description"] and payload["excerpt"]:
                seo_defaults["meta_description"] = payload["excerpt"][:320]
            SEOMeta.objects.update_or_create(blog_post=post, defaults=seo_defaults)
            seo_rows += 1

        self.stdout.write(self.style.SUCCESS("WordPress blog post import complete."))
        self.stdout.write(f"Created: {created}")
        self.stdout.write(f"Updated: {updated}")
        self.stdout.write(f"Skipped (already imported): {skipped}")
        self.stdout.write(f"Sections written: {sections_written}")
        self.stdout.write(f"SEO rows written: {seo_rows}")
        self.stdout.write(f"Total blog posts in DB: {BlogPost.objects.count()}")
        if options["dry_run"]:
            self.stdout.write(self.style.WARNING("Dry run only — no database writes were performed."))

    @transaction.atomic
    def _import_redirects(self, options):
        sql_path = options["sql"].resolve()
        if not sql_path.exists():
            raise CommandError(f"SQL file not found: {sql_path}")

        wp_redirects = iter_rank_math_redirections(sql_path)
        self.stdout.write(f"Found {len(wp_redirects)} Rank Math redirection rows in SQL.")

        created = updated = skipped = inactive = non_exact = 0
        reserved_old_paths = set(Redirect.objects.values_list("old_path", flat=True))

        for wp_row in wp_redirects:
            mapped = map_wp_redirect(wp_row)
            if mapped is None:
                if wp_row.status != "active":
                    inactive += 1
                elif wp_row.comparison != "exact":
                    non_exact += 1
                else:
                    skipped += 1
                continue

            old_path = mapped["old_path"]
            if (
                Redirect.objects.filter(old_path=old_path).exists()
                and not options["force"]
                and old_path in reserved_old_paths
            ):
                existing = Redirect.objects.get(old_path=old_path)
                if (
                    existing.new_path == mapped["new_path"]
                    and existing.redirect_type == mapped["redirect_type"]
                    and existing.is_active == mapped["is_active"]
                ):
                    skipped += 1
                    continue

            if options["dry_run"]:
                created += int(old_path not in reserved_old_paths)
                updated += int(old_path in reserved_old_paths)
                reserved_old_paths.add(old_path)
                continue

            redirect, was_created = Redirect.objects.update_or_create(
                old_path=old_path,
                defaults={
                    "new_path": mapped["new_path"],
                    "redirect_type": mapped["redirect_type"],
                    "is_active": mapped["is_active"],
                },
            )
            reserved_old_paths.add(old_path)
            created += int(was_created)
            updated += int(not was_created)

        self.stdout.write(self.style.SUCCESS("Rank Math redirect import complete."))
        self.stdout.write(f"Created: {created}")
        self.stdout.write(f"Updated: {updated}")
        self.stdout.write(f"Skipped (unchanged/invalid): {skipped}")
        self.stdout.write(f"Inactive rows ignored: {inactive}")
        self.stdout.write(f"Non-exact patterns ignored: {non_exact}")
        self.stdout.write(f"Total active redirects in DB: {Redirect.objects.filter(is_active=True).count()}")
        if options["dry_run"]:
            self.stdout.write(self.style.WARNING("Dry run only — no database writes were performed."))

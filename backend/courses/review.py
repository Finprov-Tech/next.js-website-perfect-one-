import hashlib
import json
from urllib.parse import urlparse

from django.utils import timezone
from django.db import transaction

from courses.models import CourseReviewIssue
from pages.models import Page


def issue_key(category, field_name, details):
    raw = json.dumps([category, field_name, details], sort_keys=True, separators=(',', ':'))
    return hashlib.sha256(raw.encode()).hexdigest()


def review_issue_specs(course, notes):
    specs = []
    for note in notes or []:
        code = note.get('code')
        field = note.get('field', '')
        if code == 'encoding_review':
            specs.append((CourseReviewIssue.CATEGORY_ENCODING, field, f'Encoding review required in {field or "course content"}', note))
        elif code == 'scraped_navigation':
            specs.append((CourseReviewIssue.CATEGORY_NAVIGATION, field, f'Scraped-navigation contamination in {field}', note))
        elif code == 'canonical_slug_mismatch':
            details = {
                **note,
                'current_primary_slug': course.slug,
                'imported_canonical_url': note.get('canonical_url', ''),
                'proposed_action': 'Review ownership and select the canonical primary URL; keep the current slug until an explicit URL/redirect decision is approved.',
            }
            specs.append((CourseReviewIssue.CATEGORY_URL, 'canonical_url', 'Canonical URL does not match the current primary slug', details))

    try:
        seo = course.seo
    except Exception:
        seo = None
    missing = [name for name in ('seo_title', 'meta_description', 'canonical_url') if not seo or not getattr(seo, name)]
    if missing:
        details = {'missing_fields': missing}
        specs.append((CourseReviewIssue.CATEGORY_SEO, 'seo', f'Missing explicit SEO metadata: {", ".join(missing)}', details))

    matched_pages = Page.objects.filter(slug__in=[course.slug, *course.aliases.values_list('slug', flat=True)]).select_related('page_type')
    for page in matched_pages:
        details = {
            'page_id': page.id, 'page_name': page.name, 'page_slug': page.slug, 'page_status': page.status,
            'match_type': 'primary' if page.slug == course.slug else 'alias',
            'proposed_action': 'Decide whether the Course or Landing Page owns this public path; do not publish until ownership is approved.',
        }
        specs.append((CourseReviewIssue.CATEGORY_OWNERSHIP, 'slug', f'Potential landing-page ownership conflict with /{page.slug}', details))
    return specs


def sync_course_review_issues(course, notes):
    expected = set()
    for category, field_name, summary, details in review_issue_specs(course, notes):
        key = issue_key(category, field_name, details)
        expected.add(key)
        CourseReviewIssue.objects.update_or_create(
            course=course, issue_key=key,
            defaults={'category': category, 'field_name': field_name, 'summary': summary, 'details': details, 'blocking': True},
        )
    CourseReviewIssue.objects.filter(course=course, status=CourseReviewIssue.STATUS_OPEN).exclude(issue_key__in=expected).delete()
    refresh_course_review_flags(course)


def refresh_course_review_flags(course):
    open_issues = course.review_issues.filter(status=CourseReviewIssue.STATUS_OPEN, blocking=True)
    content = open_issues.filter(category__in=[CourseReviewIssue.CATEGORY_ENCODING, CourseReviewIssue.CATEGORY_NAVIGATION]).exists()
    url = open_issues.filter(category__in=[CourseReviewIssue.CATEGORY_URL, CourseReviewIssue.CATEGORY_OWNERSHIP]).exists()
    updates = []
    if course.needs_content_review != content:
        course.needs_content_review = content; updates.append('needs_content_review')
    if course.needs_url_review != url:
        course.needs_url_review = url; updates.append('needs_url_review')
    if updates:
        course.save(update_fields=[*updates, 'updated_at'])


def resolve_review_issue(issue, status, note, user):
    issue.status = status
    issue.resolution_note = note
    issue.reviewed_by = user
    issue.reviewed_at = timezone.now()
    issue.save(update_fields=['status', 'resolution_note', 'reviewed_by', 'reviewed_at', 'updated_at'])
    refresh_course_review_flags(issue.course)
    return issue


@transaction.atomic
def keep_current_course_url(course, user):
    """Align canonical to the current slug without changing routes, aliases, or redirects."""
    course = course.__class__.objects.select_for_update().select_related('seo').get(pk=course.pk)
    issues = course.review_issues.select_for_update().filter(
        category=CourseReviewIssue.CATEGORY_URL,
        field_name='canonical_url',
        status=CourseReviewIssue.STATUS_REVIEWED,
    )
    if not issues.exists():
        raise ValueError('No deferred canonical/slug decision is available for this course.')
    canonical = f'https://finprov.com/courses/{course.slug}/'
    seo = course.seo
    seo.canonical_url = canonical
    seo.full_clean(exclude=['custom_schema_json'])
    seo.save(update_fields=['canonical_url', 'updated_at'])
    now = timezone.now()
    issues.update(
        status=CourseReviewIssue.STATUS_CORRECTED,
        resolution_note=f'Approved current primary slug; canonical aligned to {canonical}. No slug, alias or redirect change.',
        reviewed_by=user,
        reviewed_at=now,
        updated_at=now,
    )
    refresh_course_review_flags(course)
    return course.__class__.objects.get(pk=course.pk)

import hashlib
import json

from django.db import migrations


def key_for(category, field_name, details):
    raw = json.dumps([category, field_name, details], sort_keys=True, separators=(',', ':'))
    return hashlib.sha256(raw.encode()).hexdigest()


def seed_issues(apps, schema_editor):
    Course = apps.get_model('courses', 'Course')
    CourseAlias = apps.get_model('courses', 'CourseAlias')
    CourseReviewIssue = apps.get_model('courses', 'CourseReviewIssue')
    Page = apps.get_model('pages', 'Page')
    SEOMeta = apps.get_model('seo', 'SEOMeta')

    for course in Course.objects.all():
        specs = []
        for note in course.review_notes or []:
            code, field = note.get('code'), note.get('field', '')
            if code == 'encoding_review':
                specs.append(('encoding', field, f'Encoding review required in {field or "course content"}', note))
            elif code == 'scraped_navigation':
                specs.append(('scraped_navigation', field, f'Scraped-navigation contamination in {field}', note))
            elif code == 'canonical_slug_mismatch':
                details = {**note, 'current_primary_slug': course.slug, 'imported_canonical_url': note.get('canonical_url', ''),
                           'proposed_action': 'Review ownership and select the canonical primary URL; keep the current slug until an explicit URL/redirect decision is approved.'}
                specs.append(('url', 'canonical_url', 'Canonical URL does not match the current primary slug', details))

        seo = SEOMeta.objects.filter(course_id=course.id).first()
        missing = [name for name in ('seo_title', 'meta_description', 'canonical_url') if not seo or not getattr(seo, name)]
        if missing:
            details = {'missing_fields': missing}
            specs.append(('seo', 'seo', f'Missing explicit SEO metadata: {", ".join(missing)}', details))

        aliases = list(CourseAlias.objects.filter(course_id=course.id).values_list('slug', flat=True))
        for page in Page.objects.filter(slug__in=[course.slug, *aliases]):
            details = {'page_id': page.id, 'page_name': page.name, 'page_slug': page.slug, 'page_status': page.status,
                       'match_type': 'primary' if page.slug == course.slug else 'alias',
                       'proposed_action': 'Decide whether the Course or Landing Page owns this public path; do not publish until ownership is approved.'}
            specs.append(('ownership', 'slug', f'Potential landing-page ownership conflict with /{page.slug}', details))

        for category, field_name, summary, details in specs:
            CourseReviewIssue.objects.get_or_create(
                course_id=course.id, issue_key=key_for(category, field_name, details),
                defaults={'category': category, 'field_name': field_name, 'summary': summary, 'details': details, 'blocking': True},
            )


def unseed_issues(apps, schema_editor):
    apps.get_model('courses', 'CourseReviewIssue').objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [
        ('courses', '0002_coursereviewissue'),
        ('pages', '0003_historicalpage_wp_post_id_page_wp_post_id'),
        ('seo', '0005_historicalseometa_course_seometa_course'),
    ]
    operations = [migrations.RunPython(seed_issues, unseed_issues)]

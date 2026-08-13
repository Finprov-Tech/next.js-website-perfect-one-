import hashlib
import json
import re
from pathlib import Path

from django.core.files.base import File
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from courses.models import (
    Course, CourseAlias, CourseAudience, CourseCareerProspect, CourseCategory,
    CourseCertification, CourseCurriculumModule, CourseCurriculumTopic, CourseFAQ,
    CourseHighlight, CourseHiringPartner, CourseJobOpportunity, CourseProgramType,
    CourseSkill, CourseTool,
)
from courses.review import sync_course_review_issues
from seo.models import SEOMeta


ARRAY_RE = re.compile(r'export const courses: Course\[\] = (\[[\s\S]*?\]);\s*\n\s*export const categories')
JUNK_VALUES = {'Placement Support', 'Sign in', 'Apply Scholarship', 'Tips Events'}
SUSPICIOUS_TEXT = re.compile(r'[ÎΓÃ�]|&#\d+;|â(?:€™|€œ|€|€“|€”|€¢|‚¬|„¢)')
CATEGORY_LABELS = {'Finance': 'Finance & Accounting', 'Taxation': 'Taxation', 'Analytics': 'Data Analytics', 'Marketing': 'Digital Marketing', 'Gulf': 'Gulf Careers'}
LIST_MODELS = {
    'highlights': (CourseHighlight, 'highlights'),
    'tools': (CourseTool, 'tools'),
    'hiringPartners': (CourseHiringPartner, 'hiring_partners'),
    'topSkills': (CourseSkill, 'skills'),
    'whoIsThisFor': (CourseAudience, 'audiences'),
    'jobOpportunities': (CourseJobOpportunity, 'job_opportunities'),
    'certifications': (CourseCertification, 'certifications'),
    'careerProspects': (CourseCareerProspect, 'career_prospects'),
}


def load_source(path):
    text = path.read_text(encoding='utf-8-sig')
    match = ARRAY_RE.search(text)
    if not match:
        raise CommandError(f'Could not locate the courses array in {path}')
    return json.loads(match.group(1))


def source_hash(payload):
    return hashlib.sha256(json.dumps(payload, ensure_ascii=False, sort_keys=True).encode()).hexdigest()


def review_flags(payload):
    notes = []
    for field in ('jobOpportunities', 'whoIsThisFor', 'topSkills', 'highlights'):
        found = sorted(JUNK_VALUES.intersection(payload.get(field) or []))
        if found:
            notes.append({'code': 'scraped_navigation', 'field': field, 'values': found})
    for field, value in payload.items():
        if SUSPICIOUS_TEXT.search(json.dumps(value, ensure_ascii=False)):
            notes.append({'code': 'encoding_review', 'field': field})
    canonical = payload.get('canonicalUrl') or ''
    primary_suffix = f"/courses/{payload['slug']}/"
    url_review = bool(canonical and not canonical.endswith(primary_suffix))
    if url_review:
        notes.append({'code': 'canonical_slug_mismatch', 'canonical_url': canonical, 'primary_slug': payload['slug']})
    return bool(notes), url_review, notes


class Command(BaseCommand):
    help = 'Idempotently import the reviewed 70-course TypeScript manifest as draft CMS records.'

    def add_arguments(self, parser):
        default = Path(__file__).resolve().parents[4] / 'next.js-website-perfect-one-' / 'src' / 'data' / 'courses.ts'
        parser.add_argument('--source', type=Path, default=default)
        parser.add_argument('--force', action='store_true', help='Re-import records even when their source hash is unchanged.')

    @transaction.atomic
    def handle(self, *args, **options):
        path = options['source'].resolve()
        payloads = load_source(path)
        if len(payloads) != 70:
            raise CommandError(f'Expected exactly 70 courses, found {len(payloads)}. Import aborted.')
        image_root = path.parents[2] / 'public'
        created = updated = skipped = 0

        categories = {}
        for index, name in enumerate(['Finance', 'Taxation', 'Analytics', 'Marketing', 'Gulf']):
            categories[name], _ = CourseCategory.objects.update_or_create(
                slug=name.lower(), defaults={'name': name, 'display_label': CATEGORY_LABELS[name], 'display_order': index, 'is_active': True}
            )
        program_types = {}
        for index, name in enumerate(['Job Assured', 'Certification', 'Executive']):
            program_types[name], _ = CourseProgramType.objects.update_or_create(
                slug=name.lower().replace(' ', '-'), defaults={'name': name, 'display_order': index, 'is_active': True}
            )

        for order, payload in enumerate(payloads):
            digest = source_hash(payload)
            existing = Course.objects.filter(slug=payload['slug']).first()
            if existing and existing.source_hash == digest and not options['force']:
                skipped += 1
                continue
            content_review, url_review, notes = review_flags(payload)
            defaults = {
                'title': payload['title'], 'category': categories[payload['category']],
                'program_type': program_types[payload['programType']], 'badge': payload.get('badge', ''),
                'badge_css_class': payload.get('badgeCls', ''), 'duration': payload.get('duration', ''),
                'mode': payload.get('mode', ''), 'tool_summary': payload.get('tool', ''),
                'short_description': payload.get('shortDesc', ''), 'hero_description': payload.get('heroDesc', ''),
                'snapshot_text': payload.get('snapshotText', ''), 'online_fees': payload.get('onlineFees') or '',
                'offline_fees': payload.get('offlineFees') or '', 'fee_summary': payload.get('fee', ''),
                'eligibility': payload.get('eligibility') or '', 'hours_of_learning': payload.get('hoursOfLearning') or '',
                'industry_projects': payload.get('industryProjects') or '', 'tools_used_stat': payload.get('toolsUsed') or '',
                'image_alt': payload['title'], 'syllabus_pdf': payload.get('syllabusPdf') or None,
                'display_order': order, 'is_active': True, 'status': Course.STATUS_DRAFT,
                'source_payload': payload, 'source_hash': digest, 'needs_content_review': content_review,
                'needs_url_review': url_review, 'review_notes': notes,
            }
            course, was_created = Course.objects.update_or_create(slug=payload['slug'], defaults=defaults)
            created += int(was_created); updated += int(not was_created)
            image_path = payload.get('image')
            if image_path:
                source_image = image_root / image_path.lstrip('/')
                if not source_image.exists():
                    raise CommandError(f'Missing image for {course.slug}: {source_image}')
                target = f'courses/source/{source_image.name}'
                if not course.image.storage.exists(target):
                    with source_image.open('rb') as stream:
                        course.image.storage.save(target, File(stream, name=source_image.name))
                course.image.name = target
                course.save(update_fields=['image'])

            CourseAlias.objects.filter(course=course).delete()
            CourseAlias.objects.bulk_create([CourseAlias(course=course, slug=value) for value in payload.get('aliases', [])])
            for source_key, (model, related_name) in LIST_MODELS.items():
                getattr(course, related_name).all().delete()
                model.objects.bulk_create([model(course=course, text=value, display_order=i) for i, value in enumerate(payload.get(source_key) or [])])
            course.curriculum_modules.all().delete()
            for module_order, module_payload in enumerate(payload.get('curriculum') or []):
                module = CourseCurriculumModule.objects.create(course=course, title=module_payload['title'], display_order=module_order)
                CourseCurriculumTopic.objects.bulk_create([
                    CourseCurriculumTopic(module=module, text=value, display_order=i) for i, value in enumerate(module_payload.get('topics') or [])
                ])
            course.faqs.all().delete()
            CourseFAQ.objects.bulk_create([
                CourseFAQ(course=course, question=value['question'], answer=value['answer'], display_order=i)
                for i, value in enumerate(payload.get('faqs') or [])
            ])
            seo_defaults = {
                'seo_title': payload.get('seoTitle') or '', 'meta_description': payload.get('metaDescription') or '',
                'canonical_url': payload.get('canonicalUrl') or '', 'schema_type': 'course',
                'include_in_sitemap': False,
            }
            SEOMeta.objects.update_or_create(course=course, defaults=seo_defaults)
            sync_course_review_issues(course, notes)

        for card in __import__('modules.models', fromlist=['CourseCard']).CourseCard.objects.all():
            card.course = Course.objects.filter(slug=card.slug).first()
            card.save(update_fields=['course'])
        self.stdout.write(self.style.SUCCESS(f'Courses imported: created={created}, updated={updated}, skipped={skipped}, total={Course.objects.count()} (all draft; sitemap disabled).'))

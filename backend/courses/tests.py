import tempfile
import base64
from pathlib import Path

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.management import call_command
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from courses.models import (
    Course, CourseAlias, CourseCurriculumModule, CourseCurriculumTopic, CourseHighlight,
    CourseReviewIssue, CourseSkill,
)
from seo.models import Redirect


SOURCE = Path(__file__).resolve().parents[2] / 'next.js-website-perfect-one-' / 'src' / 'data' / 'courses.ts'


class CourseImportAndAPITests(TestCase):
    @classmethod
    def setUpClass(cls):
        cls.media = tempfile.TemporaryDirectory()
        cls.override = override_settings(MEDIA_ROOT=cls.media.name)
        cls.override.enable()
        super().setUpClass()

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        cls.override.disable()
        cls.media.cleanup()

    def setUp(self):
        call_command('import_courses', source=SOURCE, verbosity=0)
        self.client = APIClient()

    def test_exact_import_parity_and_media(self):
        self.assertEqual(Course.objects.count(), 70)
        self.assertEqual(CourseAlias.objects.count(), 43)
        self.assertEqual(CourseCurriculumModule.objects.count(), 311)
        self.assertEqual(CourseCurriculumTopic.objects.count(), 1136)
        self.assertEqual(Course.objects.filter(status=Course.STATUS_PUBLISHED).count(), 0)
        self.assertEqual(Course.objects.filter(seo__include_in_sitemap=True).count(), 0)
        self.assertTrue(all(c.image.storage.exists(c.image.name) for c in Course.objects.all()))

    def test_import_is_idempotent(self):
        before = (Course.objects.count(), CourseAlias.objects.count(), CourseCurriculumTopic.objects.count())
        call_command('import_courses', source=SOURCE, verbosity=0)
        self.assertEqual(before, (Course.objects.count(), CourseAlias.objects.count(), CourseCurriculumTopic.objects.count()))

    def test_public_api_excludes_drafts_then_returns_published_detail(self):
        self.assertEqual(self.client.get('/api/v1/courses/').json(), [])
        course = Course.objects.get(slug='ifrs-course')
        course.status = Course.STATUS_PUBLISHED
        course.save(update_fields=['status'])
        response = self.client.get('/api/v1/courses/ifrs-course/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['slug'], 'ifrs-course')
        self.assertTrue(response.json()['curriculum_modules'])

    def test_seo_panel_lists_drafts_and_full_nested_detail(self):
        group, _ = Group.objects.get_or_create(name='SEO Team')
        user = get_user_model().objects.create_user('course-editor', password='test', is_staff=True)
        user.groups.add(group)
        self.client.force_authenticate(user)
        listing = self.client.get('/api/v1/seo-panel/courses/')
        self.assertEqual(listing.status_code, 200)
        self.assertEqual(len(listing.json()), 70)
        detail = self.client.get('/api/v1/seo-panel/courses/ifrs-course/')
        self.assertEqual(detail.status_code, 200)
        self.assertIn('review_notes', detail.json())
        self.assertIn('curriculum_modules', detail.json())

    def test_seo_panel_nested_create_and_course_image_replacement(self):
        group, _ = Group.objects.get_or_create(name='SEO Team')
        user = get_user_model().objects.create_user('course-media-editor', password='test', is_staff=True)
        user.groups.add(group)
        self.client.force_authenticate(user)
        course = Course.objects.get(slug='ifrs-course')
        skill = self.client.post('/api/v1/seo-panel/course-skills/', {
            'course': course.id, 'text': 'Temporary test skill', 'display_order': 999, 'is_active': False,
        }, format='json')
        self.assertEqual(skill.status_code, 201)
        self.assertFalse(skill.json()['is_active'])
        png = base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=')
        image = SimpleUploadedFile('replacement.png', png, content_type='image/png')
        response = self.client.patch('/api/v1/seo-panel/courses/ifrs-course/', {
            'image': image, 'image_alt': 'Replacement course image alt',
        }, format='multipart')
        self.assertEqual(response.status_code, 200, response.json())
        course.refresh_from_db()
        self.assertEqual(course.image_alt, 'Replacement course image alt')
        self.assertTrue(course.image.storage.exists(course.image.name))

    def test_review_state_persists_and_refreshes_course_flags(self):
        group, _ = Group.objects.get_or_create(name='SEO Team')
        user = get_user_model().objects.create_user('course-reviewer', password='test', is_staff=True)
        user.groups.add(group)
        self.client.force_authenticate(user)
        course = Course.objects.get(slug='business-accounting-specialist-program-basp')
        issue = course.review_issues.get(category=CourseReviewIssue.CATEGORY_ENCODING)
        response = self.client.patch(f'/api/v1/seo-panel/course-review-issues/{issue.id}/', {
            'status': CourseReviewIssue.STATUS_CORRECTED, 'resolution_note': 'Verified corrected in the CMS curriculum.',
        }, format='json')
        self.assertEqual(response.status_code, 200, response.json())
        issue.refresh_from_db(); course.refresh_from_db()
        self.assertEqual(issue.status, CourseReviewIssue.STATUS_CORRECTED)
        self.assertEqual(issue.reviewed_by, user)
        self.assertIsNotNone(issue.reviewed_at)
        self.assertFalse(course.needs_content_review)
        self.assertTrue(course.review_issues.filter(category=CourseReviewIssue.CATEGORY_SEO, status='open').exists())

    def test_seo_panel_blocks_publication_until_all_blocking_issues_are_resolved(self):
        group, _ = Group.objects.get_or_create(name='SEO Team')
        user = get_user_model().objects.create_user('publication-reviewer', password='test', is_staff=True)
        user.groups.add(group)
        self.client.force_authenticate(user)
        course = Course.objects.get(slug='business-accounting-specialist-program-basp')
        response = self.client.patch(f'/api/v1/seo-panel/courses/{course.slug}/', {'status': Course.STATUS_PUBLISHED}, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('Publication blocked', str(response.json()))
        course.refresh_from_db()
        self.assertEqual(course.status, Course.STATUS_DRAFT)

    def _authenticate_editor(self, username='atomic-editor'):
        group, _ = Group.objects.get_or_create(name='SEO Team')
        user = get_user_model().objects.create_user(username, password='test', is_staff=True)
        user.groups.add(group)
        self.client.force_authenticate(user)
        return user

    def test_explicit_publish_and_unpublish_actions_preserve_content_and_governance(self):
        self._authenticate_editor('publication-action-editor')
        course = Course.objects.get(slug='ifrs-course')
        course.review_issues.all().update(status=CourseReviewIssue.STATUS_CORRECTED)
        original = (course.title, course.slug, course.source_hash, course.seo.canonical_url)
        response = self.client.post(f'/api/v1/seo-panel/courses/{course.slug}/publish/')
        self.assertEqual(response.status_code, 200, response.json())
        course.refresh_from_db()
        self.assertEqual(course.status, Course.STATUS_PUBLISHED)
        self.assertEqual((course.title, course.slug, course.source_hash, course.seo.canonical_url), original)
        self.assertEqual(self.client.get(f'/api/v1/courses/{course.slug}/').status_code, 200)
        response = self.client.post(f'/api/v1/seo-panel/courses/{course.slug}/unpublish/')
        self.assertEqual(response.status_code, 200, response.json())
        course.refresh_from_db()
        self.assertEqual(course.status, Course.STATUS_DRAFT)
        self.assertEqual(self.client.get(f'/api/v1/courses/{course.slug}/').status_code, 404)

    def test_explicit_publish_blocks_deferred_url_decision(self):
        self._authenticate_editor('deferred-publication-editor')
        course = Course.objects.get(slug='advanced-program-in-business-finance-and-analytics')
        course.review_issues.filter(category=CourseReviewIssue.CATEGORY_URL).update(status=CourseReviewIssue.STATUS_REVIEWED)
        response = self.client.post(f'/api/v1/seo-panel/courses/{course.slug}/publish/')
        self.assertEqual(response.status_code, 400)
        self.assertIn('deferred URL/ownership', str(response.json()))
        course.refresh_from_db()
        self.assertEqual(course.status, Course.STATUS_DRAFT)

    def test_keep_current_url_decision_aligns_canonical_without_route_changes(self):
        user = self._authenticate_editor('url-decision-editor')
        course = Course.objects.get(slug='advanced-program-in-business-finance-and-analytics')
        issue = course.review_issues.get(category=CourseReviewIssue.CATEGORY_URL)
        issue.status = CourseReviewIssue.STATUS_REVIEWED
        issue.save(update_fields=['status'])
        original = (course.slug, list(course.aliases.values_list('slug', flat=True)), course.source_hash, course.status)
        response = self.client.post(f'/api/v1/seo-panel/courses/{course.slug}/url-decision/keep-current/', {
            'confirmation': 'KEEP_CURRENT_URL',
        }, format='json')
        self.assertEqual(response.status_code, 200, response.json())
        course.refresh_from_db(); course.seo.refresh_from_db(); issue.refresh_from_db()
        self.assertEqual(course.seo.canonical_url, f'https://finprov.com/courses/{course.slug}/')
        self.assertEqual((course.slug, list(course.aliases.values_list('slug', flat=True)), course.source_hash, course.status), original)
        self.assertEqual(issue.status, CourseReviewIssue.STATUS_CORRECTED)
        self.assertEqual(issue.reviewed_by, user)
        self.assertIsNotNone(issue.reviewed_at)

    def test_keep_current_url_decision_requires_explicit_confirmation(self):
        self._authenticate_editor('url-confirmation-editor')
        course = Course.objects.get(slug='advanced-program-in-business-finance-and-analytics')
        original = course.seo.canonical_url
        response = self.client.post(f'/api/v1/seo-panel/courses/{course.slug}/url-decision/keep-current/', {}, format='json')
        self.assertEqual(response.status_code, 400)
        course.seo.refresh_from_db()
        self.assertEqual(course.seo.canonical_url, original)

    def test_guarded_url_migration_updates_slug_canonical_alias_redirect_and_audit_atomically(self):
        user = self._authenticate_editor('url-migration-editor')
        course = Course.objects.get(slug='ifrs-course')
        old_slug, old_status, old_hash = course.slug, course.status, course.source_hash
        new_slug = 'ifrs-course-reviewed-url'
        response = self.client.post(f'/api/v1/seo-panel/courses/{old_slug}/url-migration/', {
            'primary_slug': new_slug,
            'canonical_url': f'https://finprov.com/courses/{new_slug}/',
            'preserve_old_slug_as_alias': True,
            'create_redirect': True,
            'migration_note': 'Approved URL migration test.',
            'confirmation': 'APPLY_URL_CHANGE',
        }, format='json')
        self.assertEqual(response.status_code, 200, response.json())
        course.refresh_from_db(); course.seo.refresh_from_db()
        self.assertEqual((course.slug, course.status, course.source_hash), (new_slug, old_status, old_hash))
        self.assertEqual(course.seo.canonical_url, f'https://finprov.com/courses/{new_slug}/')
        self.assertTrue(course.aliases.filter(slug=old_slug).exists())
        self.assertTrue(Redirect.objects.filter(old_path=f'/courses/{old_slug}/', new_path=f'/courses/{new_slug}/', redirect_type=301).exists())
        audit = course.review_issues.filter(summary='Explicit course URL migration approved').latest('id')
        self.assertEqual((audit.status, audit.reviewed_by), (CourseReviewIssue.STATUS_CORRECTED, user))

    def test_guarded_url_migration_rejects_collision_without_partial_changes(self):
        self._authenticate_editor('url-collision-editor')
        course = Course.objects.get(slug='ifrs-course')
        original = (course.slug, course.seo.canonical_url, list(course.aliases.values_list('slug', flat=True)))
        response = self.client.post(f'/api/v1/seo-panel/courses/{course.slug}/url-migration/', {
            'primary_slug': 'business-analyst-course',
            'canonical_url': 'https://finprov.com/courses/business-analyst-course/',
            'preserve_old_slug_as_alias': True, 'create_redirect': True,
            'migration_note': 'This collision must fail.', 'confirmation': 'APPLY_URL_CHANGE',
        }, format='json')
        self.assertEqual(response.status_code, 400)
        course.refresh_from_db(); course.seo.refresh_from_db()
        self.assertEqual((course.slug, course.seo.canonical_url, list(course.aliases.values_list('slug', flat=True))), original)

    def test_atomic_editor_updates_main_nested_and_seo_without_governance_changes(self):
        self._authenticate_editor()
        course = Course.objects.get(slug='ifrs-course')
        course.status = Course.STATUS_PUBLISHED
        course.save(update_fields=['status'])
        original = {
            'slug': course.slug, 'status': course.status, 'active': course.is_active,
            'order': course.display_order, 'source_hash': course.source_hash,
            'canonical': course.seo.canonical_url,
            'aliases': list(course.aliases.values_list('slug', flat=True)),
            'reviews': list(course.review_issues.values_list('id', 'status', 'resolution_note')),
        }
        skill = course.skills.first()
        highlight = course.highlights.first()
        response = self.client.patch(f'/api/v1/seo-panel/courses/{course.slug}/content/', {
            'title': 'IFRS Course — edited safely',
            'skills': [
                {'id': skill.id, 'text': 'Updated skill', 'is_active': True},
                {'text': 'New skill', 'is_active': True},
            ],
            'highlights': [{'id': highlight.id, 'text': highlight.text, 'is_active': True}],
            'seo': {'seo_title': 'Updated IFRS SEO title', 'og_title': 'Updated IFRS OG title'},
        }, format='json')
        self.assertEqual(response.status_code, 200, response.json())
        course.refresh_from_db(); course.seo.refresh_from_db()
        self.assertEqual(course.title, 'IFRS Course — edited safely')
        self.assertEqual(list(course.skills.values_list('text', flat=True)), ['Updated skill', 'New skill'])
        self.assertEqual(course.seo.seo_title, 'Updated IFRS SEO title')
        self.assertEqual((course.slug, course.status, course.is_active, course.display_order, course.source_hash),
                         (original['slug'], original['status'], original['active'], original['order'], original['source_hash']))
        self.assertEqual(course.seo.canonical_url, original['canonical'])
        self.assertEqual(list(course.aliases.values_list('slug', flat=True)), original['aliases'])
        self.assertEqual(list(course.review_issues.values_list('id', 'status', 'resolution_note')), original['reviews'])

    def test_atomic_editor_rolls_back_main_change_when_nested_validation_fails(self):
        self._authenticate_editor('rollback-editor')
        course = Course.objects.get(slug='ifrs-course')
        original_title = course.title
        response = self.client.patch(f'/api/v1/seo-panel/courses/{course.slug}/content/', {
            'title': 'This must roll back',
            'skills': [{'id': 999999, 'text': 'Foreign record'}],
        }, format='json')
        self.assertEqual(response.status_code, 400)
        course.refresh_from_db()
        self.assertEqual(course.title, original_title)

    def test_atomic_editor_rejects_every_protected_governance_field(self):
        self._authenticate_editor('protected-editor')
        course = Course.objects.get(slug='ifrs-course')
        protected = ['slug', 'status', 'is_active', 'display_order', 'aliases', 'source_hash', 'review_issues']
        response = self.client.patch(f'/api/v1/seo-panel/courses/{course.slug}/content/', {
            **{name: 'forbidden' for name in protected},
            'seo': {'canonical_url': 'https://example.com/changed/'},
        }, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('protected_fields', response.json())
        course.refresh_from_db()
        self.assertEqual(course.slug, 'ifrs-course')

    def test_atomic_editor_uploads_course_image_syllabus_and_og_image(self):
        self._authenticate_editor('atomic-media-editor')
        course = Course.objects.get(slug='ifrs-course')
        png = base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=')
        response = self.client.patch(f'/api/v1/seo-panel/courses/{course.slug}/content/', {
            'payload': '{"image_alt":"Atomic course image","seo":{"og_image_alt":"Atomic OG image"}}',
            'image': SimpleUploadedFile('course.png', png, content_type='image/png'),
            'og_image': SimpleUploadedFile('og.png', png, content_type='image/png'),
            'syllabus_pdf': SimpleUploadedFile('syllabus.pdf', b'%PDF-1.4\n%%EOF', content_type='application/pdf'),
        }, format='multipart')
        self.assertEqual(response.status_code, 200, response.json())
        course.refresh_from_db(); course.seo.refresh_from_db()
        self.assertTrue(course.image.storage.exists(course.image.name))
        self.assertTrue(course.syllabus_pdf.storage.exists(course.syllabus_pdf.name))
        self.assertTrue(course.seo.og_image.storage.exists(course.seo.og_image.name))
        self.assertEqual(course.image_alt, 'Atomic course image')

    def test_review_summary_marks_reviewed_url_issue_deferred_and_not_ready(self):
        self._authenticate_editor('deferred-summary-editor')
        course = Course.objects.get(slug='advanced-program-in-business-finance-and-analytics')
        issue = course.review_issues.filter(category__in=['url', 'ownership']).first()
        self.assertIsNotNone(issue)
        course.review_issues.filter(blocking=True, status=CourseReviewIssue.STATUS_OPEN).update(
            status=CourseReviewIssue.STATUS_REVIEWED,
        )
        response = self.client.get(f'/api/v1/seo-panel/courses/{course.slug}/')
        self.assertEqual(response.status_code, 200)
        summary = response.json()['review_summary']
        self.assertEqual(summary['url_review']['status'], 'deferred')
        self.assertEqual(summary['publication']['status'], 'deferred')

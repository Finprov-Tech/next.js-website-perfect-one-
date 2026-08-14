from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from rest_framework.test import APIClient

from modules.models import Banner, Credentials, CredentialItem, TeamMember, TeamSection
from pages.models import Page
from seo.models import Redirect, SEOMeta
from core.models import SiteSettings


GIF_1X1 = (
    b'GIF89a\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\xff\xff\xff!\xf9\x04\x01\x00\x00\x00\x00,'
    b'\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;'
)


class SEOPanelModuleTests(TestCase):
    def setUp(self):
        group, _ = Group.objects.get_or_create(name='SEO Team')
        self.user = get_user_model().objects.create_user('editor', password='safe-password', is_staff=True)
        self.user.groups.add(group)
        self.client = APIClient()
        self.client.force_authenticate(self.user)
        self.page = Page.objects.create(name='Home', slug='home', status=Page.STATUS_PUBLISHED, is_homepage=True)

    def test_page_editor_includes_inactive_items_for_reactivation(self):
        credentials = Credentials.objects.create(page=self.page, heading='Stats')
        CredentialItem.objects.create(credentials=credentials, title='Hidden', value='1', is_active=False)

        response = self.client.get('/api/v1/seo-panel/pages/home/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['credentials']['items'][0]['title'], 'Hidden')
        self.assertFalse(response.data['credentials']['items'][0]['is_active'])

    def test_duplicate_focus_keyword_is_rejected_with_existing_page_url(self):
        SEOMeta.objects.create(page=self.page, focus_keyword='Job Oriented Courses')
        second_page = Page.objects.create(name='About', slug='about', status=Page.STATUS_PUBLISHED)
        second_seo = SEOMeta.objects.create(page=second_page)

        response = self.client.patch(
            f'/api/v1/seo-panel/seo-meta/{second_seo.pk}/',
            {'focus_keyword': '  job oriented courses  '},
            format='json',
        )

        self.assertEqual(response.status_code, 400, response.data)
        self.assertIn('http://localhost:3000', str(response.data['focus_keyword'][0]))

    def test_slug_change_updates_url_canonical_and_creates_permanent_redirect(self):
        page = Page.objects.create(name='Services', slug='services', status=Page.STATUS_PUBLISHED)
        seo = SEOMeta.objects.create(
            page=page,
            canonical_url='https://finprov.com/services/',
            include_in_sitemap=True,
        )

        response = self.client.patch(
            '/api/v1/seo-panel/pages/services/slug/',
            {'slug': 'professional-services'},
            format='json',
        )

        self.assertEqual(response.status_code, 200, response.data)
        page.refresh_from_db()
        seo.refresh_from_db()
        self.assertEqual(page.slug, 'professional-services')
        self.assertEqual(seo.canonical_url, 'https://finprov.com/professional-services/')
        self.assertTrue(
            Redirect.objects.filter(
                old_path='/services/',
                new_path='/professional-services/',
                redirect_type=301,
                is_active=True,
            ).exists()
        )

        public_response = self.client.get('/api/v1/pages/')
        rows = public_response.data.get('results', public_response.data)
        slugs = {row['slug'] for row in rows}
        self.assertIn('professional-services', slugs)
        self.assertNotIn('services', slugs)

    def test_redirect_manager_normalizes_paths_and_rejects_chains(self):
        response = self.client.post(
            '/api/v1/seo-panel/redirects/',
            {'old_path': '/retired-page', 'new_path': '/replacement', 'redirect_type': 301, 'is_active': True},
            format='json',
        )
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data['old_path'], '/retired-page/')
        self.assertEqual(response.data['new_path'], '/replacement/')

        chained = self.client.post(
            '/api/v1/seo-panel/redirects/',
            {'old_path': '/older-page/', 'new_path': '/retired-page/', 'redirect_type': 302, 'is_active': True},
            format='json',
        )
        self.assertEqual(chained.status_code, 400, chained.data)
        self.assertIn('final destination', str(chained.data['new_path'][0]))

    def test_seo_team_can_update_custom_404_content(self):
        response = self.client.patch(
            '/api/v1/seo-panel/site-settings/1/',
            {'custom_404_title': 'That page has moved', 'custom_404_message': 'Try searching or return home.'},
            format='json',
        )
        self.assertEqual(response.status_code, 200, response.data)
        settings = SiteSettings.load()
        self.assertEqual(settings.custom_404_title, 'That page has moved')

    def test_editor_can_replace_image_and_alt_text(self):
        banner = Banner.objects.create(page=self.page, heading='Original')
        upload = SimpleUploadedFile('hero.gif', GIF_1X1, content_type='image/gif')

        response = self.client.patch(
            f'/api/v1/seo-panel/modules/banners/{banner.pk}/',
            {'heading': 'Updated', 'image': upload, 'image_alt': 'Updated hero'},
            format='multipart',
        )

        self.assertEqual(response.status_code, 200, response.data)
        banner.refresh_from_db()
        self.assertEqual(banner.heading, 'Updated')
        self.assertEqual(banner.image_alt, 'Updated hero')
        self.assertTrue(bool(banner.image))

        clear = self.client.patch(
            f'/api/v1/seo-panel/modules/banners/{banner.pk}/',
            {'image': ''},
            format='multipart',
        )
        self.assertEqual(clear.status_code, 200, clear.data)
        banner.refresh_from_db()
        self.assertFalse(bool(banner.image))

    def test_editor_can_create_reorder_deactivate_and_delete_child_item(self):
        credentials = Credentials.objects.create(page=self.page, heading='Stats')
        create = self.client.post(
            '/api/v1/seo-panel/modules/credential-items/',
            {'credentials': credentials.pk, 'title': 'Learners', 'value': '4500+', 'display_order': 3},
            format='json',
        )
        self.assertEqual(create.status_code, 201, create.data)
        item_id = create.data['id']

        update = self.client.patch(
            f'/api/v1/seo-panel/modules/credential-items/{item_id}/',
            {'display_order': 1, 'is_active': False},
            format='json',
        )
        self.assertEqual(update.status_code, 200, update.data)
        item = CredentialItem.objects.get(pk=item_id)
        self.assertEqual(item.display_order, 1)
        self.assertFalse(item.is_active)

        delete = self.client.delete(f'/api/v1/seo-panel/modules/credential-items/{item_id}/')
        self.assertEqual(delete.status_code, 204)
        self.assertFalse(CredentialItem.objects.filter(pk=item_id).exists())

    def test_non_seo_staff_cannot_use_editor(self):
        outsider = get_user_model().objects.create_user('outsider', password='safe-password', is_staff=True)
        self.client.force_authenticate(outsider)
        response = self.client.get('/api/v1/seo-panel/pages/home/')
        self.assertEqual(response.status_code, 403)

    def test_team_photo_alt_is_returned_to_editor(self):
        section = TeamSection.objects.create(page=self.page, heading='Team')
        TeamMember.objects.create(team_section=section, name='Editor', photo_alt='Portrait of editor')
        response = self.client.get('/api/v1/seo-panel/pages/home/')
        self.assertEqual(response.data['team']['members'][0]['photo_alt'], 'Portrait of editor')

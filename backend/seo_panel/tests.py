from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from rest_framework.test import APIClient

from modules.models import Banner, Credentials, CredentialItem, TeamMember, TeamSection
from pages.models import Page


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

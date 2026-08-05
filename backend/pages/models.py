from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify
from simple_history.models import HistoricalRecords

from core.models import TimeStampedModel


class PageType(models.Model):
    """Dynamic, admin-managed lookup for categorizing pages (Home, About, Landing Page, ...).

    Deliberately a model rather than a `choices=` enum so new categories never
    require a code change or migration.
    """

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Page Type'
        verbose_name_plural = 'Page Types'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Page(TimeStampedModel):
    STATUS_DRAFT = 'draft'
    STATUS_PUBLISHED = 'published'
    STATUS_ARCHIVED = 'archived'
    STATUS_CHOICES = [
        (STATUS_DRAFT, 'Draft'),
        (STATUS_PUBLISHED, 'Published'),
        (STATUS_ARCHIVED, 'Archived'),
    ]

    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    page_type = models.ForeignKey(
        PageType, on_delete=models.SET_NULL, null=True, blank=True, related_name='pages'
    )
    is_homepage = models.BooleanField(
        default=False, help_text='At most one page may be marked as the homepage.'
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=STATUS_DRAFT)

    history = HistoricalRecords()

    class Meta:
        ordering = ['name']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._loaded_slug = self.slug

    def clean(self):
        super().clean()
        if self.is_homepage:
            qs = Page.objects.filter(is_homepage=True)
            if self.pk:
                qs = qs.exclude(pk=self.pk)
            if qs.exists():
                raise ValidationError({'is_homepage': 'Another page is already set as the homepage.'})

    def save(self, *args, **kwargs):
        # Stash the previous slug (as a plain attribute, not a DB field) so a
        # post_save receiver elsewhere (seo app) can create a redirect without
        # this app needing to import/know about the seo app at all.
        if self.pk and self._loaded_slug and self._loaded_slug != self.slug:
            self._previous_slug = self._loaded_slug
        super().save(*args, **kwargs)
        self._loaded_slug = self.slug

    def __str__(self):
        return self.name

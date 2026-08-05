from django.db import models
from simple_history.models import HistoricalRecords

from core.models import TimeStampedModel


class SEOMeta(TimeStampedModel):
    """The single, page-level SEO record. One per Page — never per-module."""

    ROBOTS_INDEX_FOLLOW = 'index,follow'
    ROBOTS_NOINDEX_FOLLOW = 'noindex,follow'
    ROBOTS_INDEX_NOFOLLOW = 'index,nofollow'
    ROBOTS_NOINDEX_NOFOLLOW = 'noindex,nofollow'
    ROBOTS_CHOICES = [
        (ROBOTS_INDEX_FOLLOW, 'Index, Follow'),
        (ROBOTS_NOINDEX_FOLLOW, 'Noindex, Follow'),
        (ROBOTS_INDEX_NOFOLLOW, 'Index, Nofollow'),
        (ROBOTS_NOINDEX_NOFOLLOW, 'Noindex, Nofollow'),
    ]

    SCHEMA_CHOICES = [
        ('none', 'None'),
        ('organization', 'Organization'),
        ('article', 'Article'),
        ('faq', 'FAQ'),
        ('course', 'Course'),
        ('breadcrumb', 'Breadcrumb'),
        ('localbusiness', 'LocalBusiness'),
        ('product', 'Product'),
    ]

    page = models.OneToOneField('pages.Page', on_delete=models.CASCADE, related_name='seo')

    # General SEO
    seo_title = models.CharField(max_length=255, blank=True)
    meta_description = models.CharField(max_length=320, blank=True)
    focus_keyword = models.CharField(max_length=255, blank=True)
    canonical_url = models.URLField(blank=True)
    meta_robots = models.CharField(max_length=20, choices=ROBOTS_CHOICES, default=ROBOTS_INDEX_FOLLOW)

    # Social Sharing
    og_title = models.CharField(max_length=255, blank=True)
    og_description = models.CharField(max_length=320, blank=True)
    og_image = models.ImageField(upload_to='seo/%Y/%m/', blank=True, null=True)
    og_url = models.URLField(blank=True)

    # Schema
    schema_type = models.CharField(max_length=20, choices=SCHEMA_CHOICES, default='none')
    custom_schema_json = models.JSONField(blank=True, null=True, help_text='Optional raw JSON-LD override.')

    # Sitemap
    include_in_sitemap = models.BooleanField(default=True)

    # Content SEO
    author_name = models.CharField(max_length=255, blank=True, help_text='Blog pages only.')
    author_bio = models.TextField(blank=True)
    author_image = models.ImageField(upload_to='seo/%Y/%m/', blank=True, null=True)
    word_count = models.PositiveIntegerField(blank=True, null=True)

    history = HistoricalRecords()

    class Meta:
        verbose_name = 'SEO Meta'
        verbose_name_plural = 'SEO Meta'

    def __str__(self):
        return f'SEO — {self.page.name}'


class Redirect(models.Model):
    REDIRECT_301 = 301
    REDIRECT_302 = 302
    REDIRECT_TYPE_CHOICES = [
        (REDIRECT_301, '301 (Permanent)'),
        (REDIRECT_302, '302 (Temporary)'),
    ]

    old_path = models.CharField(max_length=255, unique=True)
    new_path = models.CharField(max_length=255)
    redirect_type = models.PositiveSmallIntegerField(choices=REDIRECT_TYPE_CHOICES, default=REDIRECT_301)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.old_path} -> {self.new_path} ({self.redirect_type})'

from django.core.exceptions import ValidationError
from django.db import models
from simple_history.models import HistoricalRecords

from core.models import TimeStampedModel


class SEOMeta(TimeStampedModel):
    """The single SEO record for a Page OR a BlogPost — never per-module.

    Exactly one of `page`/`blog_post`/`course` must be set; enforced in clean().
    """

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
        ('webpage', 'WebPage'),
        ('organization', 'Organization'),
        ('article', 'Article'),
        ('blogposting', 'BlogPosting'),
        ('faq', 'FAQ'),
        ('course', 'Course'),
        ('breadcrumb', 'Breadcrumb'),
        ('localbusiness', 'LocalBusiness'),
        ('product', 'Product'),
    ]

    page = models.OneToOneField('pages.Page', on_delete=models.CASCADE, related_name='seo', null=True, blank=True)
    blog_post = models.OneToOneField('blog.BlogPost', on_delete=models.CASCADE, related_name='seo', null=True, blank=True)
    course = models.OneToOneField('courses.Course', on_delete=models.CASCADE, related_name='seo', null=True, blank=True)

    # General SEO
    seo_title = models.CharField(max_length=255, blank=True)
    meta_description = models.CharField(max_length=320, blank=True)
    focus_keyword = models.CharField(max_length=255, blank=True, db_index=True)
    secondary_keywords = models.JSONField(default=list, blank=True)
    canonical_url = models.URLField(blank=True)
    meta_robots = models.CharField(max_length=64, blank=True, default=ROBOTS_INDEX_FOLLOW)

    # Social Sharing
    og_title = models.CharField(max_length=255, blank=True)
    og_description = models.CharField(max_length=320, blank=True)
    og_image = models.ImageField(upload_to='seo/%Y/%m/', blank=True, null=True)
    og_image_alt = models.CharField(max_length=255, blank=True)
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

    def clean(self):
        super().clean()
        if sum(bool(value) for value in (self.page_id, self.blog_post_id, self.course_id)) != 1:
            raise ValidationError('Exactly one of "page", "blog_post", or "course" must be set.')

    def __str__(self):
        target = self.page or self.blog_post or self.course
        return f'SEO — {target}' if target else 'SEO — (unattached)'


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

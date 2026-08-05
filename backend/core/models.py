from django.core.exceptions import ValidationError
from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class OrderedToggleModel(models.Model):
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        abstract = True
        ordering = ['display_order']


class MediaFieldsMixin(models.Model):
    image = models.ImageField(upload_to='modules/%Y/%m/', blank=True, null=True)
    image_alt = models.CharField(max_length=255, blank=True)

    class Meta:
        abstract = True


HEADING_LEVEL_CHOICES = [
    ('h1', 'H1'),
    ('h2', 'H2'),
    ('h3', 'H3'),
    ('h4', 'H4'),
    ('h5', 'H5'),
    ('h6', 'H6'),
]


class HeadingFieldsMixin(models.Model):
    heading = models.CharField(max_length=255, blank=True)
    sub_heading = models.CharField(max_length=255, blank=True)
    heading_level = models.CharField(max_length=2, choices=HEADING_LEVEL_CHOICES, default='h2')

    class Meta:
        abstract = True

    def clean(self):
        super().clean()
        if self.heading_level == 'h1':
            enforce_single_h1_per_page(self)


def enforce_single_h1_per_page(instance):
    """Shared H1-uniqueness check called from every HeadingFieldsMixin subclass's clean().

    Only one heading across all modules on a given page may be marked H1.
    """
    page = getattr(instance, 'page', None)
    if page is None:
        return

    from django.apps import apps

    for model in apps.get_models():
        if not (issubclass(model, HeadingFieldsMixin) and hasattr(model, 'page')):
            continue
        qs = model.objects.filter(page=page, heading_level='h1')
        if instance.pk and model is type(instance):
            qs = qs.exclude(pk=instance.pk)
        if qs.exists():
            raise ValidationError(
                {'heading_level': 'This page already has an H1 heading on another module. Only one H1 is allowed per page.'}
            )


class PageScopedModule(TimeStampedModel, OrderedToggleModel):
    """Abstract base for every content-module model: a module belongs to exactly one Page."""

    page = models.ForeignKey('pages.Page', on_delete=models.CASCADE, related_name='%(class)s_set')

    class Meta:
        abstract = True
        ordering = ['page', 'display_order']


class SiteSettings(models.Model):
    site_name = models.CharField(max_length=255, default='Finprov')
    site_logo = models.ImageField(upload_to='site/', blank=True, null=True)
    default_og_image = models.ImageField(upload_to='site/', blank=True, null=True)
    custom_404_title = models.CharField(max_length=255, blank=True, default='Page not found')
    custom_404_message = models.TextField(blank=True)
    custom_404_image = models.ImageField(upload_to='site/', blank=True, null=True)

    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return 'Site Settings'

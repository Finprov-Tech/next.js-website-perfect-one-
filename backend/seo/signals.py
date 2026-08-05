from django.db.models.signals import post_save
from django.dispatch import receiver

from pages.models import Page
from seo.models import Redirect


@receiver(post_save, sender=Page)
def create_redirect_on_slug_change(sender, instance, **kwargs):
    """Page.save() stashes the previous slug on `_previous_slug` when it changes.

    We read that plain instance attribute here rather than having the pages
    app import/know about the seo app.
    """
    old_slug = getattr(instance, '_previous_slug', None)
    if not old_slug or old_slug == instance.slug:
        return

    Redirect.objects.get_or_create(
        old_path=f'/{old_slug}/',
        defaults={'new_path': f'/{instance.slug}/', 'redirect_type': Redirect.REDIRECT_301},
    )
    del instance._previous_slug

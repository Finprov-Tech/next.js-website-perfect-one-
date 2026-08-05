from django.db import transaction
from django.db.models import F
from django.db.models.signals import post_save
from django.dispatch import receiver

from pages.models import Page
from seo.models import Redirect


@receiver(post_save, sender=Page)
def create_redirect_on_slug_change(sender, instance, **kwargs):
    """Page.save() stashes the previous slug on `_previous_slug` when it changes.

    We read that plain instance attribute here rather than having the pages
    app import/know about the seo app.

    Uses update_or_create (not get_or_create) so a reused old_path is
    overwritten with the current destination, and collapses any existing
    redirect chain that pointed at the old slug so it points straight at the
    new one instead of hopping through an intermediate slug.
    """
    old_slug = getattr(instance, '_previous_slug', None)
    if hasattr(instance, '_previous_slug'):
        del instance._previous_slug
    if not old_slug or old_slug == instance.slug:
        return

    old_path = f'/{old_slug}/'
    new_path = f'/{instance.slug}/'

    with transaction.atomic():
        Redirect.objects.filter(new_path=old_path).exclude(new_path=new_path).update(new_path=new_path)
        Redirect.objects.update_or_create(
            old_path=old_path,
            defaults={'new_path': new_path, 'redirect_type': Redirect.REDIRECT_301, 'is_active': True},
        )
        Redirect.objects.filter(old_path=F('new_path')).delete()

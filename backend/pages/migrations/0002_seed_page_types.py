from django.db import migrations
from django.utils.text import slugify

DEFAULT_PAGE_TYPES = [
    'Home', 'About', 'Courses', 'Blogs', 'Placements', 'Contact', 'Careers',
    'Landing Page', 'Other',
]


def seed_page_types(apps, schema_editor):
    PageType = apps.get_model('pages', 'PageType')
    for name in DEFAULT_PAGE_TYPES:
        PageType.objects.get_or_create(name=name, defaults={'slug': slugify(name)})


def unseed_page_types(apps, schema_editor):
    PageType = apps.get_model('pages', 'PageType')
    PageType.objects.filter(name__in=DEFAULT_PAGE_TYPES).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('pages', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_page_types, unseed_page_types),
    ]

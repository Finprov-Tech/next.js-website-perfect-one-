from django.db import migrations, models
from django.utils.text import slugify


def populate_author_slugs(apps, schema_editor):
    Author = apps.get_model("blog", "Author")
    seen: set[str] = set()
    overrides = {
        "CA Veena Vijayan": "ca-veena",
        "CA Anish": "ca-anish",
        "CA Anand Kumar": "ca-anand-kumar",
        "CA Taniya": "ca-taniya",
        "Abin Varghese": "abin-varghese",
        "Tech-Finprov": "tech-finprov",
        "Tech Finprov": "tech-finprov-2",
    }
    for author in Author.objects.all().order_by("id"):
        slug = overrides.get(author.name) or slugify(author.name) or "author"
        base = slug
        suffix = 1
        while slug in seen or Author.objects.exclude(pk=author.pk).filter(slug=slug).exists():
            suffix += 1
            slug = f"{base}-{suffix}"
        author.slug = slug
        author.save(update_fields=["slug"])
        seen.add(slug)


class Migration(migrations.Migration):
    dependencies = [
        ("blog", "0004_remove_legacy_author_fields"),
    ]

    operations = [
        migrations.AddField(
            model_name="author",
            name="slug",
            field=models.SlugField(blank=True, max_length=255),
        ),
        migrations.RunPython(populate_author_slugs, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="author",
            name="slug",
            field=models.SlugField(blank=True, max_length=255, unique=True),
        ),
    ]

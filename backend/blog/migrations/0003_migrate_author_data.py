from django.db import migrations


def forwards(apps, schema_editor):
    BlogPost = apps.get_model('blog', 'BlogPost')
    Author = apps.get_model('blog', 'Author')

    cache = {}
    for post in BlogPost.objects.exclude(author_name='').iterator():
        key = (post.author_name.strip(), post.author_role.strip())
        if key not in cache:
            author, _ = Author.objects.get_or_create(name=key[0], role=key[1])
            cache[key] = author
        post.author = cache[key]
        post.save(update_fields=['author'])


def backwards(apps, schema_editor):
    BlogPost = apps.get_model('blog', 'BlogPost')
    for post in BlogPost.objects.select_related('author').exclude(author__isnull=True).iterator():
        post.author_name = post.author.name
        post.author_role = post.author.role
        post.save(update_fields=['author_name', 'author_role'])


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0002_add_author_model'),
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
    ]

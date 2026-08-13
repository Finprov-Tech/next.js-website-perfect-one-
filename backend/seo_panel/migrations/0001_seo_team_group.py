from django.contrib.auth.hashers import make_password
from django.db import migrations

SEO_TEAM_GROUP = 'SEO Team'
SEO_USERNAME = 'seo'


def create_seo_team(apps, schema_editor):
    Group = apps.get_model('auth', 'Group')
    User = apps.get_model('auth', 'User')

    group, _ = Group.objects.get_or_create(name=SEO_TEAM_GROUP)

    user, created = User.objects.get_or_create(
        username=SEO_USERNAME,
        defaults={'is_staff': True, 'is_superuser': False},
    )
    if created:
        # No real password is set here — a superuser sets it later via
        # `python manage.py changepassword seo` or the /admin/ Users screen.
        # (Historical migration models don't carry AbstractBaseUser's
        # set_unusable_password() method, so this replicates it directly.)
        user.password = make_password(None)
        user.save()
    user.groups.add(group)


def remove_seo_team(apps, schema_editor):
    Group = apps.get_model('auth', 'Group')
    User = apps.get_model('auth', 'User')
    User.objects.filter(username=SEO_USERNAME).delete()
    Group.objects.filter(name=SEO_TEAM_GROUP).delete()


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ('auth', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_seo_team, remove_seo_team),
    ]

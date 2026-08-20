from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.management.base import BaseCommand

SEO_TEAM_GROUP = 'SEO Team'
SEO_USERNAME = 'seo'
SEO_PASSWORD = 'seo@2026'


class Command(BaseCommand):
    help = (
        'Idempotently creates/updates the SEO panel user '
        f'({SEO_USERNAME}/{SEO_PASSWORD}) and adds them to the SEO Team group.'
    )

    def handle(self, *args, **options):
        User = get_user_model()
        group, _ = Group.objects.get_or_create(name=SEO_TEAM_GROUP)

        user, created = User.objects.get_or_create(
            username=SEO_USERNAME,
            defaults={'is_staff': True, 'is_superuser': False},
        )
        user.is_staff = True
        user.is_superuser = False
        user.set_password(SEO_PASSWORD)
        user.save()
        user.groups.add(group)

        verb = 'Created' if created else 'Updated'
        self.stdout.write(self.style.SUCCESS(f'{verb} SEO panel user "{SEO_USERNAME}".'))

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

DEV_USERNAME = 'Admin'
DEV_PASSWORD = 'Admin@123'


class Command(BaseCommand):
    help = (
        'Idempotently creates/updates the temporary development superuser '
        f'({DEV_USERNAME}/{DEV_PASSWORD}). Development only.'
    )

    def handle(self, *args, **options):
        User = get_user_model()
        user, created = User.objects.get_or_create(
            username=DEV_USERNAME,
            defaults={'is_staff': True, 'is_superuser': True},
        )
        user.is_staff = True
        user.is_superuser = True
        user.set_password(DEV_PASSWORD)
        user.save()

        verb = 'Created' if created else 'Updated'
        self.stdout.write(self.style.SUCCESS(f'{verb} development superuser "{DEV_USERNAME}".'))

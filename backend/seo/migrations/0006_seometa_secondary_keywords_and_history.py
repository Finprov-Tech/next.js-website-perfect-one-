from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('seo', '0005_historicalseometa_course_seometa_course'),
    ]

    operations = [
        migrations.AddField(
            model_name='seometa',
            name='secondary_keywords',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='historicalseometa',
            name='secondary_keywords',
            field=models.JSONField(blank=True, default=list),
        ),
    ]

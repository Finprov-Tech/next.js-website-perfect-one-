from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('seo', '0006_seometa_secondary_keywords_and_history'),
    ]

    operations = [
        migrations.AlterField(
            model_name='seometa',
            name='meta_robots',
            field=models.CharField(blank=True, default='index,follow', max_length=64),
        ),
        migrations.AlterField(
            model_name='historicalseometa',
            name='meta_robots',
            field=models.CharField(blank=True, default='index,follow', max_length=64),
        ),
    ]

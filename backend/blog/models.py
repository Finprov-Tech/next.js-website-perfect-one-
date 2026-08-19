from django.db import models
from django.utils.text import slugify
from simple_history.models import HistoricalRecords

from core.models import OrderedToggleModel, TimeStampedModel


class BlogCategory(models.Model):
    """Lookup for blog post categories — same lookup-model pattern as pages.PageType."""

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order', 'name']
        verbose_name = 'Blog Category'
        verbose_name_plural = 'Blog Categories'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Author(models.Model):
    """A reusable byline — selected from a dropdown per post instead of
    retyping name/role every time, with a profile (bio + photo) for an
    'About the author' block."""

    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    role = models.CharField(max_length=255, blank=True)
    bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to='authors/%Y/%m/', blank=True, null=True)
    photo_alt = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Author'
        verbose_name_plural = 'Authors'

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(self.name) or "author"
            slug = base
            suffix = 1
            while Author.objects.exclude(pk=self.pk).filter(slug=slug).exists():
                suffix += 1
                slug = f"{base}-{suffix}"
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class BlogPost(TimeStampedModel):
    STATUS_DRAFT = 'draft'
    STATUS_PUBLISHED = 'published'
    STATUS_ARCHIVED = 'archived'
    STATUS_CHOICES = [
        (STATUS_DRAFT, 'Draft'),
        (STATUS_PUBLISHED, 'Published'),
        (STATUS_ARCHIVED, 'Archived'),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    category = models.ForeignKey(BlogCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='posts')
    excerpt = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to='blog/%Y/%m/', blank=True, null=True)
    cover_image_alt = models.CharField(max_length=255, blank=True)
    author = models.ForeignKey(Author, on_delete=models.SET_NULL, null=True, blank=True, related_name='posts')
    published_date = models.DateField(null=True, blank=True)
    read_time = models.CharField(max_length=50, blank=True, help_text='Free text, e.g. "5 min read".')
    is_featured = models.BooleanField(default=False)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=STATUS_DRAFT)
    display_order = models.PositiveIntegerField(default=0, help_text='Tie-breaker only — primary ordering is by published date.')

    history = HistoricalRecords()

    class Meta:
        ordering = ['-published_date']

    def __str__(self):
        return self.title


class BlogPostSection(OrderedToggleModel):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='sections')
    heading = models.CharField(max_length=255)
    body = models.TextField(blank=True)

    class Meta(OrderedToggleModel.Meta):
        verbose_name = 'Blog Post Section'

    def __str__(self):
        return f'{self.post.title} — {self.heading}'

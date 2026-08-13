from django.core.exceptions import ValidationError
from django.db import models
from django.conf import settings
from simple_history.models import HistoricalRecords

from core.models import OrderedToggleModel, TimeStampedModel


class CourseCategory(OrderedToggleModel):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    display_label = models.CharField(max_length=100, blank=True)

    class Meta(OrderedToggleModel.Meta):
        verbose_name_plural = 'Course categories'

    def __str__(self):
        return self.display_label or self.name


class CourseProgramType(OrderedToggleModel):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Course(TimeStampedModel, OrderedToggleModel):
    STATUS_DRAFT = 'draft'
    STATUS_PUBLISHED = 'published'
    STATUS_ARCHIVED = 'archived'
    STATUS_CHOICES = [(STATUS_DRAFT, 'Draft'), (STATUS_PUBLISHED, 'Published'), (STATUS_ARCHIVED, 'Archived')]

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=STATUS_DRAFT)
    category = models.ForeignKey(CourseCategory, on_delete=models.PROTECT, related_name='courses')
    program_type = models.ForeignKey(CourseProgramType, on_delete=models.PROTECT, related_name='courses')
    badge = models.CharField(max_length=100, blank=True)
    badge_css_class = models.CharField(max_length=255, blank=True, help_text='Imported presentation fallback; not editorial.')
    duration = models.CharField(max_length=100, blank=True)
    mode = models.CharField(max_length=100, blank=True)
    tool_summary = models.CharField(max_length=500, blank=True)
    short_description = models.TextField(blank=True)
    hero_description = models.TextField(blank=True)
    snapshot_text = models.TextField(blank=True)
    online_fees = models.CharField(max_length=255, blank=True)
    offline_fees = models.CharField(max_length=255, blank=True)
    fee_summary = models.CharField(max_length=500, blank=True)
    eligibility = models.TextField(blank=True)
    hours_of_learning = models.CharField(max_length=100, blank=True)
    industry_projects = models.CharField(max_length=100, blank=True)
    tools_used_stat = models.CharField(max_length=100, blank=True)
    image = models.ImageField(upload_to='courses/%Y/%m/', blank=True, null=True)
    image_alt = models.CharField(max_length=255, blank=True)
    syllabus_pdf = models.FileField(upload_to='courses/syllabi/%Y/%m/', blank=True, null=True)
    syllabus_button_text = models.CharField(max_length=100, blank=True, default='Download Syllabus Brochure')
    source_payload = models.JSONField(default=dict, blank=True, editable=False)
    source_hash = models.CharField(max_length=64, blank=True, db_index=True, editable=False)
    needs_content_review = models.BooleanField(default=False)
    needs_url_review = models.BooleanField(default=False)
    review_notes = models.JSONField(default=list, blank=True)
    history = HistoricalRecords()

    class Meta(OrderedToggleModel.Meta):
        ordering = ['display_order', 'title']

    def __str__(self):
        return self.title


class CourseAlias(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='aliases')
    slug = models.SlugField(max_length=255, unique=True)

    def clean(self):
        if Course.objects.filter(slug=self.slug).exclude(pk=self.course_id).exists():
            raise ValidationError({'slug': 'Alias collides with a primary course slug.'})

    def __str__(self):
        return self.slug


class CourseListItem(OrderedToggleModel):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    text = models.TextField()

    class Meta(OrderedToggleModel.Meta):
        abstract = True

    def __str__(self):
        return self.text[:100]


class CourseHighlight(CourseListItem):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='highlights')


class CourseTool(CourseListItem):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='tools')


class CourseHiringPartner(CourseListItem):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='hiring_partners')


class CourseSkill(CourseListItem):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='skills')


class CourseAudience(CourseListItem):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='audiences')


class CourseJobOpportunity(CourseListItem):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='job_opportunities')


class CourseCertification(CourseListItem):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='certifications')


class CourseCareerProspect(CourseListItem):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='career_prospects')


class CourseCurriculumModule(OrderedToggleModel):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='curriculum_modules')
    title = models.CharField(max_length=500)

    def __str__(self):
        return self.title


class CourseCurriculumTopic(OrderedToggleModel):
    module = models.ForeignKey(CourseCurriculumModule, on_delete=models.CASCADE, related_name='topics')
    text = models.TextField()

    def __str__(self):
        return self.text[:100]


class CourseFAQ(OrderedToggleModel):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='faqs')
    question = models.CharField(max_length=500)
    answer = models.TextField()

    def __str__(self):
        return self.question


class CourseReviewIssue(models.Model):
    CATEGORY_ENCODING = 'encoding'
    CATEGORY_NAVIGATION = 'scraped_navigation'
    CATEGORY_URL = 'url'
    CATEGORY_SEO = 'seo'
    CATEGORY_OWNERSHIP = 'ownership'
    CATEGORY_CHOICES = [
        (CATEGORY_ENCODING, 'Encoding issue'),
        (CATEGORY_NAVIGATION, 'Scraped navigation'),
        (CATEGORY_URL, 'Canonical / slug conflict'),
        (CATEGORY_SEO, 'Missing SEO metadata'),
        (CATEGORY_OWNERSHIP, 'Landing-page ownership conflict'),
    ]
    STATUS_OPEN = 'open'
    STATUS_REVIEWED = 'reviewed'
    STATUS_CORRECTED = 'corrected'
    STATUS_CHOICES = [(STATUS_OPEN, 'Open'), (STATUS_REVIEWED, 'Reviewed'), (STATUS_CORRECTED, 'Corrected')]

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='review_issues')
    issue_key = models.CharField(max_length=64)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    field_name = models.CharField(max_length=100, blank=True)
    summary = models.CharField(max_length=500)
    details = models.JSONField(default=dict, blank=True)
    blocking = models.BooleanField(default=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=STATUS_OPEN)
    resolution_note = models.TextField(blank=True)
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='course_review_issues')
    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'field_name', 'id']
        constraints = [models.UniqueConstraint(fields=['course', 'issue_key'], name='unique_course_review_issue')]

    def __str__(self):
        return f'{self.course.slug}: {self.summary}'

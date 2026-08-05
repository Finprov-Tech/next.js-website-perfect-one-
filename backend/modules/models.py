from django.db import models
from simple_history.models import HistoricalRecords

from core.icons import DEFAULT_ICON, ICON_CHOICES
from core.models import HeadingFieldsMixin, MediaFieldsMixin, OrderedToggleModel, PageScopedModule


def icon_field(**kwargs):
    defaults = dict(max_length=32, choices=ICON_CHOICES, default=DEFAULT_ICON, blank=True)
    defaults.update(kwargs)
    return models.CharField(**defaults)


class LinkFieldsMixin(models.Model):
    """A CTA/link target: either an internal page or an external URL (not both required)."""

    cta_text = models.CharField(max_length=100, blank=True)
    cta_internal_page = models.ForeignKey(
        'pages.Page', on_delete=models.SET_NULL, null=True, blank=True, related_name='+',
        help_text='Link to another page within the CMS.',
    )
    cta_external_url = models.URLField(blank=True, help_text='External URL (used if no internal page is selected).')

    class Meta:
        abstract = True


class SecondaryLinkFieldsMixin(models.Model):
    """A second, optional CTA/link — e.g. a secondary button next to the primary one."""

    secondary_cta_text = models.CharField(max_length=100, blank=True, default='')
    secondary_cta_internal_page = models.ForeignKey(
        'pages.Page', on_delete=models.SET_NULL, null=True, blank=True, related_name='+',
    )
    secondary_cta_external_url = models.URLField(blank=True, default='')

    class Meta:
        abstract = True


class Banner(HeadingFieldsMixin, MediaFieldsMixin, LinkFieldsMixin, SecondaryLinkFieldsMixin, PageScopedModule):
    paragraph = models.TextField(blank=True)
    rich_text = models.TextField(blank=True, help_text='Raw HTML/rich content.')

    # Top badge (e.g. "Founded & led by Chartered Accountants")
    badge_text = models.CharField(max_length=255, blank=True, default='')
    badge_icon = icon_field(default='award')

    # Centres/location line (e.g. "10 centres · Kerala & Bengaluru")
    centres_text = models.CharField(max_length=255, blank=True, default='')

    # Top floating card (e.g. "IIT Palakkad iHub / Certified programs")
    top_card_title = models.CharField(max_length=255, blank=True, default='')
    top_card_subtitle = models.CharField(max_length=255, blank=True, default='')
    top_card_icon = icon_field(default='graduation-cap')

    # Bottom floating card (e.g. "Learn directly from practising CAs / 40+ years...")
    bottom_card_title = models.CharField(max_length=255, blank=True, default='')
    bottom_card_subtitle = models.CharField(max_length=255, blank=True, default='')
    bottom_card_icon = icon_field(default='users-round')

    # Floating statistic chip (e.g. "4,500+ / careers launched")
    floating_stat_value = models.CharField(max_length=50, blank=True, default='')
    floating_stat_label = models.CharField(max_length=100, blank=True, default='')

    history = HistoricalRecords()

    class Meta(PageScopedModule.Meta):
        verbose_name = 'Banner'

    def __str__(self):
        return f'{self.page.name} — Banner: {self.heading or "(untitled)"}'


class HeroAnimatedWord(OrderedToggleModel):
    banner = models.ForeignKey(Banner, on_delete=models.CASCADE, related_name='animated_words')
    word = models.CharField(max_length=100)

    class Meta(OrderedToggleModel.Meta):
        verbose_name = 'Hero Animated Word'

    def __str__(self):
        return self.word


class ScrollSection(PageScopedModule):
    heading = models.CharField(max_length=255, blank=True)

    history = HistoricalRecords()

    class Meta(PageScopedModule.Meta):
        verbose_name = 'Scroll Section'

    def __str__(self):
        return f'{self.page.name} — Scroll Section: {self.heading or "(untitled)"}'


class ScrollItem(OrderedToggleModel):
    scroll_section = models.ForeignKey(ScrollSection, on_delete=models.CASCADE, related_name='items')
    text = models.CharField(max_length=255)
    icon = icon_field()

    class Meta(OrderedToggleModel.Meta):
        verbose_name = 'Scroll Item'

    def __str__(self):
        return self.text


class Credentials(HeadingFieldsMixin, MediaFieldsMixin, PageScopedModule):
    paragraph = models.TextField(blank=True)

    history = HistoricalRecords()

    class Meta(PageScopedModule.Meta):
        verbose_name = 'Credentials'
        verbose_name_plural = 'Credentials'

    def __str__(self):
        return f'{self.page.name} — Credentials: {self.heading or "(untitled)"}'


class CredentialItem(OrderedToggleModel):
    credentials = models.ForeignKey(Credentials, on_delete=models.CASCADE, related_name='items')
    title = models.CharField(max_length=255, default='')
    value = models.CharField(max_length=100, blank=True)
    icon = icon_field(default='shield-check')

    class Meta(OrderedToggleModel.Meta):
        verbose_name = 'Credential Item'

    def __str__(self):
        return f'{self.title}: {self.value}' if self.value else self.title


class CourseSection(HeadingFieldsMixin, PageScopedModule):
    paragraph = models.TextField(blank=True, help_text='Not currently rendered on the homepage; reserved for future use.')
    background_image = models.ImageField(upload_to='modules/%Y/%m/', blank=True, null=True,
                                          help_text='Not currently rendered on the homepage; reserved for future use.')
    background_image_alt = models.CharField(max_length=255, blank=True)
    button_text = models.CharField(max_length=100, blank=True,
                                    help_text='Overrides the default "Compare all N programs..." link text.')
    button_internal_page = models.ForeignKey('pages.Page', on_delete=models.SET_NULL, null=True, blank=True, related_name='+')
    button_external_url = models.URLField(blank=True)

    history = HistoricalRecords()

    class Meta(PageScopedModule.Meta):
        verbose_name = 'Course Section'

    def __str__(self):
        return f'{self.page.name} — Course Section: {self.heading or "(untitled)"}'


class CourseCard(OrderedToggleModel):
    course_section = models.ForeignKey(CourseSection, on_delete=models.CASCADE, related_name='cards')
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, help_text='Matches the course detail page slug, e.g. /courses/<slug>.')
    category = models.CharField(max_length=50, help_text='Finance, Taxation, Analytics, Marketing, or Gulf — matches the homepage tabs.')
    program_type = models.CharField(max_length=50, default='', help_text='Job Assured, Certification, or Executive — matches the homepage filter pills.')
    badge = models.CharField(max_length=50, help_text='Visible badge text on the card (can differ from Program Type, e.g. "Flagship").')
    duration = models.CharField(max_length=100, blank=True)
    mode = models.CharField(max_length=100, blank=True, help_text='e.g. "Online & Offline".')
    tool = models.CharField(max_length=255, blank=True, help_text='Software/tools used, e.g. "Tally Prime + SAP FICO".')
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='modules/%Y/%m/', blank=True, null=True)
    image_alt = models.CharField(max_length=255, blank=True)
    button_text = models.CharField(max_length=100, blank=True, help_text='Defaults to "View Details" if blank.')
    button_internal_page = models.ForeignKey('pages.Page', on_delete=models.SET_NULL, null=True, blank=True, related_name='+')
    button_external_url = models.URLField(blank=True)

    class Meta(OrderedToggleModel.Meta):
        verbose_name = 'Course Card'

    def __str__(self):
        return self.title


class WhyFinprovSection(HeadingFieldsMixin, PageScopedModule):
    paragraph = models.TextField(blank=True, help_text='Not currently rendered on the homepage; reserved for future use.')

    history = HistoricalRecords()

    class Meta(PageScopedModule.Meta):
        verbose_name = 'Why Finprov Section'

    def __str__(self):
        return f'{self.page.name} — Why Finprov: {self.heading or "(untitled)"}'


class FeatureCard(OrderedToggleModel):
    why_finprov_section = models.ForeignKey(WhyFinprovSection, on_delete=models.CASCADE, related_name='feature_cards')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, help_text='Not currently rendered on the homepage; reserved for future use.')
    icon = icon_field(help_text='Not currently rendered on the homepage; reserved for future use.')
    image = models.ImageField(upload_to='modules/%Y/%m/', blank=True, null=True,
                               help_text='Not currently rendered on the homepage; reserved for future use.')

    class Meta(OrderedToggleModel.Meta):
        verbose_name = 'Feature Card'

    def __str__(self):
        return self.title


class PlacementSection(HeadingFieldsMixin, MediaFieldsMixin, LinkFieldsMixin, PageScopedModule):
    paragraph = models.TextField(blank=True)

    history = HistoricalRecords()

    class Meta(PageScopedModule.Meta):
        verbose_name = 'Placement Section'

    def __str__(self):
        return f'{self.page.name} — Placement Section: {self.heading or "(untitled)"}'


class PlacementStat(OrderedToggleModel):
    placement_section = models.ForeignKey(PlacementSection, on_delete=models.CASCADE, related_name='stats')
    label = models.CharField(max_length=255)
    value = models.CharField(max_length=100)

    class Meta(OrderedToggleModel.Meta):
        verbose_name = 'Placement Stat'

    def __str__(self):
        return f'{self.label}: {self.value}'


class CTA(HeadingFieldsMixin, MediaFieldsMixin, LinkFieldsMixin, SecondaryLinkFieldsMixin, PageScopedModule):
    paragraph = models.TextField(blank=True)

    history = HistoricalRecords()

    class Meta(PageScopedModule.Meta):
        verbose_name = 'CTA'
        verbose_name_plural = 'CTAs'

    def __str__(self):
        return f'{self.page.name} — CTA: {self.heading or "(untitled)"}'


class Testimonial(PageScopedModule):
    KIND_TEXT = 'text'
    KIND_VIDEO = 'video'
    KIND_CHOICES = [(KIND_TEXT, 'Text'), (KIND_VIDEO, 'Video')]

    name = models.CharField(max_length=255)
    program = models.CharField(max_length=255, blank=True, default='',
                                help_text='The course/program name shown under the student\'s name, e.g. "SAP FICO & ACCA".')
    company = models.CharField(max_length=255, blank=True, default='',
                                help_text='Not currently rendered on the homepage; reserved for future use.')
    designation = models.CharField(max_length=255, blank=True, default='',
                                    help_text='Not currently rendered on the homepage; reserved for future use.')
    quote = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='modules/%Y/%m/', blank=True, null=True)
    avatar_alt = models.CharField(max_length=255, blank=True)
    rating = models.PositiveSmallIntegerField(default=5, help_text='0-5')

    kind = models.CharField(max_length=10, choices=KIND_CHOICES, default=KIND_TEXT)
    video_url = models.URLField(blank=True, default='', help_text='Used when Kind is Video.')
    video_thumbnail = models.ImageField(upload_to='modules/%Y/%m/', blank=True, null=True, help_text='Used when Kind is Video.')

    history = HistoricalRecords()

    class Meta(PageScopedModule.Meta):
        verbose_name = 'Testimonial'

    def __str__(self):
        return f'{self.page.name} — Testimonial: {self.name}'


class PartnerLogo(PageScopedModule):
    KIND_PARTNER = 'partner'
    KIND_TOOL = 'tool'
    KIND_CHOICES = [(KIND_PARTNER, 'Hiring Partner'), (KIND_TOOL, 'Software Tool')]

    name = models.CharField(max_length=255)
    kind = models.CharField(max_length=10, choices=KIND_CHOICES, default=KIND_PARTNER,
                             help_text='Which marquee row this appears in. Each row renders with one fixed icon (not per-item).')
    logo = models.ImageField(upload_to='modules/%Y/%m/', blank=True, null=True,
                              help_text='Optional — the current homepage marquee shows text only, no logos.')
    logo_alt = models.CharField(max_length=255, blank=True)
    website_url = models.URLField(blank=True)

    history = HistoricalRecords()

    class Meta(PageScopedModule.Meta):
        verbose_name = 'Partner Logo'

    def __str__(self):
        return f'{self.page.name} — Partner Logo: {self.name}'


class FAQItem(PageScopedModule):
    question = models.CharField(max_length=500)
    answer = models.TextField()

    history = HistoricalRecords()

    class Meta(PageScopedModule.Meta):
        verbose_name = 'FAQ Item'
        verbose_name_plural = 'FAQ Items'

    def __str__(self):
        return f'{self.page.name} — FAQ: {self.question[:60]}'

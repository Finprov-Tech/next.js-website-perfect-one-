import nested_admin

from core.admin import image_preview
from modules.models import (
    CTA,
    Banner,
    CourseCard,
    CourseSection,
    CredentialItem,
    Credentials,
    FAQItem,
    FeatureCard,
    GalleryImage,
    HeroAnimatedWord,
    HistoryMilestone,
    HistorySection,
    LandingPageBody,
    LegalSection,
    LifeAtFinprovSection,
    PartnerLogo,
    PlacementSection,
    PlacementStat,
    Quiz,
    QuizOption,
    QuizQuestion,
    ScrollItem,
    ScrollSection,
    TeamMember,
    TeamSection,
    Testimonial,
    WhyFinprovSection,
)

"""Every page-scoped content module lives here as a nested_admin inline class
— never a standalone registered ModelAdmin. They're only ever edited as part
of a Page's single unified screen (see pages/admin.py's PAGE_INLINE_MAP).
Container modules (Banner, Credentials, CourseSection, WhyFinprovSection,
PlacementSection) declare their repeating children via `inlines = [...]`,
which nested_admin renders as real nested add/reorder/delete rows."""


class HeroAnimatedWordInline(nested_admin.NestedTabularInline):
    model = HeroAnimatedWord
    extra = 1


class BannerInline(nested_admin.NestedStackedInline):
    model = Banner
    fk_name = 'page'
    extra = 0
    max_num = 1
    readonly_fields = ('image_preview_display',)
    fieldsets = (
        ('Content', {'fields': ('heading', 'sub_heading', 'heading_level', 'paragraph', 'rich_text')}),
        ('Top Badge', {'fields': ('badge_text', 'badge_icon')}),
        ('Centres / Location Line', {'fields': ('centres_text',)}),
        ('Primary Button', {'fields': ('cta_text', 'cta_internal_page', 'cta_external_url')}),
        ('Secondary Button', {'fields': ('secondary_cta_text', 'secondary_cta_internal_page', 'secondary_cta_external_url'),
                               'description': 'If left blank, the secondary button keeps opening the enquiry modal (current behavior).'}),
        ('Top Floating Card', {'fields': ('top_card_title', 'top_card_subtitle', 'top_card_icon')}),
        ('Bottom Floating Card', {'fields': ('bottom_card_title', 'bottom_card_subtitle', 'bottom_card_icon')}),
        ('Floating Statistic', {'fields': ('floating_stat_value', 'floating_stat_label')}),
        ('Media', {'fields': ('image', 'image_preview_display', 'image_alt')}),
        ('Display Settings', {'fields': ('display_order', 'is_active')}),
    )
    inlines = [HeroAnimatedWordInline]

    def image_preview_display(self, obj):
        return image_preview(obj)
    image_preview_display.short_description = 'Image preview'


class ScrollItemInline(nested_admin.NestedTabularInline):
    model = ScrollItem
    extra = 1


class ScrollSectionInline(nested_admin.NestedStackedInline):
    model = ScrollSection
    extra = 0
    max_num = 1
    fields = ('heading', 'display_order', 'is_active')
    inlines = [ScrollItemInline]


class CredentialItemInline(nested_admin.NestedTabularInline):
    model = CredentialItem
    extra = 1


class CredentialsInline(nested_admin.NestedStackedInline):
    model = Credentials
    extra = 0
    max_num = 1
    readonly_fields = ('image_preview_display',)
    fieldsets = (
        ('Content', {'fields': ('heading', 'sub_heading', 'heading_level', 'paragraph')}),
        ('Media', {'fields': ('image', 'image_preview_display', 'image_alt')}),
        ('Display Settings', {'fields': ('display_order', 'is_active')}),
    )
    inlines = [CredentialItemInline]

    def image_preview_display(self, obj):
        return image_preview(obj)
    image_preview_display.short_description = 'Image preview'


class CourseCardInline(nested_admin.NestedTabularInline):
    model = CourseCard
    extra = 1
    fields = ('title', 'slug', 'category', 'program_type', 'badge', 'duration', 'display_order', 'is_active')


class CourseSectionInline(nested_admin.NestedStackedInline):
    model = CourseSection
    fk_name = 'page'
    extra = 0
    max_num = 1
    readonly_fields = ('image_preview_display',)
    fieldsets = (
        ('Content', {'fields': ('heading', 'sub_heading', 'heading_level', 'paragraph')}),
        ('Background Image', {'fields': ('background_image', 'image_preview_display', 'background_image_alt'),
                               'description': 'Not currently rendered on the homepage — reserved for future use.'}),
        ('Button ("Compare all programs" link)', {'fields': ('button_text', 'button_internal_page', 'button_external_url')}),
        ('Display Settings', {'fields': ('display_order', 'is_active')}),
    )
    inlines = [CourseCardInline]

    def image_preview_display(self, obj):
        return image_preview(obj, 'background_image')
    image_preview_display.short_description = 'Image preview'


class FeatureCardInline(nested_admin.NestedTabularInline):
    model = FeatureCard
    extra = 1
    fields = ('title', 'description', 'icon', 'display_order', 'is_active')


class WhyFinprovSectionInline(nested_admin.NestedStackedInline):
    model = WhyFinprovSection
    extra = 0
    max_num = 1
    fieldsets = (
        ('Content', {'fields': ('heading', 'sub_heading', 'heading_level', 'paragraph')}),
        ('Display Settings', {'fields': ('display_order', 'is_active')}),
    )
    inlines = [FeatureCardInline]


class PlacementStatInline(nested_admin.NestedTabularInline):
    model = PlacementStat
    extra = 1


class PlacementSectionInline(nested_admin.NestedStackedInline):
    model = PlacementSection
    fk_name = 'page'
    extra = 0
    max_num = 1
    readonly_fields = ('image_preview_display',)
    fieldsets = (
        ('Content', {'fields': ('heading', 'sub_heading', 'heading_level', 'paragraph')}),
        ('Call To Action', {'fields': ('cta_text', 'cta_internal_page', 'cta_external_url')}),
        ('Media', {'fields': ('image', 'image_preview_display', 'image_alt')}),
        ('Display Settings', {'fields': ('display_order', 'is_active')}),
    )
    inlines = [PlacementStatInline]

    def image_preview_display(self, obj):
        return image_preview(obj)
    image_preview_display.short_description = 'Image preview'


class CTAInline(nested_admin.NestedStackedInline):
    model = CTA
    fk_name = 'page'
    extra = 0
    max_num = 1
    readonly_fields = ('image_preview_display',)
    fieldsets = (
        ('Content', {'fields': ('heading', 'sub_heading', 'heading_level', 'paragraph')}),
        ('Primary Button', {'fields': ('cta_text', 'cta_internal_page', 'cta_external_url')}),
        ('Secondary Button', {'fields': ('secondary_cta_text', 'secondary_cta_internal_page', 'secondary_cta_external_url'),
                               'description': 'Not currently rendered — reserved for parity with the spec.'}),
        ('Media', {'fields': ('image', 'image_preview_display', 'image_alt'),
                   'description': 'Not currently rendered — reserved for future use.'}),
        ('Display Settings', {'fields': ('display_order', 'is_active')}),
    )

    def image_preview_display(self, obj):
        return image_preview(obj)
    image_preview_display.short_description = 'Image preview'


class TestimonialInline(nested_admin.NestedStackedInline):
    model = Testimonial
    extra = 0
    readonly_fields = ('avatar_preview',)
    fieldsets = (
        ('Content', {'fields': ('name', 'company', 'designation', 'quote', 'rating')}),
        ('Photo', {'fields': ('avatar', 'avatar_preview', 'avatar_alt')}),
        ('Video (only used when Kind = Video)', {'fields': ('kind', 'video_url', 'video_thumbnail')}),
        ('Display Settings', {'fields': ('display_order', 'is_active')}),
    )

    def avatar_preview(self, obj):
        return image_preview(obj, 'avatar')


class PartnerLogoInline(nested_admin.NestedTabularInline):
    model = PartnerLogo
    extra = 1
    fields = ('name', 'kind', 'logo', 'logo_alt', 'website_url', 'display_order', 'is_active')


class FAQItemInline(nested_admin.NestedTabularInline):
    model = FAQItem
    extra = 1
    fields = ('question', 'answer', 'display_order', 'is_active')


class QuizOptionInline(nested_admin.NestedTabularInline):
    model = QuizOption
    extra = 1
    fields = ('label', 'category', 'display_order', 'is_active')


class QuizQuestionInline(nested_admin.NestedStackedInline):
    model = QuizQuestion
    extra = 1
    fields = ('question_text', 'display_order', 'is_active')
    inlines = [QuizOptionInline]


class QuizInline(nested_admin.NestedStackedInline):
    model = Quiz
    fk_name = 'page'
    extra = 0
    max_num = 1
    fieldsets = (
        ('Content', {'fields': ('heading', 'description', 'next_button_text')}),
        ('Result Button', {'fields': ('cta_text', 'cta_internal_page', 'cta_external_url')}),
        ('Display Settings', {'fields': ('display_order', 'is_active')}),
    )
    inlines = [QuizQuestionInline]


class TeamMemberInline(nested_admin.NestedStackedInline):
    model = TeamMember
    extra = 1
    readonly_fields = ('photo_preview_display',)
    fieldsets = (
        ('Content', {'fields': ('name', 'role', 'category', 'experience', 'credentials', 'quote', 'bio', 'highlights')}),
        ('Photo', {'fields': ('photo', 'photo_preview_display', 'photo_alt')}),
        ('Display Settings', {'fields': ('display_order', 'is_active')}),
    )

    def photo_preview_display(self, obj):
        return image_preview(obj, 'photo')
    photo_preview_display.short_description = 'Photo preview'


class TeamSectionInline(nested_admin.NestedStackedInline):
    model = TeamSection
    extra = 0
    max_num = 1
    fieldsets = (
        ('Content', {'fields': ('heading', 'sub_heading', 'heading_level', 'paragraph')}),
        ('Display Settings', {'fields': ('display_order', 'is_active')}),
    )
    inlines = [TeamMemberInline]


class GalleryImageInline(nested_admin.NestedTabularInline):
    model = GalleryImage
    extra = 1
    fields = ('image', 'image_alt', 'caption', 'display_order', 'is_active')


class LifeAtFinprovSectionInline(nested_admin.NestedStackedInline):
    model = LifeAtFinprovSection
    extra = 0
    max_num = 1
    fieldsets = (
        ('Content', {'fields': ('heading', 'sub_heading', 'heading_level', 'paragraph')}),
        ('Display Settings', {'fields': ('display_order', 'is_active')}),
    )
    inlines = [GalleryImageInline]


class LegalSectionInline(nested_admin.NestedStackedInline):
    model = LegalSection
    extra = 1
    fieldsets = (
        ('Content', {'fields': ('title', 'body')}),
        ('Display Settings', {'fields': ('display_order', 'is_active')}),
    )


class LandingPageBodyInline(nested_admin.NestedStackedInline):
    model = LandingPageBody
    extra = 1
    fieldsets = (
        ('Content', {'fields': ('h1', 'body')}),
        ('Display Settings', {'fields': ('display_order', 'is_active')}),
    )


class HistoryMilestoneInline(nested_admin.NestedTabularInline):
    model = HistoryMilestone
    extra = 1


class HistorySectionInline(nested_admin.NestedStackedInline):
    model = HistorySection
    extra = 0
    max_num = 1
    fieldsets = (
        ('Content', {'fields': ('eyebrow', 'heading', 'sub_heading', 'heading_level')}),
        ('Display Settings', {'fields': ('display_order', 'is_active')}),
    )
    inlines = [HistoryMilestoneInline]

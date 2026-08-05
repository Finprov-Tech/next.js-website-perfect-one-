from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from core.admin import image_preview
from core.admin_site import cms_admin_site
from modules.models import (
    CTA,
    Banner,
    CourseCard,
    CourseSection,
    CredentialItem,
    Credentials,
    FAQItem,
    FeatureCard,
    HeroAnimatedWord,
    PartnerLogo,
    PlacementSection,
    PlacementStat,
    ScrollItem,
    ScrollSection,
    Testimonial,
    WhyFinprovSection,
)


class ScrollItemInline(admin.TabularInline):
    model = ScrollItem
    extra = 1


class CredentialItemInline(admin.TabularInline):
    model = CredentialItem
    extra = 1


class PlacementStatInline(admin.TabularInline):
    model = PlacementStat
    extra = 1


class HeroAnimatedWordInline(admin.TabularInline):
    model = HeroAnimatedWord
    extra = 1


class CourseCardInline(admin.TabularInline):
    model = CourseCard
    extra = 1
    fields = ('title', 'slug', 'category', 'program_type', 'badge', 'duration', 'display_order', 'is_active')
    show_change_link = True


class FeatureCardInline(admin.TabularInline):
    model = FeatureCard
    extra = 1
    fields = ('title', 'description', 'icon', 'display_order', 'is_active')


class HeadingModuleAdmin(SimpleHistoryAdmin):
    list_display = ('page', 'heading', 'heading_level', 'display_order', 'is_active', 'updated_at')
    list_filter = ('page', 'is_active', 'heading_level')
    list_editable = ('display_order', 'is_active')
    search_fields = ('heading', 'sub_heading', 'page__name')
    readonly_fields = ('created_at', 'updated_at', 'image_preview_display')
    autocomplete_fields = ('page',)

    def image_preview_display(self, obj):
        return image_preview(obj)

    image_preview_display.short_description = 'Image preview'


@admin.register(Banner, site=cms_admin_site)
class BannerAdmin(HeadingModuleAdmin):
    fieldsets = (
        ('Page', {'fields': ('page',)}),
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
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    inlines = [HeroAnimatedWordInline]


@admin.register(ScrollSection, site=cms_admin_site)
class ScrollSectionAdmin(SimpleHistoryAdmin):
    list_display = ('page', 'heading', 'display_order', 'is_active', 'updated_at')
    list_filter = ('page', 'is_active')
    list_editable = ('display_order', 'is_active')
    search_fields = ('heading', 'page__name')
    readonly_fields = ('created_at', 'updated_at')
    autocomplete_fields = ('page',)
    inlines = [ScrollItemInline]


@admin.register(Credentials, site=cms_admin_site)
class CredentialsAdmin(HeadingModuleAdmin):
    fieldsets = (
        ('Page', {'fields': ('page',)}),
        ('Content', {'fields': ('heading', 'sub_heading', 'heading_level', 'paragraph')}),
        ('Media', {'fields': ('image', 'image_preview_display', 'image_alt')}),
        ('Display Settings', {'fields': ('display_order', 'is_active')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    inlines = [CredentialItemInline]


@admin.register(CourseSection, site=cms_admin_site)
class CourseSectionAdmin(HeadingModuleAdmin):
    fieldsets = (
        ('Page', {'fields': ('page',)}),
        ('Content', {'fields': ('heading', 'sub_heading', 'heading_level', 'paragraph')}),
        ('Background Image', {'fields': ('background_image', 'image_preview_display', 'background_image_alt'),
                               'description': 'Not currently rendered on the homepage — reserved for future use.'}),
        ('Button ("Compare all programs" link)', {'fields': ('button_text', 'button_internal_page', 'button_external_url')}),
        ('Display Settings', {'fields': ('display_order', 'is_active')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )

    def image_preview_display(self, obj):
        return image_preview(obj, 'background_image')

    inlines = [CourseCardInline]


@admin.register(CourseCard, site=cms_admin_site)
class CourseCardAdmin(admin.ModelAdmin):
    list_display = ('title', 'course_section', 'category', 'program_type', 'badge', 'display_order', 'is_active', 'thumb')
    list_filter = ('course_section', 'category', 'program_type', 'is_active')
    list_editable = ('display_order', 'is_active')
    search_fields = ('title', 'slug', 'description')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('thumb',)
    autocomplete_fields = ('course_section', 'button_internal_page')

    def thumb(self, obj):
        return image_preview(obj)


@admin.register(WhyFinprovSection, site=cms_admin_site)
class WhyFinprovSectionAdmin(HeadingModuleAdmin):
    fieldsets = (
        ('Page', {'fields': ('page',)}),
        ('Content', {'fields': ('heading', 'sub_heading', 'heading_level', 'paragraph')}),
        ('Display Settings', {'fields': ('display_order', 'is_active')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    inlines = [FeatureCardInline]

    def image_preview_display(self, obj):
        return '(no image field on this model)'


@admin.register(FeatureCard, site=cms_admin_site)
class FeatureCardAdmin(admin.ModelAdmin):
    list_display = ('title', 'why_finprov_section', 'icon', 'display_order', 'is_active', 'thumb')
    list_filter = ('why_finprov_section', 'is_active')
    list_editable = ('display_order', 'is_active')
    search_fields = ('title', 'description')
    readonly_fields = ('thumb',)
    autocomplete_fields = ('why_finprov_section',)

    def thumb(self, obj):
        return image_preview(obj)


@admin.register(PlacementSection, site=cms_admin_site)
class PlacementSectionAdmin(HeadingModuleAdmin):
    fieldsets = (
        ('Page', {'fields': ('page',)}),
        ('Content', {'fields': ('heading', 'sub_heading', 'heading_level', 'paragraph')}),
        ('Call To Action', {'fields': ('cta_text', 'cta_internal_page', 'cta_external_url')}),
        ('Media', {'fields': ('image', 'image_preview_display', 'image_alt')}),
        ('Display Settings', {'fields': ('display_order', 'is_active')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
    inlines = [PlacementStatInline]


@admin.register(CTA, site=cms_admin_site)
class CTAAdmin(HeadingModuleAdmin):
    fieldsets = (
        ('Page', {'fields': ('page',)}),
        ('Content', {'fields': ('heading', 'sub_heading', 'heading_level', 'paragraph')}),
        ('Primary Button', {'fields': ('cta_text', 'cta_internal_page', 'cta_external_url')}),
        ('Secondary Button', {'fields': ('secondary_cta_text', 'secondary_cta_internal_page', 'secondary_cta_external_url'),
                               'description': 'Not currently rendered — reserved for parity with the spec.'}),
        ('Media', {'fields': ('image', 'image_preview_display', 'image_alt'),
                   'description': 'Not currently rendered — reserved for future use.'}),
        ('Display Settings', {'fields': ('display_order', 'is_active')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )


@admin.register(Testimonial, site=cms_admin_site)
class TestimonialAdmin(SimpleHistoryAdmin):
    list_display = ('page', 'name', 'company', 'kind', 'rating', 'display_order', 'is_active', 'avatar_preview')
    list_filter = ('page', 'is_active', 'kind', 'rating')
    list_editable = ('display_order', 'is_active')
    search_fields = ('name', 'company', 'designation', 'quote', 'page__name')
    readonly_fields = ('created_at', 'updated_at', 'avatar_preview')
    autocomplete_fields = ('page',)
    fieldsets = (
        ('Page', {'fields': ('page',)}),
        ('Content', {'fields': ('name', 'company', 'designation', 'quote', 'rating')}),
        ('Photo', {'fields': ('avatar', 'avatar_preview', 'avatar_alt')}),
        ('Video (only used when Kind = Video)', {'fields': ('kind', 'video_url', 'video_thumbnail')}),
        ('Display Settings', {'fields': ('display_order', 'is_active')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )

    def avatar_preview(self, obj):
        return image_preview(obj, 'avatar')


@admin.register(PartnerLogo, site=cms_admin_site)
class PartnerLogoAdmin(SimpleHistoryAdmin):
    list_display = ('page', 'name', 'kind', 'website_url', 'display_order', 'is_active', 'logo_preview')
    list_filter = ('page', 'kind', 'is_active')
    list_editable = ('display_order', 'is_active')
    search_fields = ('name', 'page__name')
    readonly_fields = ('created_at', 'updated_at', 'logo_preview')
    autocomplete_fields = ('page',)

    def logo_preview(self, obj):
        return image_preview(obj, 'logo')


@admin.register(FAQItem, site=cms_admin_site)
class FAQItemAdmin(SimpleHistoryAdmin):
    list_display = ('page', 'question', 'display_order', 'is_active')
    list_filter = ('page', 'is_active')
    list_editable = ('display_order', 'is_active')
    search_fields = ('question', 'answer', 'page__name')
    readonly_fields = ('created_at', 'updated_at')
    autocomplete_fields = ('page',)

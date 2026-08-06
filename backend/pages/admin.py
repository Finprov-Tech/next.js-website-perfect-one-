import nested_admin
from django.contrib import admin, messages
from simple_history.admin import SimpleHistoryAdmin

from core.admin import alt_text_warnings_for
from core.admin_site import cms_admin_site
from modules.admin import (
    CredentialsInline,
    CourseSectionInline,
    CTAInline,
    BannerInline,
    FAQItemInline,
    LegalSectionInline,
    LifeAtFinprovSectionInline,
    PartnerLogoInline,
    PlacementSectionInline,
    QuizInline,
    ScrollSectionInline,
    TeamSectionInline,
    TestimonialInline,
    WhyFinprovSectionInline,
)
from pages.models import Page, PageType
from seo.admin import SEOMetaInline
from seo.models import SEOMeta


@admin.register(PageType, site=cms_admin_site)
class PageTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at',)


# Which content-module inlines each page shows, in display order (SEO is
# always prepended first below). Keyed by Page.slug. A page not yet in this
# map (not yet migrated onto the CMS) gets DEFAULT_PAGE_INLINES so it works
# reasonably from day one — add a real entry here once that page is migrated.
PAGE_INLINE_MAP = {
    'home': [
        BannerInline, ScrollSectionInline, CredentialsInline, CourseSectionInline, QuizInline,
        PlacementSectionInline, TestimonialInline, CTAInline, PartnerLogoInline, TeamSectionInline,
        WhyFinprovSectionInline, LifeAtFinprovSectionInline, FAQItemInline,
    ],
    'about': [BannerInline, CredentialsInline, WhyFinprovSectionInline, CTAInline],
    'courses': [BannerInline],
    'placement': [PlacementSectionInline, TestimonialInline, PartnerLogoInline],
    'business': [BannerInline, WhyFinprovSectionInline, CTAInline, FAQItemInline],
    'blog': [BannerInline, CTAInline],
    'contact': [BannerInline, FAQItemInline],
    'admission': [BannerInline],
    'career': [BannerInline, WhyFinprovSectionInline, CTAInline],
    'team': [BannerInline, CredentialsInline, TeamSectionInline, CTAInline],
    'testimonials': [BannerInline, TestimonialInline],
    'events': [BannerInline],
    'faq': [BannerInline, FAQItemInline],
    'verify-student-certificate': [BannerInline],
    'privacy-policy': [BannerInline, LegalSectionInline],
    'terms-and-conditions': [BannerInline, LegalSectionInline],
}
DEFAULT_PAGE_INLINES = [BannerInline, CTAInline, FAQItemInline]


@admin.register(Page, site=cms_admin_site)
class PageAdmin(SimpleHistoryAdmin, nested_admin.NestedModelAdmin):
    list_display = ('name', 'slug', 'page_type', 'status', 'is_homepage', 'module_count', 'updated_at')
    list_filter = ('page_type', 'status', 'is_homepage')
    list_editable = ('status',)
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {'fields': ('name', 'slug', 'page_type', 'is_homepage', 'status')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )

    MODULE_RELATED_NAMES = (
        'banner_set', 'scrollsection_set', 'credentials_set', 'coursesection_set',
        'whyfinprovsection_set', 'placementsection_set',
        'cta_set', 'testimonial_set', 'partnerlogo_set', 'faqitem_set',
        'quiz_set', 'teamsection_set', 'lifeatfinprovsection_set', 'legalsection_set',
    )

    @admin.display(description='Modules')
    def module_count(self, obj):
        return sum(getattr(obj, name).count() for name in self.MODULE_RELATED_NAMES)

    def get_inlines(self, request, obj):
        # Add-page screen: no saved Page yet for content inlines to attach to.
        if obj is None:
            return [SEOMetaInline]
        return [SEOMetaInline, *PAGE_INLINE_MAP.get(obj.slug, DEFAULT_PAGE_INLINES)]

    def save_formset(self, request, form, formset, change):
        super().save_formset(request, form, formset, change)
        if formset.model is SEOMeta:
            for inline_form in formset.forms:
                for warning in getattr(inline_form.instance, '_seo_warnings', None) or []:
                    messages.warning(request, warning)
            return
        for inline_form in formset.forms:
            instance = inline_form.instance
            if not instance.pk:
                continue
            for warning in alt_text_warnings_for(instance):
                messages.warning(request, warning)

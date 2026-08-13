"""Writable serializers for the SEO panel.

Every serializer here exposes a deliberately small subset of its model's
fields — copy and links only. No image/icon fields, no `display_order`/
`is_active`, no `heading_level`, no FK page-picker fields, and `page` itself
is never writable (so a module can't be reassigned to a different page).
This mirrors the field allowlist agreed for the SEO panel; see
C:\\Users\\FINPROV\\.claude\\plans\\glittery-gliding-honey.md for the source
of truth if a field's inclusion/exclusion is ever in question.

`*_external_url` fields are declared as plain CharField (not the model's
URLField) so a relative internal path like "/courses/tally-prime" is
accepted — matches how the public frontend's resolveCmsLink() already
consumes these values verbatim.
"""
import bleach
import os
from django.apps import apps
from django.db import transaction
from rest_framework import serializers

from core.models import HeadingFieldsMixin
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
from pages.models import Page, PageType
from blog.models import Author, BlogCategory, BlogPost, BlogPostSection
from seo.models import Redirect, SEOMeta
from courses.models import (
    Course, CourseAlias, CourseAudience, CourseCareerProspect, CourseCategory, CourseCertification,
    CourseCurriculumModule, CourseCurriculumTopic, CourseFAQ, CourseHighlight, CourseHiringPartner,
    CourseJobOpportunity, CourseProgramType, CourseReviewIssue, CourseSkill, CourseTool,
)
from courses.review import resolve_review_issue


def plain_url_field():
    """A link field that accepts a relative path or a full URL, unlike the
    model's own URLField which requires a scheme."""
    return serializers.CharField(required=False, allow_blank=True, max_length=200)


MAX_EDITORIAL_IMAGE_BYTES = 8 * 1024 * 1024
ALLOWED_EDITORIAL_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'}


class EditorialMediaSerializerMixin:
    """Shared validation for every image editable through the SEO panel."""

    def validate(self, attrs):
        attrs = super().validate(attrs)
        for field in self.Meta.model._meta.fields:
            if field.get_internal_type() != 'ImageField' or field.name not in attrs:
                continue
            upload = attrs[field.name]
            if upload in (None, ''):
                continue
            ext = os.path.splitext(upload.name)[1].lower()
            if ext not in ALLOWED_EDITORIAL_IMAGE_EXTENSIONS:
                raise serializers.ValidationError({field.name: f'Unsupported image type "{ext}".'})
            if upload.size > MAX_EDITORIAL_IMAGE_BYTES:
                raise serializers.ValidationError({field.name: 'Image must be 8 MB or smaller.'})
        return attrs


class EffectiveLinkSerializerMixin:
    """Show existing internal links as editable paths in the panel.

    Saving that path intentionally switches the record to the external/path
    representation, which the public resolver already prioritizes.
    """

    link_pairs = (('cta_internal_page', 'cta_external_url'),)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        for internal_name, external_name in self.link_pairs:
            internal = getattr(instance, internal_name, None)
            if not data.get(external_name) and internal is not None:
                data[external_name] = f'/{internal.slug}'
        return data

    def update(self, instance, validated_data):
        for internal_name, external_name in self.link_pairs:
            if external_name in validated_data:
                setattr(instance, internal_name, None)
        return super().update(instance, validated_data)


ORDER_FIELDS = ['display_order', 'is_active']


# Every text/rich field that can hold real body copy for a page, keyed by
# the related_name used from Page — same set promoted to rich text in
# api/serializers.py. Used by count_page_words() below.
_WORD_COUNT_SOURCES = [
    ('banner_set', ['paragraph', 'rich_text']),
    ('credentials_set', ['paragraph']),
    ('coursesection_set', ['paragraph']),
    ('whyfinprovsection_set', ['paragraph']),
    ('placementsection_set', ['paragraph']),
    ('cta_set', ['paragraph']),
    ('teamsection_set', ['paragraph']),
    ('lifeatfinprovsection_set', ['paragraph']),
    ('testimonial_set', ['quote']),
    ('faqitem_set', ['answer']),
    ('legalsection_set', ['body']),
    ('landingpagebody_set', ['body']),
]


def _plain_text_word_count(html):
    if not html:
        return 0
    text = bleach.clean(html, tags=[], strip=True)
    return len(text.split())


def count_page_words(page):
    """Word count across a page's own body copy — every rich/long-form
    field, HTML stripped first. TeamMember.bio (nested under TeamSection)
    is included separately since it isn't a direct Page relation."""
    total = 0
    for related_name, field_names in _WORD_COUNT_SOURCES:
        for instance in getattr(page, related_name).filter(is_active=True):
            for field_name in field_names:
                total += _plain_text_word_count(getattr(instance, field_name, ''))

    for team_section in page.teamsection_set.filter(is_active=True):
        for member in team_section.members.filter(is_active=True):
            total += _plain_text_word_count(member.bio)

    return total


def count_blog_post_words(post):
    """Same idea as count_page_words but for a BlogPost's own sections
    (its actual body copy — title/excerpt aren't counted, same convention
    as pages not counting their own heading text)."""
    total = 0
    for section in post.sections.filter(is_active=True):
        total += _plain_text_word_count(section.body)
    return total


def page_has_h1(page):
    """Same check as the old admin's SEOMetaInline.h1_status (seo/admin.py):
    does any HeadingFieldsMixin module on this page have heading_level='h1'?"""
    for model in apps.get_models():
        if issubclass(model, HeadingFieldsMixin) and hasattr(model, 'page'):
            if model.objects.filter(page_id=page.id, heading_level='h1', is_active=True).exists():
                return True
    return False


class BannerSEOPanelSerializer(EffectiveLinkSerializerMixin, EditorialMediaSerializerMixin, serializers.ModelSerializer):
    link_pairs = (('cta_internal_page', 'cta_external_url'), ('secondary_cta_internal_page', 'secondary_cta_external_url'))
    cta_external_url = plain_url_field()
    secondary_cta_external_url = plain_url_field()

    class Meta:
        model = Banner
        fields = [
            'id', 'heading', 'sub_heading', 'paragraph', 'rich_text',
            'badge_text', 'centres_text',
            'cta_text', 'cta_external_url',
            'secondary_cta_text', 'secondary_cta_external_url',
            'top_card_title', 'top_card_subtitle',
            'bottom_card_title', 'bottom_card_subtitle',
            'floating_stat_value', 'floating_stat_label',
            'image', 'image_alt', 'cta_internal_page', 'secondary_cta_internal_page',
            *ORDER_FIELDS,
        ]


class CredentialsSEOPanelSerializer(EditorialMediaSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = Credentials
        fields = ['id', 'heading', 'sub_heading', 'paragraph', 'image', 'image_alt', *ORDER_FIELDS]


class CredentialItemSEOPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CredentialItem
        fields = ['id', 'title', 'value', 'credentials', 'icon', *ORDER_FIELDS]
        extra_kwargs = {'credentials': {'write_only': True}}


class ScrollItemSEOPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScrollItem
        fields = ['id', 'text', 'scroll_section', 'icon', *ORDER_FIELDS]
        extra_kwargs = {'scroll_section': {'write_only': True}}


class ScrollSectionSEOPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScrollSection
        fields = ['id', 'heading', *ORDER_FIELDS]


class CourseSectionSEOPanelSerializer(EffectiveLinkSerializerMixin, EditorialMediaSerializerMixin, serializers.ModelSerializer):
    link_pairs = (('button_internal_page', 'button_external_url'),)
    button_external_url = plain_url_field()

    class Meta:
        model = CourseSection
        fields = ['id', 'heading', 'sub_heading', 'paragraph', 'background_image', 'background_image_alt',
                  'button_text', 'button_internal_page', 'button_external_url', *ORDER_FIELDS]


class CourseCardSEOPanelSerializer(EffectiveLinkSerializerMixin, EditorialMediaSerializerMixin, serializers.ModelSerializer):
    link_pairs = (('button_internal_page', 'button_external_url'),)
    button_external_url = plain_url_field()

    class Meta:
        model = CourseCard
        fields = [
            'id', 'title', 'category', 'program_type', 'badge', 'duration', 'mode', 'tool',
            'description', 'image', 'image_alt', 'button_text', 'button_internal_page', 'button_external_url',
            'course_section', 'slug', *ORDER_FIELDS,
        ]
        extra_kwargs = {'course_section': {'write_only': True}}


class WhyFinprovSectionSEOPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhyFinprovSection
        fields = ['id', 'heading', 'sub_heading', 'paragraph', *ORDER_FIELDS]


class FeatureCardSEOPanelSerializer(EditorialMediaSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = FeatureCard
        fields = ['id', 'title', 'description', 'icon', 'image', 'image_alt', 'why_finprov_section', *ORDER_FIELDS]
        extra_kwargs = {'why_finprov_section': {'write_only': True}}


class PlacementSectionSEOPanelSerializer(EffectiveLinkSerializerMixin, EditorialMediaSerializerMixin, serializers.ModelSerializer):
    cta_external_url = plain_url_field()

    class Meta:
        model = PlacementSection
        fields = ['id', 'heading', 'sub_heading', 'paragraph', 'image', 'image_alt',
                  'cta_text', 'cta_internal_page', 'cta_external_url', *ORDER_FIELDS]


class PlacementStatSEOPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlacementStat
        fields = ['id', 'label', 'value', 'placement_section', *ORDER_FIELDS]
        extra_kwargs = {'placement_section': {'write_only': True}}


class CTASEOPanelSerializer(EffectiveLinkSerializerMixin, EditorialMediaSerializerMixin, serializers.ModelSerializer):
    link_pairs = (('cta_internal_page', 'cta_external_url'), ('secondary_cta_internal_page', 'secondary_cta_external_url'))
    cta_external_url = plain_url_field()
    secondary_cta_external_url = plain_url_field()

    class Meta:
        model = CTA
        fields = [
            'id', 'heading', 'sub_heading', 'paragraph',
            'cta_text', 'cta_external_url',
            'secondary_cta_text', 'secondary_cta_external_url',
            'image', 'image_alt', 'cta_internal_page', 'secondary_cta_internal_page', *ORDER_FIELDS,
        ]


class TestimonialSEOPanelSerializer(EditorialMediaSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ['id', 'page', 'name', 'program', 'company', 'designation', 'quote', 'rating', 'kind',
                  'avatar', 'avatar_alt', 'video_url', 'video_thumbnail', 'video_thumbnail_alt', *ORDER_FIELDS]
        extra_kwargs = {'page': {'write_only': True}}


class PartnerLogoSEOPanelSerializer(EditorialMediaSerializerMixin, serializers.ModelSerializer):
    website_url = plain_url_field()

    class Meta:
        model = PartnerLogo
        fields = ['id', 'page', 'name', 'kind', 'logo', 'logo_alt', 'website_url', *ORDER_FIELDS]
        extra_kwargs = {'page': {'write_only': True}}


class FAQItemSEOPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQItem
        fields = ['id', 'page', 'question', 'answer', *ORDER_FIELDS]
        extra_kwargs = {'page': {'write_only': True}}


class QuizSEOPanelSerializer(EffectiveLinkSerializerMixin, serializers.ModelSerializer):
    cta_external_url = plain_url_field()

    class Meta:
        model = Quiz
        fields = ['id', 'heading', 'description', 'next_button_text', 'cta_text', 'cta_internal_page',
                  'cta_external_url', *ORDER_FIELDS]


class QuizQuestionSEOPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizQuestion
        fields = ['id', 'question_text', 'quiz', *ORDER_FIELDS]
        extra_kwargs = {'quiz': {'write_only': True}}


class QuizOptionSEOPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizOption
        fields = ['id', 'label', 'category', 'question', *ORDER_FIELDS]
        extra_kwargs = {'question': {'write_only': True}}


class TeamSectionSEOPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamSection
        fields = ['id', 'heading', 'sub_heading', 'paragraph', *ORDER_FIELDS]


class TeamMemberSEOPanelSerializer(EditorialMediaSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ['id', 'name', 'role', 'category', 'experience', 'credentials', 'quote', 'photo', 'photo_alt',
                  'bio', 'highlights', 'team_section', *ORDER_FIELDS]
        extra_kwargs = {'team_section': {'write_only': True}}


class LifeAtFinprovSectionSEOPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = LifeAtFinprovSection
        fields = ['id', 'heading', 'sub_heading', 'paragraph', *ORDER_FIELDS]


class GalleryImageSEOPanelSerializer(EditorialMediaSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = ['id', 'caption', 'image', 'image_alt', 'section', *ORDER_FIELDS]
        extra_kwargs = {'section': {'write_only': True}}


class LegalSectionSEOPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = LegalSection
        fields = ['id', 'page', 'title', 'body', *ORDER_FIELDS]
        extra_kwargs = {'page': {'write_only': True}}


class LandingPageBodySEOPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = LandingPageBody
        fields = ['id', 'h1', 'body', *ORDER_FIELDS]


class HistoryMilestoneSEOPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoryMilestone
        fields = ['id', 'year_label', 'title', 'description', 'section', *ORDER_FIELDS]
        extra_kwargs = {'section': {'write_only': True}}


class HistorySectionSEOPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorySection
        fields = ['id', 'eyebrow', 'heading', 'sub_heading', *ORDER_FIELDS]


# SEO fields exposed, per the reviewed spec (+ Round 2 additions: og_url,
# include_in_sitemap, og_image_alt, plus the read-only computed fields
# below). og_image/og_image_alt are the deliberate image-field exception —
# an SEO artifact, not page design. custom_schema_json and the blog-only
# author_* fields stay admin-only.
class SEOMetaSEOPanelSerializer(serializers.ModelSerializer):
    canonical_url = plain_url_field()
    og_url = plain_url_field()
    word_count = serializers.SerializerMethodField()
    warnings = serializers.SerializerMethodField()

    class Meta:
        model = SEOMeta
        fields = [
            'id', 'seo_title', 'meta_description', 'focus_keyword', 'canonical_url', 'meta_robots',
            'og_title', 'og_description', 'og_image', 'og_image_alt', 'og_url', 'schema_type',
            'include_in_sitemap', 'word_count', 'warnings',
        ]
        # word_count/warnings are SerializerMethodFields — already
        # inherently read-only; DRF asserts if they're also listed here.

    def get_word_count(self, obj):
        if obj.page_id:
            return count_page_words(obj.page)
        if obj.blog_post_id:
            return count_blog_post_words(obj.blog_post)
        return 0

    def get_warnings(self, obj):
        """Ported from the old admin's SEOMetaAdminForm.clean() (duplicate
        focus keyword) and SEOMetaInline.h1_status (seo/admin.py) — same
        checks, surfaced here instead of Django messages."""
        warnings = []

        if obj.focus_keyword:
            dupes = SEOMeta.objects.filter(focus_keyword__iexact=obj.focus_keyword).exclude(pk=obj.pk)
            dupe_names = list(dupes.select_related('page').values_list('page__name', flat=True))
            dupe_names += list(dupes.select_related('blog_post').values_list('blog_post__title', flat=True))
            dupe_names = [n for n in dupe_names if n]
            if dupe_names:
                warnings.append(
                    f"Focus keyword \"{obj.focus_keyword}\" is also used on: {', '.join(dupe_names)}."
                )

        if obj.canonical_url:
            url_dupes = SEOMeta.objects.filter(canonical_url=obj.canonical_url).exclude(pk=obj.pk)
            url_dupe_names = list(url_dupes.select_related('page').values_list('page__name', flat=True))
            url_dupe_names += list(url_dupes.select_related('blog_post').values_list('blog_post__title', flat=True))
            url_dupe_names = [n for n in url_dupe_names if n]
            if url_dupe_names:
                warnings.append(
                    f"Canonical URL \"{obj.canonical_url}\" is also set on: {', '.join(url_dupe_names)}. "
                    'Two pages claiming the same canonical URL confuses search engines about which one to rank.'
                )

        if not obj.og_title:
            warnings.append('No OpenGraph title set — social shares will fall back to the SEO title, which may get truncated differently.')

        if obj.page_id and not page_has_h1(obj.page):
            warnings.append('No module on this page has its heading set to H1.')

        return warnings


class RedirectSEOPanelSerializer(serializers.ModelSerializer):
    """Full CRUD, unlike every other serializer in this module — redirects
    are their own top-level SEO tool, not page content. `old_path`'s
    uniqueness is enforced automatically by ModelSerializer from the
    model's `unique=True`."""

    chain_warning = serializers.SerializerMethodField()

    class Meta:
        model = Redirect
        fields = ['id', 'old_path', 'new_path', 'redirect_type', 'is_active', 'created_at', 'chain_warning']
        read_only_fields = ['created_at']

    def get_chain_warning(self, obj):
        # Same check as RedirectAdmin.chain_warning in seo/admin.py: a
        # redirect whose new_path is itself another redirect's old_path.
        if not obj.pk:
            return False
        return Redirect.objects.filter(old_path=obj.new_path).exclude(pk=obj.pk).exists()


class PageTypeSEOPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageType
        fields = ['name', 'slug']


class PageListSEOPanelSerializer(serializers.ModelSerializer):
    """Read-only — structural fields stay locked, edited only via /admin/."""

    page_type = PageTypeSEOPanelSerializer(read_only=True)
    live_url = serializers.SerializerMethodField()
    seo_title = serializers.SerializerMethodField()
    meta_description = serializers.SerializerMethodField()
    focus_keyword = serializers.SerializerMethodField()

    class Meta:
        model = Page
        fields = [
            'id', 'name', 'slug', 'page_type', 'status', 'updated_at', 'live_url',
            'seo_title', 'meta_description', 'focus_keyword',
        ]

    def get_live_url(self, obj):
        from seo_panel.utils import frontend_url_for
        return frontend_url_for(obj.slug)

    def _seo(self, obj):
        return getattr(obj, 'seo', None)

    def get_seo_title(self, obj):
        seo = self._seo(obj)
        return seo.seo_title if seo else ''

    def get_meta_description(self, obj):
        seo = self._seo(obj)
        return seo.meta_description if seo else ''

    def get_focus_keyword(self, obj):
        seo = self._seo(obj)
        return seo.focus_keyword if seo else ''


class PageDetailSEOPanelSerializer(serializers.ModelSerializer):
    """Everything the page-editor screen needs to render in one call: the
    page's structural info (read-only), its SEOMeta, and every content
    module it has — each key is null/empty if that page doesn't have that
    module, so the frontend renders cards only for what's actually present
    (same 'first active row' / 'active rows' convention as the public
    api.serializers.PageDetailSerializer, mirrored here with the SEO-panel
    restricted serializers instead of the public ones)."""

    page_type = PageTypeSEOPanelSerializer(read_only=True)
    live_url = serializers.SerializerMethodField()
    seo = serializers.SerializerMethodField()
    banner = serializers.SerializerMethodField()
    scroll_section = serializers.SerializerMethodField()
    credentials = serializers.SerializerMethodField()
    courses = serializers.SerializerMethodField()
    why_finprov = serializers.SerializerMethodField()
    placements = serializers.SerializerMethodField()
    cta = serializers.SerializerMethodField()
    testimonials = serializers.SerializerMethodField()
    partner_logos = serializers.SerializerMethodField()
    faq = serializers.SerializerMethodField()
    quiz = serializers.SerializerMethodField()
    team = serializers.SerializerMethodField()
    life_at_finprov = serializers.SerializerMethodField()
    legal_sections = serializers.SerializerMethodField()
    landing_page = serializers.SerializerMethodField()
    history = serializers.SerializerMethodField()

    class Meta:
        model = Page
        fields = [
            'id', 'name', 'slug', 'page_type', 'status', 'updated_at', 'live_url',
            'seo', 'banner', 'scroll_section', 'credentials', 'courses', 'why_finprov', 'placements',
            'cta', 'testimonials', 'partner_logos', 'faq', 'quiz', 'team',
            'life_at_finprov', 'legal_sections', 'landing_page', 'history',
        ]

    def get_live_url(self, obj):
        from seo_panel.utils import frontend_url_for
        return frontend_url_for(obj.slug)

    def get_seo(self, obj):
        seo = getattr(obj, 'seo', None)
        if seo is None:
            return None
        return SEOMetaSEOPanelSerializer(seo, context=self.context).data

    def _active(self, related_manager):
        # The editor must also receive inactive rows so they can be restored.
        # Public serializers continue to filter them out.
        return related_manager.all().order_by('display_order')

    def _first_active(self, related_manager, serializer_cls):
        obj = self._active(related_manager).first()
        if obj is None:
            return None
        return serializer_cls(obj, context=self.context).data

    def get_banner(self, obj):
        return self._first_active(obj.banner_set, BannerSEOPanelSerializer)

    def get_scroll_section(self, obj):
        section = self._active(obj.scrollsection_set).first()
        if section is None:
            return None
        data = ScrollSectionSEOPanelSerializer(section, context=self.context).data
        data['items'] = ScrollItemSEOPanelSerializer(
            self._active(section.items), many=True, context=self.context
        ).data
        return data

    def get_credentials(self, obj):
        section = self._active(obj.credentials_set).first()
        if section is None:
            return None
        data = CredentialsSEOPanelSerializer(section, context=self.context).data
        data['items'] = CredentialItemSEOPanelSerializer(
            self._active(section.items), many=True, context=self.context
        ).data
        return data

    def get_courses(self, obj):
        section = self._active(obj.coursesection_set).first()
        if section is None:
            return None
        data = CourseSectionSEOPanelSerializer(section, context=self.context).data
        data['cards'] = CourseCardSEOPanelSerializer(
            self._active(section.cards), many=True, context=self.context
        ).data
        return data

    def get_why_finprov(self, obj):
        section = self._active(obj.whyfinprovsection_set).first()
        if section is None:
            return None
        data = WhyFinprovSectionSEOPanelSerializer(section, context=self.context).data
        data['feature_cards'] = FeatureCardSEOPanelSerializer(
            self._active(section.feature_cards), many=True, context=self.context
        ).data
        return data

    def get_placements(self, obj):
        section = self._active(obj.placementsection_set).first()
        if section is None:
            return None
        data = PlacementSectionSEOPanelSerializer(section, context=self.context).data
        data['stats'] = PlacementStatSEOPanelSerializer(
            self._active(section.stats), many=True, context=self.context
        ).data
        return data

    def get_cta(self, obj):
        return self._first_active(obj.cta_set, CTASEOPanelSerializer)

    def get_testimonials(self, obj):
        return TestimonialSEOPanelSerializer(self._active(obj.testimonial_set), many=True, context=self.context).data

    def get_partner_logos(self, obj):
        return PartnerLogoSEOPanelSerializer(self._active(obj.partnerlogo_set), many=True, context=self.context).data

    def get_faq(self, obj):
        return FAQItemSEOPanelSerializer(self._active(obj.faqitem_set), many=True, context=self.context).data

    def get_quiz(self, obj):
        quiz = self._active(obj.quiz_set).first()
        if quiz is None:
            return None
        data = QuizSEOPanelSerializer(quiz, context=self.context).data
        questions = []
        for question in self._active(quiz.questions):
            q_data = QuizQuestionSEOPanelSerializer(question, context=self.context).data
            q_data['options'] = QuizOptionSEOPanelSerializer(
                self._active(question.options), many=True, context=self.context
            ).data
            questions.append(q_data)
        data['questions'] = questions
        return data

    def get_team(self, obj):
        section = self._active(obj.teamsection_set).first()
        if section is None:
            return None
        data = TeamSectionSEOPanelSerializer(section, context=self.context).data
        data['members'] = TeamMemberSEOPanelSerializer(
            self._active(section.members), many=True, context=self.context
        ).data
        return data

    def get_life_at_finprov(self, obj):
        section = self._active(obj.lifeatfinprovsection_set).first()
        if section is None:
            return None
        data = LifeAtFinprovSectionSEOPanelSerializer(section, context=self.context).data
        data['images'] = GalleryImageSEOPanelSerializer(
            self._active(section.images), many=True, context=self.context
        ).data
        return data

    def get_legal_sections(self, obj):
        return LegalSectionSEOPanelSerializer(self._active(obj.legalsection_set), many=True, context=self.context).data

    def get_landing_page(self, obj):
        return self._first_active(obj.landingpagebody_set, LandingPageBodySEOPanelSerializer)

    def get_history(self, obj):
        section = self._active(obj.historysection_set).first()
        if section is None:
            return None
        data = HistorySectionSEOPanelSerializer(section, context=self.context).data
        data['milestones'] = HistoryMilestoneSEOPanelSerializer(
            self._active(section.milestones), many=True, context=self.context
        ).data
        return data


# --- Blog posts ------------------------------------------------------------
# Unlike every module serializer above, blog posts get real create/delete —
# they're the SEO team's own authored content (like Redirects), not existing
# page structure. `post`/`category` FKs are writable for the same reason.

class BlogCategorySEOPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = ['id', 'name', 'slug']
        read_only_fields = ['slug']


class AuthorSEOPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'name', 'role', 'bio', 'photo', 'photo_alt']


class BlogPostSectionSEOPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPostSection
        fields = ['id', 'post', 'heading', 'body']


class BlogPostListSEOPanelSerializer(serializers.ModelSerializer):
    """Read-only list shape — mirrors PageListSEOPanelSerializer's convention
    (computed SEO-completeness fields for the 'missing SEO' filter)."""

    category_name = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    live_url = serializers.SerializerMethodField()
    seo_title = serializers.SerializerMethodField()
    meta_description = serializers.SerializerMethodField()
    focus_keyword = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'category_name', 'author_name', 'status', 'is_featured',
            'published_date', 'updated_at', 'live_url',
            'seo_title', 'meta_description', 'focus_keyword',
        ]

    def get_category_name(self, obj):
        return obj.category.name if obj.category_id else ''

    def get_author_name(self, obj):
        return obj.author.name if obj.author_id else ''

    def get_live_url(self, obj):
        from seo_panel.utils import frontend_url_for_blog_post
        return frontend_url_for_blog_post(obj.slug)

    def _seo(self, obj):
        return getattr(obj, 'seo', None)

    def get_seo_title(self, obj):
        seo = self._seo(obj)
        return seo.seo_title if seo else ''

    def get_meta_description(self, obj):
        seo = self._seo(obj)
        return seo.meta_description if seo else ''

    def get_focus_keyword(self, obj):
        seo = self._seo(obj)
        return seo.focus_keyword if seo else ''


class BlogPostDetailSEOPanelSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=BlogCategory.objects.all(), required=False, allow_null=True)
    category_name = serializers.SerializerMethodField()
    author = serializers.PrimaryKeyRelatedField(queryset=Author.objects.all(), required=False, allow_null=True)
    author_name = serializers.SerializerMethodField()
    author_role = serializers.SerializerMethodField()
    live_url = serializers.SerializerMethodField()
    seo = serializers.SerializerMethodField()
    sections = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'category', 'category_name', 'excerpt',
            'cover_image', 'cover_image_alt', 'author', 'author_name', 'author_role',
            'published_date', 'read_time', 'is_featured', 'status',
            'live_url', 'seo', 'sections',
        ]

    def get_category_name(self, obj):
        return obj.category.name if obj.category_id else ''

    def get_author_name(self, obj):
        return obj.author.name if obj.author_id else ''

    def get_author_role(self, obj):
        return obj.author.role if obj.author_id else ''

    def get_live_url(self, obj):
        from seo_panel.utils import frontend_url_for_blog_post
        return frontend_url_for_blog_post(obj.slug)

    def get_seo(self, obj):
        seo = getattr(obj, 'seo', None)
        if seo is None:
            return None
        return SEOMetaSEOPanelSerializer(seo, context=self.context).data

    def get_sections(self, obj):
        sections = obj.sections.filter(is_active=True).order_by('display_order')
        return BlogPostSectionSEOPanelSerializer(sections, many=True, context=self.context).data


class CourseCategorySEOPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseCategory
        fields = ['id', 'name', 'slug', 'display_label', *ORDER_FIELDS]


class CourseProgramTypeSEOPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseProgramType
        fields = ['id', 'name', 'slug', *ORDER_FIELDS]


class CourseAliasSEOPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseAlias
        fields = ['id', 'course', 'slug']
        extra_kwargs = {'course': {'write_only': True}}

    def validate_slug(self, value):
        if Course.objects.filter(slug=value).exists():
            raise serializers.ValidationError('Alias collides with a primary course slug.')
        return value


class CourseTextItemSEOPanelSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['id', 'course', 'text', *ORDER_FIELDS]
        extra_kwargs = {'course': {'write_only': True}}


def course_text_serializer(model):
    return type(f'{model.__name__}SEOPanelSerializer', (CourseTextItemSEOPanelSerializer,), {
        'Meta': type('Meta', (CourseTextItemSEOPanelSerializer.Meta,), {'model': model})
    })


CourseHighlightSEOPanelSerializer = course_text_serializer(CourseHighlight)
CourseToolSEOPanelSerializer = course_text_serializer(CourseTool)
CourseHiringPartnerSEOPanelSerializer = course_text_serializer(CourseHiringPartner)
CourseSkillSEOPanelSerializer = course_text_serializer(CourseSkill)
CourseAudienceSEOPanelSerializer = course_text_serializer(CourseAudience)
CourseJobOpportunitySEOPanelSerializer = course_text_serializer(CourseJobOpportunity)
CourseCertificationSEOPanelSerializer = course_text_serializer(CourseCertification)
CourseCareerProspectSEOPanelSerializer = course_text_serializer(CourseCareerProspect)


class CourseCurriculumTopicSEOPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseCurriculumTopic
        fields = ['id', 'module', 'text', *ORDER_FIELDS]
        extra_kwargs = {'module': {'write_only': True}}


class CourseCurriculumModuleSEOPanelSerializer(serializers.ModelSerializer):
    topics = CourseCurriculumTopicSEOPanelSerializer(many=True, read_only=True)

    class Meta:
        model = CourseCurriculumModule
        fields = ['id', 'course', 'title', *ORDER_FIELDS, 'topics']
        extra_kwargs = {'course': {'write_only': True}}


class CourseFAQSEOPanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseFAQ
        fields = ['id', 'course', 'question', 'answer', *ORDER_FIELDS]
        extra_kwargs = {'course': {'write_only': True}}


class CourseReviewIssueSEOPanelSerializer(serializers.ModelSerializer):
    category_label = serializers.CharField(source='get_category_display', read_only=True)
    status_label = serializers.CharField(source='get_status_display', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.get_username', read_only=True, default=None)

    class Meta:
        model = CourseReviewIssue
        fields = ['id', 'course', 'issue_key', 'category', 'category_label', 'field_name', 'summary', 'details',
                  'blocking', 'status', 'status_label', 'resolution_note', 'reviewed_by_name', 'reviewed_at', 'updated_at']
        read_only_fields = ['course', 'issue_key', 'category', 'category_label', 'field_name', 'summary', 'details',
                            'blocking', 'status_label', 'reviewed_by_name', 'reviewed_at', 'updated_at']

    def validate_status(self, value):
        if value not in (CourseReviewIssue.STATUS_REVIEWED, CourseReviewIssue.STATUS_CORRECTED):
            raise serializers.ValidationError('An issue may only be marked reviewed or corrected here.')
        return value

    def update(self, instance, validated_data):
        return resolve_review_issue(instance, validated_data['status'], validated_data.get('resolution_note', ''), self.context['request'].user)


class CourseSEOPanelSerializer(EditorialMediaSerializerMixin, serializers.ModelSerializer):
    aliases = CourseAliasSEOPanelSerializer(many=True, read_only=True)
    highlights = CourseHighlightSEOPanelSerializer(many=True, read_only=True)
    tools = CourseToolSEOPanelSerializer(many=True, read_only=True)
    hiring_partners = CourseHiringPartnerSEOPanelSerializer(many=True, read_only=True)
    skills = CourseSkillSEOPanelSerializer(many=True, read_only=True)
    audiences = CourseAudienceSEOPanelSerializer(many=True, read_only=True)
    job_opportunities = CourseJobOpportunitySEOPanelSerializer(many=True, read_only=True)
    certifications = CourseCertificationSEOPanelSerializer(many=True, read_only=True)
    career_prospects = CourseCareerProspectSEOPanelSerializer(many=True, read_only=True)
    curriculum_modules = CourseCurriculumModuleSEOPanelSerializer(many=True, read_only=True)
    faqs = CourseFAQSEOPanelSerializer(many=True, read_only=True)
    seo = serializers.SerializerMethodField()
    review_issues = CourseReviewIssueSEOPanelSerializer(many=True, read_only=True)
    review_summary = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'slug', 'status', 'category', 'program_type', 'badge', 'duration', 'mode',
            'tool_summary', 'short_description', 'hero_description', 'snapshot_text', 'online_fees',
            'offline_fees', 'fee_summary', 'eligibility', 'hours_of_learning', 'industry_projects',
            'tools_used_stat', 'image', 'image_alt', 'syllabus_pdf', 'syllabus_button_text',
            'display_order', 'is_active', 'needs_content_review', 'needs_url_review', 'review_notes',
            'aliases', 'highlights', 'tools', 'hiring_partners', 'skills', 'audiences',
            'job_opportunities', 'certifications', 'career_prospects', 'curriculum_modules', 'faqs', 'seo',
            'review_issues', 'review_summary',
        ]
        read_only_fields = ['needs_content_review', 'needs_url_review', 'review_notes']

    def get_seo(self, obj):
        try:
            return SEOMetaSEOPanelSerializer(obj.seo, context=self.context).data
        except SEOMeta.DoesNotExist:
            return None

    def validate_slug(self, value):
        aliases = CourseAlias.objects.filter(slug=value)
        if self.instance:
            aliases = aliases.exclude(course=self.instance)
        if aliases.exists():
            raise serializers.ValidationError('Primary slug collides with an existing course alias.')
        return value

    def validate_status(self, value):
        if value == Course.STATUS_PUBLISHED and self.instance:
            unresolved = self.instance.review_issues.filter(status=CourseReviewIssue.STATUS_OPEN, blocking=True)
            deferred = self.instance.review_issues.filter(
                status=CourseReviewIssue.STATUS_REVIEWED,
                category__in=[CourseReviewIssue.CATEGORY_URL, CourseReviewIssue.CATEGORY_OWNERSHIP],
            )
            errors = []
            if not self.instance.is_active:
                errors.append('Course must be active.')
            if unresolved.exists():
                errors.append(f'{unresolved.count()} unresolved blocking review issue(s).')
            if deferred.exists():
                errors.append(f'{deferred.count()} deferred URL/ownership decision(s).')
            try:
                seo = self.instance.seo
            except SEOMeta.DoesNotExist:
                seo = None
            if not seo or not all((seo.seo_title, seo.meta_description, seo.canonical_url)):
                errors.append('SEO title, meta description and canonical URL are required.')
            if not self.instance.image or not self.instance.image_alt:
                errors.append('Course image and image alt text are required.')
            if errors:
                raise serializers.ValidationError('Publication blocked: ' + ' '.join(errors))
        return value

    def get_review_summary(self, obj):
        return course_review_summary(obj)


class CourseURLMigrationSerializer(serializers.Serializer):
    primary_slug = serializers.SlugField(max_length=255)
    canonical_url = serializers.URLField(max_length=500)
    preserve_old_slug_as_alias = serializers.BooleanField(default=True)
    create_redirect = serializers.BooleanField(default=True)
    migration_note = serializers.CharField(min_length=5, max_length=1000)
    confirmation = serializers.CharField()

    def validate(self, attrs):
        course = self.context['course']
        new_slug = attrs['primary_slug']
        if attrs['confirmation'] != 'APPLY_URL_CHANGE':
            raise serializers.ValidationError({'confirmation': 'Explicit APPLY_URL_CHANGE confirmation is required.'})
        if Course.objects.exclude(pk=course.pk).filter(slug=new_slug).exists():
            raise serializers.ValidationError({'primary_slug': 'This slug belongs to another course.'})
        alias_owner = CourseAlias.objects.filter(slug=new_slug).exclude(course=course).first()
        if alias_owner:
            raise serializers.ValidationError({'primary_slug': 'This slug is an alias of another course.'})
        if Page.objects.filter(slug=new_slug).exists():
            raise serializers.ValidationError({'primary_slug': 'A CMS page already owns this slug.'})
        old_path = f'/courses/{course.slug}/'
        if attrs['create_redirect'] and new_slug != course.slug and Redirect.objects.filter(old_path=old_path).exists():
            raise serializers.ValidationError({'create_redirect': 'A redirect already exists for the old course URL.'})
        return attrs


class CourseListSEOPanelSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    program_type_name = serializers.CharField(source='program_type.name', read_only=True)
    seo_complete = serializers.SerializerMethodField()
    review_summary = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'title', 'slug', 'status', 'category_name', 'program_type_name', 'image', 'image_alt',
                  'display_order', 'is_active', 'needs_content_review', 'needs_url_review', 'seo_complete', 'review_summary', 'updated_at']

    def get_seo_complete(self, obj):
        seo = getattr(obj, 'seo', None)
        return bool(seo and seo.seo_title and seo.meta_description and seo.canonical_url)

    def get_review_summary(self, obj):
        return course_review_summary(obj)


def course_review_summary(course):
    open_issues = course.review_issues.filter(status=CourseReviewIssue.STATUS_OPEN)
    deferred_issues = course.review_issues.filter(
        status=CourseReviewIssue.STATUS_REVIEWED,
        category__in=[CourseReviewIssue.CATEGORY_URL, CourseReviewIssue.CATEGORY_OWNERSHIP],
    )
    content_count = open_issues.filter(category__in=[CourseReviewIssue.CATEGORY_ENCODING, CourseReviewIssue.CATEGORY_NAVIGATION]).count()
    url_count = open_issues.filter(category__in=[CourseReviewIssue.CATEGORY_URL, CourseReviewIssue.CATEGORY_OWNERSHIP]).count()
    seo_count = open_issues.filter(category=CourseReviewIssue.CATEGORY_SEO).count()
    media_complete = bool(course.image and course.image_alt)
    blocking_count = open_issues.filter(blocking=True).count()
    return {
        'content_review': {'status': 'clear' if content_count == 0 else 'required', 'open_count': content_count},
        'url_review': {
            'status': 'required' if url_count else ('deferred' if deferred_issues.exists() else 'clear'),
            'open_count': url_count,
            'deferred_count': deferred_issues.count(),
        },
        'seo': {'status': 'complete' if seo_count == 0 else 'missing', 'open_count': seo_count},
        'media': {'status': 'complete' if media_complete else 'missing', 'complete': media_complete},
        'publication': {
            'status': 'published' if course.status == Course.STATUS_PUBLISHED else (
                'blocked' if blocking_count else ('deferred' if deferred_issues.exists() else 'ready')
            ),
            'blocking_count': blocking_count,
        },
    }


class CourseAtomicUpdateSerializer(EditorialMediaSerializerMixin, serializers.ModelSerializer):
    """One guarded write contract for the complete course content editor.

    Governance fields are deliberately absent. Unknown/protected keys are
    rejected by the view before this serializer runs, rather than ignored.
    Nested records are replaced by ID inside one database transaction while
    source payloads, review history, URLs, and publication state stay untouched.
    """

    seo = serializers.DictField(required=False)
    highlights = serializers.ListField(child=serializers.DictField(), required=False)
    tools = serializers.ListField(child=serializers.DictField(), required=False)
    hiring_partners = serializers.ListField(child=serializers.DictField(), required=False)
    skills = serializers.ListField(child=serializers.DictField(), required=False)
    audiences = serializers.ListField(child=serializers.DictField(), required=False)
    job_opportunities = serializers.ListField(child=serializers.DictField(), required=False)
    certifications = serializers.ListField(child=serializers.DictField(), required=False)
    career_prospects = serializers.ListField(child=serializers.DictField(), required=False)
    curriculum_modules = serializers.ListField(child=serializers.DictField(), required=False)
    faqs = serializers.ListField(child=serializers.DictField(), required=False)

    TEXT_COLLECTIONS = {
        'highlights': CourseHighlight, 'tools': CourseTool,
        'hiring_partners': CourseHiringPartner, 'skills': CourseSkill,
        'audiences': CourseAudience, 'job_opportunities': CourseJobOpportunity,
        'certifications': CourseCertification, 'career_prospects': CourseCareerProspect,
    }
    SEO_EDITABLE = {'seo_title', 'meta_description', 'og_title', 'og_description', 'og_image', 'og_image_alt'}

    class Meta:
        model = Course
        fields = [
            'title', 'category', 'program_type', 'badge', 'duration', 'mode', 'tool_summary',
            'short_description', 'hero_description', 'snapshot_text', 'online_fees', 'offline_fees',
            'fee_summary', 'eligibility', 'hours_of_learning', 'industry_projects', 'tools_used_stat',
            'image', 'image_alt', 'syllabus_pdf', 'syllabus_button_text', 'highlights', 'tools',
            'hiring_partners', 'skills', 'audiences', 'job_opportunities', 'certifications',
            'career_prospects', 'curriculum_modules', 'faqs', 'seo',
        ]

    def validate_seo(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError('SEO must be an object.')
        forbidden = sorted(set(value) - self.SEO_EDITABLE)
        if forbidden:
            raise serializers.ValidationError(f'Protected SEO fields cannot be changed: {", ".join(forbidden)}.')
        upload = value.get('og_image')
        if upload not in (None, ''):
            ext = os.path.splitext(upload.name)[1].lower()
            if ext not in ALLOWED_EDITORIAL_IMAGE_EXTENSIONS:
                raise serializers.ValidationError({'og_image': f'Unsupported image type "{ext}".'})
            if upload.size > MAX_EDITORIAL_IMAGE_BYTES:
                raise serializers.ValidationError({'og_image': 'Image must be 8 MB or smaller.'})
        return value

    def validate_syllabus_pdf(self, upload):
        if upload in (None, ''):
            return upload
        if os.path.splitext(upload.name)[1].lower() != '.pdf':
            raise serializers.ValidationError('Syllabus must be a PDF file.')
        if upload.size > 15 * 1024 * 1024:
            raise serializers.ValidationError('Syllabus must be 15 MB or smaller.')
        return upload

    @staticmethod
    def _row_id(row):
        value = row.get('id')
        if value in (None, ''):
            return None
        try:
            return int(value)
        except (TypeError, ValueError):
            raise serializers.ValidationError({'id': 'Invalid nested record ID.'})

    def _sync_text_collection(self, course, key, rows):
        model = self.TEXT_COLLECTIONS[key]
        existing = {row.id: row for row in model.objects.select_for_update().filter(course=course)}
        retained = set()
        for index, data in enumerate(rows):
            row_id = self._row_id(data)
            if row_id is not None and row_id not in existing:
                raise serializers.ValidationError({key: f'Record {row_id} does not belong to this course.'})
            text = str(data.get('text', '')).strip()
            if not text:
                raise serializers.ValidationError({key: f'Item {index + 1} requires text.'})
            values = {'text': text, 'display_order': index, 'is_active': bool(data.get('is_active', True))}
            if row_id is None:
                model.objects.create(course=course, **values)
            else:
                retained.add(row_id)
                for field, value in values.items(): setattr(existing[row_id], field, value)
                existing[row_id].save(update_fields=[*values,])
        model.objects.filter(course=course).exclude(id__in=retained).filter(id__in=existing).delete()

    def _sync_faqs(self, course, rows):
        existing = {row.id: row for row in CourseFAQ.objects.select_for_update().filter(course=course)}
        retained = set()
        for index, data in enumerate(rows):
            row_id = self._row_id(data)
            if row_id is not None and row_id not in existing:
                raise serializers.ValidationError({'faqs': f'Record {row_id} does not belong to this course.'})
            question, answer = str(data.get('question', '')).strip(), str(data.get('answer', '')).strip()
            if not question:
                raise serializers.ValidationError({'faqs': f'FAQ {index + 1} requires a question.'})
            values = {'question': question, 'answer': answer, 'display_order': index, 'is_active': bool(data.get('is_active', True))}
            if row_id is None: CourseFAQ.objects.create(course=course, **values)
            else:
                retained.add(row_id)
                for field, value in values.items(): setattr(existing[row_id], field, value)
                existing[row_id].save(update_fields=[*values])
        CourseFAQ.objects.filter(course=course).exclude(id__in=retained).filter(id__in=existing).delete()

    def _sync_curriculum(self, course, rows):
        existing = {row.id: row for row in CourseCurriculumModule.objects.select_for_update().filter(course=course)}
        retained = set()
        for index, data in enumerate(rows):
            row_id = self._row_id(data)
            if row_id is not None and row_id not in existing:
                raise serializers.ValidationError({'curriculum_modules': f'Module {row_id} does not belong to this course.'})
            title = str(data.get('title', '')).strip()
            if not title:
                raise serializers.ValidationError({'curriculum_modules': f'Module {index + 1} requires a title.'})
            if row_id is None:
                module = CourseCurriculumModule.objects.create(course=course, title=title, display_order=index, is_active=bool(data.get('is_active', True)))
            else:
                retained.add(row_id); module = existing[row_id]
                module.title, module.display_order, module.is_active = title, index, bool(data.get('is_active', True))
                module.save(update_fields=['title', 'display_order', 'is_active'])
            topic_existing = {topic.id: topic for topic in CourseCurriculumTopic.objects.select_for_update().filter(module=module)}
            topic_retained = set()
            for topic_index, topic_data in enumerate(data.get('topics', [])):
                topic_id = self._row_id(topic_data)
                if topic_id is not None and topic_id not in topic_existing:
                    raise serializers.ValidationError({'curriculum_modules': f'Topic {topic_id} does not belong to module {module.id}.'})
                topic_text = str(topic_data.get('text', '')).strip()
                if not topic_text:
                    raise serializers.ValidationError({'curriculum_modules': f'Module {index + 1}, topic {topic_index + 1} requires text.'})
                values = {'text': topic_text, 'display_order': topic_index, 'is_active': bool(topic_data.get('is_active', True))}
                if topic_id is None: CourseCurriculumTopic.objects.create(module=module, **values)
                else:
                    topic_retained.add(topic_id); topic = topic_existing[topic_id]
                    for field, value in values.items(): setattr(topic, field, value)
                    topic.save(update_fields=[*values])
            CourseCurriculumTopic.objects.filter(module=module).exclude(id__in=topic_retained).filter(id__in=topic_existing).delete()
        CourseCurriculumModule.objects.filter(course=course).exclude(id__in=retained).filter(id__in=existing).delete()

    @transaction.atomic
    def update(self, instance, validated_data):
        instance = Course.objects.select_for_update().get(pk=instance.pk)
        nested = {key: validated_data.pop(key) for key in [*self.TEXT_COLLECTIONS, 'curriculum_modules', 'faqs'] if key in validated_data}
        seo_data = validated_data.pop('seo', None)
        instance = super().update(instance, validated_data)
        for key, rows in nested.items():
            if key in self.TEXT_COLLECTIONS: self._sync_text_collection(instance, key, rows)
            elif key == 'curriculum_modules': self._sync_curriculum(instance, rows)
            else: self._sync_faqs(instance, rows)
        if seo_data is not None:
            seo = SEOMeta.objects.select_for_update().get(course=instance)
            for field, value in seo_data.items(): setattr(seo, field, value)
            seo.full_clean(exclude=['custom_schema_json'])
            seo.save(update_fields=[*seo_data, 'updated_at'])
        return instance

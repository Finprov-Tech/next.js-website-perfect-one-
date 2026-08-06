import bleach
from rest_framework import serializers

from blog.models import BlogCategory, BlogPost, BlogPostSection
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
from core.models import SiteSettings
from pages.models import Page, PageType
from seo.models import Redirect, SEOMeta


class PageTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageType
        fields = ['name', 'slug']


class SEOMetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = SEOMeta
        fields = [
            'seo_title', 'meta_description', 'focus_keyword', 'canonical_url', 'meta_robots',
            'og_title', 'og_description', 'og_image', 'og_url',
            'schema_type', 'custom_schema_json',
            'include_in_sitemap',
            'author_name', 'author_bio', 'author_image', 'word_count',
        ]


class CTALinkMixinSerializer(serializers.ModelSerializer):
    cta_internal_page = serializers.SlugRelatedField(slug_field='slug', read_only=True)


class SecondaryCTALinkMixinSerializer(serializers.ModelSerializer):
    secondary_cta_internal_page = serializers.SlugRelatedField(slug_field='slug', read_only=True)


class ButtonLinkMixinSerializer(serializers.ModelSerializer):
    """For models using button_* naming instead of cta_* (CourseSection/CourseCard)."""
    button_internal_page = serializers.SlugRelatedField(slug_field='slug', read_only=True)


class ScrollItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScrollItem
        fields = ['id', 'text', 'icon', 'display_order']


class CredentialItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CredentialItem
        fields = ['id', 'title', 'value', 'icon', 'display_order']


class PlacementStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlacementStat
        fields = ['id', 'label', 'value', 'display_order']


class HeroAnimatedWordSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroAnimatedWord
        fields = ['id', 'word', 'display_order']


class BannerSerializer(CTALinkMixinSerializer, SecondaryCTALinkMixinSerializer):
    animated_words = serializers.SerializerMethodField()

    class Meta:
        model = Banner
        fields = [
            'id', 'heading', 'sub_heading', 'heading_level', 'paragraph', 'rich_text',
            'badge_text', 'badge_icon', 'centres_text',
            'cta_text', 'cta_internal_page', 'cta_external_url',
            'secondary_cta_text', 'secondary_cta_internal_page', 'secondary_cta_external_url',
            'top_card_title', 'top_card_subtitle', 'top_card_icon',
            'bottom_card_title', 'bottom_card_subtitle', 'bottom_card_icon',
            'floating_stat_value', 'floating_stat_label',
            'animated_words',
            'image', 'image_alt', 'display_order',
        ]

    def get_animated_words(self, obj):
        words = obj.animated_words.filter(is_active=True)
        return HeroAnimatedWordSerializer(words, many=True, context=self.context).data


class ScrollSectionSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()

    class Meta:
        model = ScrollSection
        fields = ['id', 'heading', 'items', 'display_order']

    def get_items(self, obj):
        items = obj.items.filter(is_active=True)
        return ScrollItemSerializer(items, many=True, context=self.context).data


class CredentialsSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()

    class Meta:
        model = Credentials
        fields = [
            'id', 'heading', 'sub_heading', 'heading_level', 'paragraph',
            'image', 'image_alt', 'items', 'display_order',
        ]

    def get_items(self, obj):
        items = obj.items.filter(is_active=True)
        return CredentialItemSerializer(items, many=True, context=self.context).data


class CourseCardSerializer(ButtonLinkMixinSerializer):
    class Meta:
        model = CourseCard
        fields = [
            'id', 'title', 'slug', 'category', 'program_type', 'badge', 'duration', 'mode', 'tool',
            'description', 'image', 'image_alt',
            'button_text', 'button_internal_page', 'button_external_url',
            'display_order',
        ]


class CourseSectionSerializer(ButtonLinkMixinSerializer):
    cards = serializers.SerializerMethodField()

    class Meta:
        model = CourseSection
        fields = [
            'id', 'heading', 'sub_heading', 'heading_level', 'paragraph',
            'background_image', 'background_image_alt',
            'button_text', 'button_internal_page', 'button_external_url',
            'cards', 'display_order',
        ]

    def get_cards(self, obj):
        cards = obj.cards.filter(is_active=True)
        return CourseCardSerializer(cards, many=True, context=self.context).data


class FeatureCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeatureCard
        fields = ['id', 'title', 'description', 'icon', 'image', 'display_order']


class WhyFinprovSectionSerializer(serializers.ModelSerializer):
    feature_cards = serializers.SerializerMethodField()

    class Meta:
        model = WhyFinprovSection
        fields = ['id', 'heading', 'sub_heading', 'heading_level', 'paragraph', 'feature_cards', 'display_order']

    def get_feature_cards(self, obj):
        cards = obj.feature_cards.filter(is_active=True)
        return FeatureCardSerializer(cards, many=True, context=self.context).data


class PlacementSectionSerializer(CTALinkMixinSerializer):
    stats = serializers.SerializerMethodField()

    class Meta:
        model = PlacementSection
        fields = [
            'id', 'heading', 'sub_heading', 'heading_level', 'paragraph',
            'cta_text', 'cta_internal_page', 'cta_external_url',
            'image', 'image_alt', 'stats', 'display_order',
        ]

    def get_stats(self, obj):
        stats = obj.stats.filter(is_active=True)
        return PlacementStatSerializer(stats, many=True, context=self.context).data


class CTASerializer(CTALinkMixinSerializer, SecondaryCTALinkMixinSerializer):
    class Meta:
        model = CTA
        fields = [
            'id', 'heading', 'sub_heading', 'heading_level', 'paragraph',
            'cta_text', 'cta_internal_page', 'cta_external_url',
            'secondary_cta_text', 'secondary_cta_internal_page', 'secondary_cta_external_url',
            'image', 'image_alt', 'display_order',
        ]


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = [
            'id', 'name', 'company', 'designation', 'quote', 'avatar', 'avatar_alt', 'rating',
            'kind', 'video_url', 'video_thumbnail', 'display_order',
        ]


class PartnerLogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnerLogo
        fields = ['id', 'name', 'kind', 'logo', 'logo_alt', 'website_url', 'display_order']


class FAQItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQItem
        fields = ['id', 'question', 'answer', 'display_order']


LEGAL_SECTION_ALLOWED_TAGS = ['p', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'a', 'br']
LEGAL_SECTION_ALLOWED_ATTRS = {'a': ['href', 'target', 'rel']}


class LegalSectionSerializer(serializers.ModelSerializer):
    body = serializers.SerializerMethodField()

    class Meta:
        model = LegalSection
        fields = ['id', 'title', 'body', 'display_order']

    def get_body(self, obj):
        return bleach.clean(
            obj.body,
            tags=LEGAL_SECTION_ALLOWED_TAGS,
            attributes=LEGAL_SECTION_ALLOWED_ATTRS,
            strip=True,
        )


class PageListSerializer(serializers.ModelSerializer):
    page_type = PageTypeSerializer(read_only=True)
    include_in_sitemap = serializers.SerializerMethodField()

    class Meta:
        model = Page
        fields = ['id', 'name', 'slug', 'page_type', 'is_homepage', 'status', 'include_in_sitemap', 'updated_at']

    def get_include_in_sitemap(self, obj):
        seo = getattr(obj, 'seo', None)
        return seo.include_in_sitemap if seo is not None else True


class RedirectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Redirect
        fields = ['old_path', 'new_path', 'redirect_type']


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = [
            'site_name', 'site_logo', 'default_og_image',
            'custom_404_title', 'custom_404_message', 'custom_404_image',
        ]


class QuizOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizOption
        fields = ['id', 'label', 'category', 'display_order']


class QuizQuestionSerializer(serializers.ModelSerializer):
    options = serializers.SerializerMethodField()

    class Meta:
        model = QuizQuestion
        fields = ['id', 'question_text', 'options', 'display_order']

    def get_options(self, obj):
        options = obj.options.filter(is_active=True).order_by('display_order')
        return QuizOptionSerializer(options, many=True, context=self.context).data


class QuizSerializer(CTALinkMixinSerializer):
    questions = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = [
            'id', 'heading', 'description', 'next_button_text',
            'cta_text', 'cta_internal_page', 'cta_external_url',
            'questions', 'display_order',
        ]

    def get_questions(self, obj):
        questions = obj.questions.filter(is_active=True).order_by('display_order')
        return QuizQuestionSerializer(questions, many=True, context=self.context).data


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ['id', 'name', 'role', 'category', 'experience', 'credentials', 'quote', 'photo', 'photo_alt', 'bio', 'highlights', 'display_order']


class TeamSectionSerializer(serializers.ModelSerializer):
    members = serializers.SerializerMethodField()

    class Meta:
        model = TeamSection
        fields = ['id', 'heading', 'sub_heading', 'heading_level', 'paragraph', 'members', 'display_order']

    def get_members(self, obj):
        members = obj.members.filter(is_active=True).order_by('display_order')
        return TeamMemberSerializer(members, many=True, context=self.context).data


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = ['id', 'image', 'image_alt', 'caption', 'display_order']


class LifeAtFinprovSectionSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()

    class Meta:
        model = LifeAtFinprovSection
        fields = ['id', 'heading', 'sub_heading', 'heading_level', 'paragraph', 'images', 'display_order']

    def get_images(self, obj):
        images = obj.images.filter(is_active=True).order_by('display_order')
        return GalleryImageSerializer(images, many=True, context=self.context).data


class PageDetailSerializer(serializers.ModelSerializer):
    """The main payload shape for the frontend. Sections that are conceptually
    one-per-page (banner, scroll_section, credentials, courses, why_finprov,
    placements, cta) are a single object (or null) — the first active row by
    display_order. Genuinely repeating content (testimonials, partner_logos,
    faq) stays an array."""

    page_type = PageTypeSerializer(read_only=True)
    seo = SEOMetaSerializer(read_only=True)
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

    class Meta:
        model = Page
        fields = [
            'id', 'name', 'slug', 'page_type', 'is_homepage', 'status',
            'seo', 'banner', 'scroll_section', 'credentials', 'courses', 'why_finprov',
            'placements', 'testimonials', 'partner_logos', 'faq', 'cta',
            'quiz', 'team', 'life_at_finprov', 'legal_sections',
        ]

    def _active(self, related_manager):
        return related_manager.filter(is_active=True).order_by('display_order')

    def _first_active(self, related_manager, serializer_cls):
        obj = self._active(related_manager).first()
        if obj is None:
            return None
        return serializer_cls(obj, context=self.context).data

    def get_banner(self, obj):
        return self._first_active(obj.banner_set, BannerSerializer)

    def get_scroll_section(self, obj):
        return self._first_active(obj.scrollsection_set, ScrollSectionSerializer)

    def get_credentials(self, obj):
        return self._first_active(obj.credentials_set, CredentialsSerializer)

    def get_courses(self, obj):
        return self._first_active(obj.coursesection_set, CourseSectionSerializer)

    def get_why_finprov(self, obj):
        return self._first_active(obj.whyfinprovsection_set, WhyFinprovSectionSerializer)

    def get_placements(self, obj):
        return self._first_active(obj.placementsection_set, PlacementSectionSerializer)

    def get_cta(self, obj):
        return self._first_active(obj.cta_set, CTASerializer)

    def get_testimonials(self, obj):
        return TestimonialSerializer(self._active(obj.testimonial_set), many=True, context=self.context).data

    def get_partner_logos(self, obj):
        return PartnerLogoSerializer(self._active(obj.partnerlogo_set), many=True, context=self.context).data

    def get_faq(self, obj):
        return FAQItemSerializer(self._active(obj.faqitem_set), many=True, context=self.context).data

    def get_quiz(self, obj):
        return self._first_active(obj.quiz_set, QuizSerializer)

    def get_team(self, obj):
        return self._first_active(obj.teamsection_set, TeamSectionSerializer)

    def get_life_at_finprov(self, obj):
        return self._first_active(obj.lifeatfinprovsection_set, LifeAtFinprovSectionSerializer)

    def get_legal_sections(self, obj):
        return LegalSectionSerializer(self._active(obj.legalsection_set), many=True, context=self.context).data


class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = ['name', 'slug']


class BlogPostSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPostSection
        fields = ['id', 'heading', 'body', 'display_order']


class BlogPostListSerializer(serializers.ModelSerializer):
    category = BlogCategorySerializer(read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            'title', 'slug', 'excerpt', 'category', 'cover_image', 'cover_image_alt',
            'author_name', 'author_role', 'published_date', 'read_time', 'is_featured',
        ]


class BlogPostDetailSerializer(serializers.ModelSerializer):
    category = BlogCategorySerializer(read_only=True)
    seo = SEOMetaSerializer(read_only=True)
    sections = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'title', 'slug', 'excerpt', 'category', 'cover_image', 'cover_image_alt',
            'author_name', 'author_role', 'published_date', 'read_time', 'is_featured',
            'sections', 'seo',
        ]

    def get_sections(self, obj):
        sections = obj.sections.filter(is_active=True).order_by('display_order')
        return BlogPostSectionSerializer(sections, many=True, context=self.context).data

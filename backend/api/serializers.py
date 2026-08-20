import bleach
from rest_framework import serializers

from blog.models import BlogCategory, BlogPost, BlogPostSection, Author
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
    paragraph = serializers.SerializerMethodField()
    rich_text = serializers.SerializerMethodField()

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

    def get_paragraph(self, obj):
        return sanitize_rich_text(obj.paragraph)

    def get_rich_text(self, obj):
        return sanitize_rich_text(obj.rich_text)


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
    paragraph = serializers.SerializerMethodField()

    class Meta:
        model = Credentials
        fields = [
            'id', 'heading', 'sub_heading', 'heading_level', 'paragraph',
            'image', 'image_alt', 'items', 'display_order',
        ]

    def get_items(self, obj):
        items = obj.items.filter(is_active=True)
        return CredentialItemSerializer(items, many=True, context=self.context).data

    def get_paragraph(self, obj):
        return sanitize_rich_text(obj.paragraph)


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
        fields = ['id', 'title', 'description', 'icon', 'image', 'image_alt', 'display_order']


class WhyFinprovSectionSerializer(serializers.ModelSerializer):
    feature_cards = serializers.SerializerMethodField()
    paragraph = serializers.SerializerMethodField()

    class Meta:
        model = WhyFinprovSection
        fields = ['id', 'heading', 'sub_heading', 'heading_level', 'paragraph', 'feature_cards', 'display_order']

    def get_feature_cards(self, obj):
        cards = obj.feature_cards.filter(is_active=True)
        return FeatureCardSerializer(cards, many=True, context=self.context).data

    def get_paragraph(self, obj):
        return sanitize_rich_text(obj.paragraph)


class PlacementSectionSerializer(CTALinkMixinSerializer):
    stats = serializers.SerializerMethodField()
    paragraph = serializers.SerializerMethodField()

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

    def get_paragraph(self, obj):
        return sanitize_rich_text(obj.paragraph)


class CTASerializer(CTALinkMixinSerializer, SecondaryCTALinkMixinSerializer):
    paragraph = serializers.SerializerMethodField()

    class Meta:
        model = CTA
        fields = [
            'id', 'heading', 'sub_heading', 'heading_level', 'paragraph',
            'cta_text', 'cta_internal_page', 'cta_external_url',
            'secondary_cta_text', 'secondary_cta_internal_page', 'secondary_cta_external_url',
            'image', 'image_alt', 'display_order',
        ]

    def get_paragraph(self, obj):
        return sanitize_rich_text(obj.paragraph)


class TestimonialSerializer(serializers.ModelSerializer):
    quote = serializers.SerializerMethodField()

    class Meta:
        model = Testimonial
        fields = [
            'id', 'name', 'program', 'company', 'designation', 'quote', 'avatar', 'avatar_alt', 'rating',
            'kind', 'video_url', 'video_thumbnail', 'video_thumbnail_alt', 'display_order',
        ]

    def get_quote(self, obj):
        return sanitize_rich_text(obj.quote)


class PartnerLogoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnerLogo
        fields = ['id', 'name', 'kind', 'logo', 'logo_alt', 'website_url', 'display_order']


class FAQItemSerializer(serializers.ModelSerializer):
    answer = serializers.SerializerMethodField()

    class Meta:
        model = FAQItem
        fields = ['id', 'question', 'answer', 'display_order']

    def get_answer(self, obj):
        return sanitize_rich_text(obj.answer)


# Shared allowlist for every CMS rich-text field (SEO panel + LegalSection).
# Sanitization happens here, at the public read path, not at save time — the
# stored value can be raw/untrusted (typed via the SEO panel's editor or the
# admin's plain textarea); this is the one place it's guaranteed clean before
# it reaches a browser via dangerouslySetInnerHTML.
RICH_TEXT_ALLOWED_TAGS = [
    'p', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'u', 'a', 'br', 'img',
    'h2', 'h3', 'h4', 'h5', 'h6',  # h1 deliberately excluded — stays the page's dedicated heading field
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'figure',
]
RICH_TEXT_ALLOWED_ATTRS = {
    'a': ['href', 'target', 'rel'],
    'img': ['src', 'alt'],
    'table': ['class'],
    'thead': ['class'],
    'tbody': ['class'],
    'tr': ['class'],
    'th': ['class', 'colspan', 'rowspan', 'scope'],
    'td': ['class', 'colspan', 'rowspan'],
    'figure': ['class'],
}


def sanitize_rich_text(html):
    if not html:
        return ''
    return bleach.clean(html, tags=RICH_TEXT_ALLOWED_TAGS, attributes=RICH_TEXT_ALLOWED_ATTRS, strip=True)


class LegalSectionSerializer(serializers.ModelSerializer):
    body = serializers.SerializerMethodField()

    class Meta:
        model = LegalSection
        fields = ['id', 'title', 'body', 'display_order']

    def get_body(self, obj):
        return sanitize_rich_text(obj.body)


class LandingPageBodySerializer(serializers.ModelSerializer):
    body = serializers.SerializerMethodField()

    class Meta:
        model = LandingPageBody
        fields = ['id', 'h1', 'body']

    def get_body(self, obj):
        return sanitize_rich_text(obj.body)


class HistoryMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoryMilestone
        fields = ['id', 'year_label', 'title', 'description', 'display_order']


class HistorySectionSerializer(serializers.ModelSerializer):
    milestones = serializers.SerializerMethodField()

    class Meta:
        model = HistorySection
        fields = ['id', 'eyebrow', 'heading', 'sub_heading', 'heading_level', 'milestones', 'display_order']

    def get_milestones(self, obj):
        milestones = obj.milestones.filter(is_active=True)
        return HistoryMilestoneSerializer(milestones, many=True, context=self.context).data


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
    bio = serializers.SerializerMethodField()

    class Meta:
        model = TeamMember
        fields = ['id', 'name', 'role', 'category', 'experience', 'credentials', 'quote', 'photo', 'photo_alt', 'bio', 'highlights', 'display_order']

    def get_bio(self, obj):
        return sanitize_rich_text(obj.bio)


class TeamSectionSerializer(serializers.ModelSerializer):
    members = serializers.SerializerMethodField()
    paragraph = serializers.SerializerMethodField()

    class Meta:
        model = TeamSection
        fields = ['id', 'heading', 'sub_heading', 'heading_level', 'paragraph', 'members', 'display_order']

    def get_members(self, obj):
        members = obj.members.filter(is_active=True).order_by('display_order')
        return TeamMemberSerializer(members, many=True, context=self.context).data

    def get_paragraph(self, obj):
        return sanitize_rich_text(obj.paragraph)


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = ['id', 'image', 'image_alt', 'caption', 'display_order']


class LifeAtFinprovSectionSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    paragraph = serializers.SerializerMethodField()

    class Meta:
        model = LifeAtFinprovSection
        fields = ['id', 'heading', 'sub_heading', 'heading_level', 'paragraph', 'images', 'display_order']

    def get_images(self, obj):
        images = obj.images.filter(is_active=True).order_by('display_order')
        return GalleryImageSerializer(images, many=True, context=self.context).data

    def get_paragraph(self, obj):
        return sanitize_rich_text(obj.paragraph)


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
    landing_page = serializers.SerializerMethodField()
    history = serializers.SerializerMethodField()

    class Meta:
        model = Page
        fields = [
            'id', 'name', 'slug', 'page_type', 'is_homepage', 'status',
            'seo', 'banner', 'scroll_section', 'credentials', 'courses', 'why_finprov',
            'placements', 'testimonials', 'partner_logos', 'faq', 'cta',
            'quiz', 'team', 'life_at_finprov', 'legal_sections', 'landing_page', 'history',
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

    def get_landing_page(self, obj):
        return self._first_active(obj.landingpagebody_set, LandingPageBodySerializer)

    def get_history(self, obj):
        return self._first_active(obj.historysection_set, HistorySectionSerializer)


class BlogCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogCategory
        fields = ['name', 'slug']


class BlogPostSectionSerializer(serializers.ModelSerializer):
    body = serializers.SerializerMethodField()

    class Meta:
        model = BlogPostSection
        fields = ['id', 'heading', 'body', 'display_order']

    def get_body(self, obj):
        return sanitize_rich_text(obj.body)


# Mixin so both list/detail blog serializers expose the same author_* shape
# the public frontend already consumes (author_name/author_role as plain
# strings), now sourced from the Author FK instead of free-text fields —
# plus two new additive fields (photo/bio) for a richer byline later.
class BlogPostAuthorFieldsMixin:
    def get_author_name(self, obj):
        return obj.author.name if obj.author_id else ''

    def get_author_role(self, obj):
        return obj.author.role if obj.author_id else ''

    def get_author_photo(self, obj):
        if not obj.author_id or not obj.author.photo:
            return None
        request = self.context.get('request')
        url = obj.author.photo.url
        return request.build_absolute_uri(url) if request else url

    def get_author_bio(self, obj):
        return obj.author.bio if obj.author_id else ''

    def get_author_slug(self, obj):
        return obj.author.slug if obj.author_id else ''


class BlogPostListSerializer(BlogPostAuthorFieldsMixin, serializers.ModelSerializer):
    category = BlogCategorySerializer(read_only=True)
    author_name = serializers.SerializerMethodField()
    author_role = serializers.SerializerMethodField()
    author_slug = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'title', 'slug', 'excerpt', 'category', 'cover_image', 'cover_image_alt',
            'author_name', 'author_role', 'author_slug', 'published_date', 'read_time', 'is_featured',
        ]


class BlogPostDetailSerializer(BlogPostAuthorFieldsMixin, serializers.ModelSerializer):
    category = BlogCategorySerializer(read_only=True)
    seo = SEOMetaSerializer(read_only=True)
    sections = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    author_role = serializers.SerializerMethodField()
    author_photo = serializers.SerializerMethodField()
    author_bio = serializers.SerializerMethodField()
    author_slug = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'title', 'slug', 'excerpt', 'category', 'cover_image', 'cover_image_alt',
            'author_name', 'author_role', 'author_photo', 'author_bio', 'author_slug',
            'published_date', 'read_time', 'is_featured', 'sections', 'seo',
        ]

    def get_sections(self, obj):
        sections = obj.sections.filter(is_active=True).order_by('display_order')
        return BlogPostSectionSerializer(sections, many=True, context=self.context).data


class AuthorDetailSerializer(serializers.ModelSerializer):
    posts = serializers.SerializerMethodField()
    photo = serializers.SerializerMethodField()

    class Meta:
        model = Author
        fields = ['name', 'slug', 'role', 'bio', 'photo', 'posts']

    def get_photo(self, obj):
        if not obj.photo:
            return None
        request = self.context.get('request')
        url = obj.photo.url
        return request.build_absolute_uri(url) if request else url

    def get_posts(self, obj):
        posts = (
            obj.posts.filter(status=BlogPost.STATUS_PUBLISHED)
            .select_related('category', 'author')
            .order_by('-published_date')
        )
        return BlogPostListSerializer(posts, many=True, context=self.context).data

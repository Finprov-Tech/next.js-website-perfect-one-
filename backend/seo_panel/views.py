import os
import uuid
import json

from django.core.files.storage import default_storage
from django.db.models import Q
from rest_framework import filters, mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.parsers import JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from courses.review import keep_current_course_url, issue_key, refresh_course_review_flags
from django.db import transaction
from django.utils import timezone

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
from pages.models import Page
from core.models import SiteSettings
from blog.models import Author, BlogCategory, BlogPost, BlogPostSection
from seo.models import Redirect, SEOMeta
from courses.models import (
    Course, CourseAlias, CourseAudience, CourseCareerProspect, CourseCategory, CourseCertification,
    CourseCurriculumModule, CourseCurriculumTopic, CourseFAQ, CourseHighlight, CourseHiringPartner,
    CourseJobOpportunity, CourseProgramType, CourseReviewIssue, CourseSkill, CourseTool,
)
from seo_panel.permissions import IsSEOTeamMember
from seo_panel.serializers import (
    AuthorSEOPanelSerializer,
    BannerSEOPanelSerializer,
    BlogCategorySEOPanelSerializer,
    BlogPostDetailSEOPanelSerializer,
    BlogPostListSEOPanelSerializer,
    BlogPostSectionSEOPanelSerializer,
    CourseCardSEOPanelSerializer,
    CourseSectionSEOPanelSerializer,
    CredentialItemSEOPanelSerializer,
    CredentialsSEOPanelSerializer,
    CTASEOPanelSerializer,
    FAQItemSEOPanelSerializer,
    FeatureCardSEOPanelSerializer,
    GalleryImageSEOPanelSerializer,
    HistoryMilestoneSEOPanelSerializer,
    HistorySectionSEOPanelSerializer,
    LandingPageBodySEOPanelSerializer,
    LegalSectionSEOPanelSerializer,
    LifeAtFinprovSectionSEOPanelSerializer,
    PageDetailSEOPanelSerializer,
    PageListSEOPanelSerializer,
    PageSlugUpdateSerializer,
    PartnerLogoSEOPanelSerializer,
    PlacementSectionSEOPanelSerializer,
    PlacementStatSEOPanelSerializer,
    QuizOptionSEOPanelSerializer,
    RedirectSEOPanelSerializer,
    QuizQuestionSEOPanelSerializer,
    QuizSEOPanelSerializer,
    ScrollItemSEOPanelSerializer,
    ScrollSectionSEOPanelSerializer,
    SEOMetaSEOPanelSerializer,
    SiteSettingsSEOPanelSerializer,
    TeamMemberSEOPanelSerializer,
    TeamSectionSEOPanelSerializer,
    TestimonialSEOPanelSerializer,
    WhyFinprovSectionSEOPanelSerializer,
    CourseAliasSEOPanelSerializer, CourseAudienceSEOPanelSerializer, CourseCareerProspectSEOPanelSerializer,
    CourseCategorySEOPanelSerializer, CourseCertificationSEOPanelSerializer,
    CourseCurriculumModuleSEOPanelSerializer, CourseCurriculumTopicSEOPanelSerializer,
    CourseFAQSEOPanelSerializer, CourseHighlightSEOPanelSerializer, CourseHiringPartnerSEOPanelSerializer,
    CourseJobOpportunitySEOPanelSerializer, CourseProgramTypeSEOPanelSerializer,
    CourseSEOPanelSerializer, CourseAtomicUpdateSerializer, CourseListSEOPanelSerializer, CourseReviewIssueSEOPanelSerializer, CourseSkillSEOPanelSerializer, CourseToolSEOPanelSerializer, CourseURLMigrationSerializer,
)


class SEOPanelModuleViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    """Shared base for every content-module endpoint in the SEO panel:
    existing rows only, no create/list/destroy — matches the panel's
    'edit copy, not structure' scope. Every subclass just sets queryset
    and serializer_class."""

    permission_classes = [IsSEOTeamMember]


class SEOPanelCollectionItemViewSet(viewsets.ModelViewSet):
    """CRUD for items inside developer-defined repeating collections.

    This permits editorial list maintenance without allowing arbitrary page
    section types. New rows are appended unless an order is supplied.
    """

    permission_classes = [IsSEOTeamMember]
    pagination_class = None

    def perform_create(self, serializer):
        has_order = any(field.name == 'display_order' for field in serializer.Meta.model._meta.fields)
        if not has_order or 'display_order' in serializer.validated_data:
            serializer.save()
            return
        serializer.save(display_order=self.get_queryset().count())


class CourseSEOPanelViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.select_related('category', 'program_type', 'seo').prefetch_related(
        'aliases', 'highlights', 'tools', 'hiring_partners', 'skills', 'audiences', 'job_opportunities',
        'certifications', 'career_prospects', 'curriculum_modules__topics', 'faqs',
        'review_issues__reviewed_by',
    )
    serializer_class = CourseSEOPanelSerializer
    permission_classes = [IsSEOTeamMember]
    lookup_field = 'slug'
    pagination_class = None
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'slug']

    PROTECTED_EDITOR_FIELDS = {
        'slug', 'status', 'is_active', 'display_order', 'canonical_url', 'aliases',
        'redirects', 'ownership', 'include_in_sitemap', 'source_payload', 'source_hash',
        'provenance', 'review_issues', 'review_notes', 'needs_content_review', 'needs_url_review',
    }

    def get_serializer_class(self):
        return CourseListSEOPanelSerializer if self.action == 'list' else CourseSEOPanelSerializer

    @action(detail=True, methods=['patch'], url_path='content', parser_classes=[JSONParser, MultiPartParser])
    def content_update(self, request, slug=None):
        """Atomically update editable course, nested, media, and SEO content."""
        if 'payload' in request.data:
            try:
                payload = json.loads(request.data['payload'])
            except (TypeError, ValueError):
                return Response({'payload': ['Invalid JSON payload.']}, status=status.HTTP_400_BAD_REQUEST)
        else:
            payload = request.data.copy()
        if not isinstance(payload, dict):
            return Response({'payload': ['Expected an object.']}, status=status.HTTP_400_BAD_REQUEST)
        forbidden = sorted(set(payload) & self.PROTECTED_EDITOR_FIELDS)
        if forbidden:
            return Response(
                {'protected_fields': [f'Protected fields cannot be changed: {", ".join(forbidden)}.']},
                status=status.HTTP_400_BAD_REQUEST,
            )
        payload = dict(payload)
        for field in ('image', 'syllabus_pdf'):
            if field in request.FILES: payload[field] = request.FILES[field]
        if 'og_image' in request.FILES:
            payload.setdefault('seo', {})['og_image'] = request.FILES['og_image']
        course = self.get_object()
        serializer = CourseAtomicUpdateSerializer(course, data=payload, partial=True, context=self.get_serializer_context())
        serializer.is_valid(raise_exception=True)
        serializer.save()
        refreshed = self.get_queryset().get(pk=course.pk)
        return Response(CourseSEOPanelSerializer(refreshed, context=self.get_serializer_context()).data)

    @action(detail=True, methods=['post'], url_path='publish')
    def publish(self, request, slug=None):
        course = self.get_object()
        serializer = CourseSEOPanelSerializer(course, data={'status': Course.STATUS_PUBLISHED}, partial=True, context=self.get_serializer_context())
        serializer.is_valid(raise_exception=True)
        serializer.save()
        refreshed = self.get_queryset().get(pk=course.pk)
        return Response(CourseSEOPanelSerializer(refreshed, context=self.get_serializer_context()).data)

    @action(detail=True, methods=['post'], url_path='unpublish')
    def unpublish(self, request, slug=None):
        course = self.get_object()
        if course.status != Course.STATUS_PUBLISHED:
            return Response({'status': ['Only a published course can be unpublished.']}, status=status.HTTP_400_BAD_REQUEST)
        course.status = Course.STATUS_DRAFT
        course.save(update_fields=['status', 'updated_at'])
        refreshed = self.get_queryset().get(pk=course.pk)
        return Response(CourseSEOPanelSerializer(refreshed, context=self.get_serializer_context()).data)

    @action(detail=True, methods=['post'], url_path='url-decision/keep-current')
    def keep_current_url(self, request, slug=None):
        if request.data.get('confirmation') != 'KEEP_CURRENT_URL':
            return Response({'confirmation': ['Explicit KEEP_CURRENT_URL confirmation is required.']}, status=status.HTTP_400_BAD_REQUEST)
        course = self.get_object()
        try:
            keep_current_course_url(course, request.user)
        except ValueError as error:
            return Response({'url_decision': [str(error)]}, status=status.HTTP_400_BAD_REQUEST)
        refreshed = self.get_queryset().get(pk=course.pk)
        return Response(CourseSEOPanelSerializer(refreshed, context=self.get_serializer_context()).data)

    @action(detail=True, methods=['post'], url_path='url-migration')
    def url_migration(self, request, slug=None):
        course = self.get_object()
        serializer = CourseURLMigrationSerializer(data=request.data, context={'course': course})
        serializer.is_valid(raise_exception=True)
        values = serializer.validated_data
        old_slug, new_slug = course.slug, values['primary_slug']
        old_path, new_path = f'/courses/{old_slug}/', f'/courses/{new_slug}/'
        with transaction.atomic():
            locked = Course.objects.select_for_update().select_related('seo').get(pk=course.pk)
            locked.slug = new_slug
            locked._history_user = request.user
            locked.save(update_fields=['slug', 'updated_at'])
            if values['preserve_old_slug_as_alias'] and old_slug != new_slug:
                CourseAlias.objects.get_or_create(course=locked, slug=old_slug)
            locked.aliases.filter(slug=new_slug).delete()
            seo = locked.seo
            seo.canonical_url = values['canonical_url']
            seo._history_user = request.user
            seo.full_clean(exclude=['custom_schema_json'])
            seo.save(update_fields=['canonical_url', 'updated_at'])
            if values['create_redirect'] and old_slug != new_slug:
                Redirect.objects.create(old_path=old_path, new_path=new_path, redirect_type=Redirect.REDIRECT_301, is_active=True)
            details = {'old_slug': old_slug, 'new_slug': new_slug, 'canonical_url': values['canonical_url'], 'old_alias_preserved': values['preserve_old_slug_as_alias'], 'redirect_created': values['create_redirect'] and old_slug != new_slug}
            now = timezone.now()
            CourseReviewIssue.objects.create(
                course=locked, issue_key=issue_key(CourseReviewIssue.CATEGORY_URL, 'slug', {**details, 'reviewed_at': now.isoformat()}),
                category=CourseReviewIssue.CATEGORY_URL, field_name='slug', summary='Explicit course URL migration approved',
                details=details, blocking=False, status=CourseReviewIssue.STATUS_CORRECTED,
                resolution_note=values['migration_note'], reviewed_by=request.user, reviewed_at=now,
            )
            refresh_course_review_flags(locked)
        refreshed = self.get_queryset().get(pk=course.pk)
        return Response(CourseSEOPanelSerializer(refreshed, context=self.get_serializer_context()).data)


class CourseCategorySEOPanelViewSet(SEOPanelCollectionItemViewSet):
    queryset = CourseCategory.objects.all(); serializer_class = CourseCategorySEOPanelSerializer


class CourseReviewIssueSEOPanelViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    queryset = CourseReviewIssue.objects.select_related('course', 'reviewed_by')
    serializer_class = CourseReviewIssueSEOPanelSerializer
    permission_classes = [IsSEOTeamMember]


class CourseProgramTypeSEOPanelViewSet(SEOPanelCollectionItemViewSet):
    queryset = CourseProgramType.objects.all(); serializer_class = CourseProgramTypeSEOPanelSerializer


class CourseAliasSEOPanelViewSet(SEOPanelCollectionItemViewSet):
    queryset = CourseAlias.objects.all(); serializer_class = CourseAliasSEOPanelSerializer


class CourseHighlightSEOPanelViewSet(SEOPanelCollectionItemViewSet):
    queryset = CourseHighlight.objects.all(); serializer_class = CourseHighlightSEOPanelSerializer


class CourseToolSEOPanelViewSet(SEOPanelCollectionItemViewSet):
    queryset = CourseTool.objects.all(); serializer_class = CourseToolSEOPanelSerializer


class CourseHiringPartnerSEOPanelViewSet(SEOPanelCollectionItemViewSet):
    queryset = CourseHiringPartner.objects.all(); serializer_class = CourseHiringPartnerSEOPanelSerializer


class CourseSkillSEOPanelViewSet(SEOPanelCollectionItemViewSet):
    queryset = CourseSkill.objects.all(); serializer_class = CourseSkillSEOPanelSerializer


class CourseAudienceSEOPanelViewSet(SEOPanelCollectionItemViewSet):
    queryset = CourseAudience.objects.all(); serializer_class = CourseAudienceSEOPanelSerializer


class CourseJobOpportunitySEOPanelViewSet(SEOPanelCollectionItemViewSet):
    queryset = CourseJobOpportunity.objects.all(); serializer_class = CourseJobOpportunitySEOPanelSerializer


class CourseCertificationSEOPanelViewSet(SEOPanelCollectionItemViewSet):
    queryset = CourseCertification.objects.all(); serializer_class = CourseCertificationSEOPanelSerializer


class CourseCareerProspectSEOPanelViewSet(SEOPanelCollectionItemViewSet):
    queryset = CourseCareerProspect.objects.all(); serializer_class = CourseCareerProspectSEOPanelSerializer


class CourseCurriculumModuleSEOPanelViewSet(SEOPanelCollectionItemViewSet):
    queryset = CourseCurriculumModule.objects.all(); serializer_class = CourseCurriculumModuleSEOPanelSerializer


class CourseCurriculumTopicSEOPanelViewSet(SEOPanelCollectionItemViewSet):
    queryset = CourseCurriculumTopic.objects.all(); serializer_class = CourseCurriculumTopicSEOPanelSerializer


class CourseFAQSEOPanelViewSet(SEOPanelCollectionItemViewSet):
    queryset = CourseFAQ.objects.all(); serializer_class = CourseFAQSEOPanelSerializer


class BannerSEOPanelViewSet(SEOPanelModuleViewSet):
    queryset = Banner.objects.all()
    serializer_class = BannerSEOPanelSerializer


class CredentialsSEOPanelViewSet(SEOPanelModuleViewSet):
    queryset = Credentials.objects.all()
    serializer_class = CredentialsSEOPanelSerializer


class CredentialItemSEOPanelViewSet(SEOPanelCollectionItemViewSet):
    queryset = CredentialItem.objects.all()
    serializer_class = CredentialItemSEOPanelSerializer


class ScrollSectionSEOPanelViewSet(SEOPanelModuleViewSet):
    queryset = ScrollSection.objects.all()
    serializer_class = ScrollSectionSEOPanelSerializer


class ScrollItemSEOPanelViewSet(SEOPanelCollectionItemViewSet):
    queryset = ScrollItem.objects.all()
    serializer_class = ScrollItemSEOPanelSerializer


class CourseSectionSEOPanelViewSet(SEOPanelModuleViewSet):
    queryset = CourseSection.objects.all()
    serializer_class = CourseSectionSEOPanelSerializer


class CourseCardSEOPanelViewSet(SEOPanelCollectionItemViewSet):
    queryset = CourseCard.objects.all()
    serializer_class = CourseCardSEOPanelSerializer


class WhyFinprovSectionSEOPanelViewSet(SEOPanelModuleViewSet):
    queryset = WhyFinprovSection.objects.all()
    serializer_class = WhyFinprovSectionSEOPanelSerializer


class FeatureCardSEOPanelViewSet(SEOPanelCollectionItemViewSet):
    queryset = FeatureCard.objects.all()
    serializer_class = FeatureCardSEOPanelSerializer


class PlacementSectionSEOPanelViewSet(SEOPanelModuleViewSet):
    queryset = PlacementSection.objects.all()
    serializer_class = PlacementSectionSEOPanelSerializer


class PlacementStatSEOPanelViewSet(SEOPanelCollectionItemViewSet):
    queryset = PlacementStat.objects.all()
    serializer_class = PlacementStatSEOPanelSerializer


class CTASEOPanelViewSet(SEOPanelModuleViewSet):
    queryset = CTA.objects.all()
    serializer_class = CTASEOPanelSerializer


class TestimonialSEOPanelViewSet(SEOPanelCollectionItemViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSEOPanelSerializer


class PartnerLogoSEOPanelViewSet(SEOPanelCollectionItemViewSet):
    queryset = PartnerLogo.objects.all()
    serializer_class = PartnerLogoSEOPanelSerializer


class FAQItemSEOPanelViewSet(SEOPanelCollectionItemViewSet):
    queryset = FAQItem.objects.all()
    serializer_class = FAQItemSEOPanelSerializer


class QuizSEOPanelViewSet(SEOPanelModuleViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSEOPanelSerializer


class QuizQuestionSEOPanelViewSet(SEOPanelCollectionItemViewSet):
    queryset = QuizQuestion.objects.all()
    serializer_class = QuizQuestionSEOPanelSerializer


class QuizOptionSEOPanelViewSet(SEOPanelCollectionItemViewSet):
    queryset = QuizOption.objects.all()
    serializer_class = QuizOptionSEOPanelSerializer


class TeamSectionSEOPanelViewSet(SEOPanelModuleViewSet):
    queryset = TeamSection.objects.all()
    serializer_class = TeamSectionSEOPanelSerializer


class TeamMemberSEOPanelViewSet(SEOPanelCollectionItemViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSEOPanelSerializer


class LifeAtFinprovSectionSEOPanelViewSet(SEOPanelModuleViewSet):
    queryset = LifeAtFinprovSection.objects.all()
    serializer_class = LifeAtFinprovSectionSEOPanelSerializer


class GalleryImageSEOPanelViewSet(SEOPanelCollectionItemViewSet):
    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageSEOPanelSerializer


class LegalSectionSEOPanelViewSet(SEOPanelCollectionItemViewSet):
    queryset = LegalSection.objects.all()
    serializer_class = LegalSectionSEOPanelSerializer


class LandingPageBodySEOPanelViewSet(SEOPanelModuleViewSet):
    queryset = LandingPageBody.objects.all()
    serializer_class = LandingPageBodySEOPanelSerializer


class HistorySectionSEOPanelViewSet(SEOPanelModuleViewSet):
    queryset = HistorySection.objects.all()
    serializer_class = HistorySectionSEOPanelSerializer


class HistoryMilestoneSEOPanelViewSet(SEOPanelCollectionItemViewSet):
    queryset = HistoryMilestone.objects.all()
    serializer_class = HistoryMilestoneSEOPanelSerializer


class SEOMetaSEOPanelViewSet(SEOPanelModuleViewSet):
    queryset = SEOMeta.objects.all()
    serializer_class = SEOMetaSEOPanelSerializer


class RedirectSEOPanelViewSet(viewsets.ModelViewSet):
    """Full CRUD, unlike the module viewsets above — redirects are the SEO
    team's own tool, not existing page content, so create/delete are
    in scope here per the reviewed spec."""

    queryset = Redirect.objects.all()
    serializer_class = RedirectSEOPanelSerializer
    permission_classes = [IsSEOTeamMember]
    pagination_class = None
    filter_backends = [filters.SearchFilter]
    search_fields = ['old_path', 'new_path']


class SiteSettingsSEOPanelViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    serializer_class = SiteSettingsSEOPanelSerializer
    permission_classes = [IsSEOTeamMember]

    def get_object(self):
        obj = SiteSettings.load()
        self.check_object_permissions(self.request, obj)
        return obj


class PageSEOPanelViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    """Read-only — structural fields (slug/status/page_type/homepage) are
    never editable through this panel, only via /admin/."""

    queryset = Page.objects.select_related('page_type', 'seo').prefetch_related(
        'banner_set__animated_words', 'scrollsection_set__items', 'credentials_set__items',
        'coursesection_set__cards', 'whyfinprovsection_set__feature_cards',
        'placementsection_set__stats', 'cta_set', 'testimonial_set', 'partnerlogo_set',
        'faqitem_set', 'quiz_set__questions__options', 'teamsection_set__members',
        'lifeatfinprovsection_set__images', 'legalsection_set', 'landingpagebody_set',
        'historysection_set__milestones',
    ).order_by('name')
    lookup_field = 'slug'
    permission_classes = [IsSEOTeamMember]
    pagination_class = None  # a CMS page list is small (tens, not thousands) — no need to page it

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PageDetailSEOPanelSerializer
        return PageListSEOPanelSerializer

    @action(detail=True, methods=['patch'], url_path='slug')
    def change_slug(self, request, slug=None):
        from urllib.parse import urlsplit, urlunsplit
        from seo_panel.utils import frontend_url_for

        page = self.get_object()
        serializer = PageSlugUpdateSerializer(data=request.data, context={'page': page})
        serializer.is_valid(raise_exception=True)
        new_slug = serializer.validated_data['slug']
        old_slug = page.slug

        if new_slug == old_slug:
            return Response({'slug': page.slug, 'live_url': frontend_url_for(page.slug), 'redirect_created': False})

        old_path = '/' if page.is_homepage else f'/{old_slug}/'
        new_path = '/' if page.is_homepage else f'/{new_slug}/'

        with transaction.atomic():
            page.slug = new_slug
            page.save(update_fields=['slug', 'updated_at'])

            seo = getattr(page, 'seo', None)
            if seo and seo.canonical_url:
                parsed = urlsplit(seo.canonical_url)
                canonical_path = parsed.path.rstrip('/') + '/'
                if canonical_path == old_path:
                    seo.canonical_url = urlunsplit((parsed.scheme, parsed.netloc, new_path, parsed.query, parsed.fragment))
                    seo.save(update_fields=['canonical_url', 'updated_at'])

        return Response({
            'slug': page.slug,
            'live_url': frontend_url_for(page.slug),
            'redirect_created': True,
            'redirect': {'old_path': old_path, 'new_path': new_path, 'redirect_type': 301},
        })


class BlogCategorySEOPanelViewSet(mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    """List + create only — categories are a lightweight lookup the SEO team
    can add to while authoring a post, not a thing they manage in depth."""

    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySEOPanelSerializer
    permission_classes = [IsSEOTeamMember]
    pagination_class = None


class AuthorSEOPanelViewSet(viewsets.ModelViewSet):
    """Full CRUD — an author's profile (bio/photo) may need editing after
    creation, unlike categories which are effectively just a name."""

    queryset = Author.objects.all()
    serializer_class = AuthorSEOPanelSerializer
    permission_classes = [IsSEOTeamMember]
    pagination_class = None


class BlogPostSectionSEOPanelViewSet(viewsets.ModelViewSet):
    """Full CRUD — a blog post's sections are its actual article content,
    authored/removed freely by the SEO team (unlike page modules, which are
    fixed structure)."""

    queryset = BlogPostSection.objects.all()
    serializer_class = BlogPostSectionSEOPanelSerializer
    permission_classes = [IsSEOTeamMember]
    pagination_class = None

    def perform_create(self, serializer):
        post = serializer.validated_data['post']
        next_order = post.sections.count()
        serializer.save(display_order=next_order)


class BlogPostSEOPanelViewSet(viewsets.ModelViewSet):
    """Full CRUD — blog posts are the SEO team's own authored content, same
    scope as Redirects, not existing page structure."""

    queryset = BlogPost.objects.select_related('category', 'seo').order_by('-published_date', '-id')
    permission_classes = [IsSEOTeamMember]
    pagination_class = None
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'slug']

    def get_serializer_class(self):
        if self.action == 'list':
            return BlogPostListSEOPanelSerializer
        return BlogPostDetailSEOPanelSerializer

    def perform_create(self, serializer):
        post = serializer.save()
        SEOMeta.objects.create(blog_post=post, seo_title=post.title)


ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'}


class RichTextImageUploadView(APIView):
    """Backs the rich-text editor's 'insert image' button — a plain file
    upload, not tied to any model (the URL it returns just gets embedded as
    an <img src> inside whatever rich-text field the SEO team is editing)."""

    permission_classes = [IsSEOTeamMember]
    parser_classes = [MultiPartParser]

    def post(self, request):
        file = request.FILES.get('image')
        if not file:
            return Response({'error': 'No image file provided.'}, status=400)

        ext = os.path.splitext(file.name)[1].lower()
        if ext not in ALLOWED_IMAGE_EXTENSIONS:
            return Response({'error': f'Unsupported file type "{ext}".'}, status=400)

        filename = f'{uuid.uuid4().hex}{ext}'
        path = default_storage.save(f'rich_text/{filename}', file)
        url = default_storage.url(path)
        return Response({'url': request.build_absolute_uri(url)}, status=201)


class DashboardStatsView(APIView):
    permission_classes = [IsSEOTeamMember]

    def get(self, request):
        total = Page.objects.count()
        published = Page.objects.filter(status=Page.STATUS_PUBLISHED).count()
        draft = Page.objects.filter(status=Page.STATUS_DRAFT).count()

        page_seo = SEOMeta.objects.filter(page__isnull=False)
        missing_title = page_seo.filter(Q(seo_title='') | Q(seo_title__isnull=True)).count()
        missing_description = page_seo.filter(Q(meta_description='') | Q(meta_description__isnull=True)).count()
        missing_keyword = page_seo.filter(Q(focus_keyword='') | Q(focus_keyword__isnull=True)).count()

        total_blog_posts = BlogPost.objects.count()
        published_blog_posts = BlogPost.objects.filter(status=BlogPost.STATUS_PUBLISHED).count()

        return Response({
            'total_pages': total,
            'published_pages': published,
            'total_blog_posts': total_blog_posts,
            'published_blog_posts': published_blog_posts,
            'draft_pages': draft,
            'missing_seo_title': missing_title,
            'missing_meta_description': missing_description,
            'missing_focus_keyword': missing_keyword,
        })

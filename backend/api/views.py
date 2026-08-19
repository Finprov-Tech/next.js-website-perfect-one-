from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny

from api.serializers import (
    BannerSerializer,
    BlogCategorySerializer,
    BlogPostDetailSerializer,
    BlogPostListSerializer,
    AuthorDetailSerializer,
    CourseSectionSerializer,
    CredentialsSerializer,
    CTASerializer,
    FAQItemSerializer,
    PageDetailSerializer,
    PageListSerializer,
    PartnerLogoSerializer,
    PlacementSectionSerializer,
    RedirectSerializer,
    ScrollSectionSerializer,
    SiteSettingsSerializer,
    TestimonialSerializer,
    WhyFinprovSectionSerializer,
)
from blog.models import BlogCategory, BlogPost, Author
from core.models import SiteSettings
from modules.models import (
    CTA,
    Banner,
    CourseSection,
    Credentials,
    FAQItem,
    PartnerLogo,
    PlacementSection,
    ScrollSection,
    Testimonial,
    WhyFinprovSection,
)
from pages.models import Page
from seo.models import Redirect
from courses.models import Course, CourseAlias
from courses.serializers import CourseDetailSerializer, CourseListSerializer


class PageViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/v1/pages/ and GET /api/v1/pages/{slug}/ — the main endpoints the
    Next.js frontend will consume: published pages, looked up by slug."""

    queryset = Page.objects.filter(status=Page.STATUS_PUBLISHED).select_related('page_type', 'seo')
    lookup_field = 'slug'
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PageDetailSerializer
        return PageListSerializer


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    pagination_class = None

    def get_queryset(self):
        return Course.objects.filter(status=Course.STATUS_PUBLISHED, is_active=True).select_related('category', 'program_type', 'seo').prefetch_related(
            'aliases', 'highlights', 'tools', 'hiring_partners', 'skills', 'audiences', 'job_opportunities',
            'certifications', 'career_prospects', 'curriculum_modules__topics', 'faqs',
        )

    def get_serializer_class(self):
        return CourseDetailSerializer if self.action == 'retrieve' else CourseListSerializer

    def get_object(self):
        slug = self.kwargs[self.lookup_field]
        course = self.get_queryset().filter(slug=slug).first()
        if course:
            return course
        alias = CourseAlias.objects.select_related('course').filter(slug=slug, course__status=Course.STATUS_PUBLISHED, course__is_active=True).first()
        if alias:
            return alias.course
        return super().get_object()


class ActiveModuleViewSet(viewsets.ReadOnlyModelViewSet):
    """Shared base for the flat, per-module-type debug/admin-tooling endpoints."""

    permission_classes = [AllowAny]

    def get_queryset(self):
        return self.queryset.filter(is_active=True)


class BannerViewSet(ActiveModuleViewSet):
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer


class ScrollSectionViewSet(ActiveModuleViewSet):
    queryset = ScrollSection.objects.all()
    serializer_class = ScrollSectionSerializer


class CredentialsViewSet(ActiveModuleViewSet):
    queryset = Credentials.objects.all()
    serializer_class = CredentialsSerializer


class PlacementSectionViewSet(ActiveModuleViewSet):
    queryset = PlacementSection.objects.all()
    serializer_class = PlacementSectionSerializer


class CTAViewSet(ActiveModuleViewSet):
    queryset = CTA.objects.all()
    serializer_class = CTASerializer


class TestimonialViewSet(ActiveModuleViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer


class PartnerLogoViewSet(ActiveModuleViewSet):
    queryset = PartnerLogo.objects.all()
    serializer_class = PartnerLogoSerializer


class FAQItemViewSet(ActiveModuleViewSet):
    queryset = FAQItem.objects.all()
    serializer_class = FAQItemSerializer


class CourseSectionViewSet(ActiveModuleViewSet):
    queryset = CourseSection.objects.all()
    serializer_class = CourseSectionSerializer


class WhyFinprovSectionViewSet(ActiveModuleViewSet):
    queryset = WhyFinprovSection.objects.all()
    serializer_class = WhyFinprovSectionSerializer


class RedirectViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/v1/redirects/ — active redirects, consumed by the Next.js middleware."""

    queryset = Redirect.objects.filter(is_active=True)
    serializer_class = RedirectSerializer
    permission_classes = [AllowAny]
    pagination_class = None


class SiteSettingsView(generics.RetrieveAPIView):
    """GET /api/v1/site-settings/ — the singleton SiteSettings row."""

    serializer_class = SiteSettingsSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        return SiteSettings.load()


class BlogCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySerializer
    permission_classes = [AllowAny]
    pagination_class = None


class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/v1/blog/posts/ and GET /api/v1/blog/posts/{slug}/ — published
    blog posts, looked up by slug. Mirrors PageViewSet's list/detail split."""

    queryset = BlogPost.objects.filter(status=BlogPost.STATUS_PUBLISHED).select_related('category', 'seo')
    lookup_field = 'slug'
    permission_classes = [AllowAny]
    pagination_class = None

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return BlogPostDetailSerializer
        return BlogPostListSerializer


class AuthorViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/v1/blog/authors/{slug}/ — author profile and published posts."""

    queryset = Author.objects.filter(posts__status=BlogPost.STATUS_PUBLISHED).distinct()
    lookup_field = 'slug'
    permission_classes = [AllowAny]
    pagination_class = None
    serializer_class = AuthorDetailSerializer

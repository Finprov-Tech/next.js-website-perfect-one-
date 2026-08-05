from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from api.serializers import (
    BannerSerializer,
    CourseSectionSerializer,
    CredentialsSerializer,
    CTASerializer,
    FAQItemSerializer,
    PageDetailSerializer,
    PageListSerializer,
    PartnerLogoSerializer,
    PlacementSectionSerializer,
    ScrollSectionSerializer,
    TestimonialSerializer,
    WhyFinprovSectionSerializer,
)
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

from rest_framework.routers import DefaultRouter

from api.views import (
    BannerViewSet,
    CourseSectionViewSet,
    CredentialsViewSet,
    CTAViewSet,
    FAQItemViewSet,
    PageViewSet,
    PartnerLogoViewSet,
    PlacementSectionViewSet,
    ScrollSectionViewSet,
    TestimonialViewSet,
    WhyFinprovSectionViewSet,
)

router = DefaultRouter()
router.register('pages', PageViewSet, basename='page')
router.register('modules/banners', BannerViewSet, basename='banner')
router.register('modules/scroll-sections', ScrollSectionViewSet, basename='scroll-section')
router.register('modules/credentials', CredentialsViewSet, basename='credentials')
router.register('modules/course-sections', CourseSectionViewSet, basename='course-section')
router.register('modules/why-finprov', WhyFinprovSectionViewSet, basename='why-finprov')
router.register('modules/placement-sections', PlacementSectionViewSet, basename='placement-section')
router.register('modules/ctas', CTAViewSet, basename='cta')
router.register('modules/testimonials', TestimonialViewSet, basename='testimonial')
router.register('modules/partner-logos', PartnerLogoViewSet, basename='partner-logo')
router.register('modules/faqs', FAQItemViewSet, basename='faq')

urlpatterns = router.urls

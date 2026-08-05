from django.urls import path
from rest_framework.routers import DefaultRouter

from api.views import (
    BannerViewSet,
    BlogCategoryViewSet,
    BlogPostViewSet,
    CourseSectionViewSet,
    CredentialsViewSet,
    CTAViewSet,
    FAQItemViewSet,
    PageViewSet,
    PartnerLogoViewSet,
    PlacementSectionViewSet,
    RedirectViewSet,
    ScrollSectionViewSet,
    SiteSettingsView,
    TestimonialViewSet,
    WhyFinprovSectionViewSet,
)

router = DefaultRouter()
router.register('pages', PageViewSet, basename='page')
router.register('blog/categories', BlogCategoryViewSet, basename='blog-category')
router.register('blog/posts', BlogPostViewSet, basename='blog-post')
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
router.register('redirects', RedirectViewSet, basename='redirect')

urlpatterns = router.urls + [
    path('site-settings/', SiteSettingsView.as_view(), name='site-settings'),
]

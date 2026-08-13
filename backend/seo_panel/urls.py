from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from seo_panel.views import (
    AuthorSEOPanelViewSet,
    BannerSEOPanelViewSet,
    BlogCategorySEOPanelViewSet,
    BlogPostSectionSEOPanelViewSet,
    BlogPostSEOPanelViewSet,
    CourseCardSEOPanelViewSet,
    RichTextImageUploadView,
    CourseSectionSEOPanelViewSet,
    CredentialItemSEOPanelViewSet,
    CredentialsSEOPanelViewSet,
    CTASEOPanelViewSet,
    DashboardStatsView,
    FAQItemSEOPanelViewSet,
    FeatureCardSEOPanelViewSet,
    GalleryImageSEOPanelViewSet,
    HistoryMilestoneSEOPanelViewSet,
    HistorySectionSEOPanelViewSet,
    LandingPageBodySEOPanelViewSet,
    LegalSectionSEOPanelViewSet,
    LifeAtFinprovSectionSEOPanelViewSet,
    PageSEOPanelViewSet,
    PartnerLogoSEOPanelViewSet,
    PlacementSectionSEOPanelViewSet,
    PlacementStatSEOPanelViewSet,
    QuizOptionSEOPanelViewSet,
    RedirectSEOPanelViewSet,
    QuizQuestionSEOPanelViewSet,
    QuizSEOPanelViewSet,
    ScrollItemSEOPanelViewSet,
    ScrollSectionSEOPanelViewSet,
    SEOMetaSEOPanelViewSet,
    TeamMemberSEOPanelViewSet,
    TeamSectionSEOPanelViewSet,
    TestimonialSEOPanelViewSet,
    WhyFinprovSectionSEOPanelViewSet,
    CourseSEOPanelViewSet, CourseCategorySEOPanelViewSet, CourseProgramTypeSEOPanelViewSet,
    CourseAliasSEOPanelViewSet, CourseHighlightSEOPanelViewSet, CourseToolSEOPanelViewSet,
    CourseHiringPartnerSEOPanelViewSet, CourseSkillSEOPanelViewSet, CourseAudienceSEOPanelViewSet,
    CourseJobOpportunitySEOPanelViewSet, CourseCertificationSEOPanelViewSet,
    CourseCareerProspectSEOPanelViewSet, CourseCurriculumModuleSEOPanelViewSet,
    CourseCurriculumTopicSEOPanelViewSet, CourseFAQSEOPanelViewSet, CourseReviewIssueSEOPanelViewSet,
)

router = DefaultRouter()
router.register('pages', PageSEOPanelViewSet, basename='seo-panel-page')
router.register('seo-meta', SEOMetaSEOPanelViewSet, basename='seo-panel-seo-meta')
router.register('redirects', RedirectSEOPanelViewSet, basename='seo-panel-redirect')
router.register('modules/banners', BannerSEOPanelViewSet, basename='seo-panel-banner')
router.register('modules/credentials', CredentialsSEOPanelViewSet, basename='seo-panel-credentials')
router.register('modules/credential-items', CredentialItemSEOPanelViewSet, basename='seo-panel-credential-item')
router.register('modules/scroll-sections', ScrollSectionSEOPanelViewSet, basename='seo-panel-scroll-section')
router.register('modules/scroll-items', ScrollItemSEOPanelViewSet, basename='seo-panel-scroll-item')
router.register('modules/course-sections', CourseSectionSEOPanelViewSet, basename='seo-panel-course-section')
router.register('modules/course-cards', CourseCardSEOPanelViewSet, basename='seo-panel-course-card')
router.register('modules/why-finprov', WhyFinprovSectionSEOPanelViewSet, basename='seo-panel-why-finprov')
router.register('modules/feature-cards', FeatureCardSEOPanelViewSet, basename='seo-panel-feature-card')
router.register('modules/placement-sections', PlacementSectionSEOPanelViewSet, basename='seo-panel-placement-section')
router.register('modules/placement-stats', PlacementStatSEOPanelViewSet, basename='seo-panel-placement-stat')
router.register('modules/ctas', CTASEOPanelViewSet, basename='seo-panel-cta')
router.register('modules/testimonials', TestimonialSEOPanelViewSet, basename='seo-panel-testimonial')
router.register('modules/partner-logos', PartnerLogoSEOPanelViewSet, basename='seo-panel-partner-logo')
router.register('modules/faqs', FAQItemSEOPanelViewSet, basename='seo-panel-faq')
router.register('modules/quizzes', QuizSEOPanelViewSet, basename='seo-panel-quiz')
router.register('modules/quiz-questions', QuizQuestionSEOPanelViewSet, basename='seo-panel-quiz-question')
router.register('modules/quiz-options', QuizOptionSEOPanelViewSet, basename='seo-panel-quiz-option')
router.register('modules/team-sections', TeamSectionSEOPanelViewSet, basename='seo-panel-team-section')
router.register('modules/team-members', TeamMemberSEOPanelViewSet, basename='seo-panel-team-member')
router.register('modules/life-at-finprov', LifeAtFinprovSectionSEOPanelViewSet, basename='seo-panel-life-at-finprov')
router.register('modules/gallery-images', GalleryImageSEOPanelViewSet, basename='seo-panel-gallery-image')
router.register('modules/legal-sections', LegalSectionSEOPanelViewSet, basename='seo-panel-legal-section')
router.register('modules/landing-page-bodies', LandingPageBodySEOPanelViewSet, basename='seo-panel-landing-page-body')
router.register('modules/history-sections', HistorySectionSEOPanelViewSet, basename='seo-panel-history-section')
router.register('modules/history-milestones', HistoryMilestoneSEOPanelViewSet, basename='seo-panel-history-milestone')
router.register('courses', CourseSEOPanelViewSet, basename='seo-panel-course')
router.register('course-categories', CourseCategorySEOPanelViewSet, basename='seo-panel-course-category')
router.register('course-program-types', CourseProgramTypeSEOPanelViewSet, basename='seo-panel-course-program-type')
router.register('course-aliases', CourseAliasSEOPanelViewSet, basename='seo-panel-course-alias')
router.register('course-highlights', CourseHighlightSEOPanelViewSet, basename='seo-panel-course-highlight')
router.register('course-tools', CourseToolSEOPanelViewSet, basename='seo-panel-course-tool')
router.register('course-hiring-partners', CourseHiringPartnerSEOPanelViewSet, basename='seo-panel-course-hiring-partner')
router.register('course-skills', CourseSkillSEOPanelViewSet, basename='seo-panel-course-skill')
router.register('course-audiences', CourseAudienceSEOPanelViewSet, basename='seo-panel-course-audience')
router.register('course-job-opportunities', CourseJobOpportunitySEOPanelViewSet, basename='seo-panel-course-job-opportunity')
router.register('course-certifications', CourseCertificationSEOPanelViewSet, basename='seo-panel-course-certification')
router.register('course-career-prospects', CourseCareerProspectSEOPanelViewSet, basename='seo-panel-course-career-prospect')
router.register('course-curriculum-modules', CourseCurriculumModuleSEOPanelViewSet, basename='seo-panel-course-curriculum-module')
router.register('course-curriculum-topics', CourseCurriculumTopicSEOPanelViewSet, basename='seo-panel-course-curriculum-topic')
router.register('course-faqs', CourseFAQSEOPanelViewSet, basename='seo-panel-course-faq')
router.register('course-review-issues', CourseReviewIssueSEOPanelViewSet, basename='seo-panel-course-review-issue')
router.register('blog-posts', BlogPostSEOPanelViewSet, basename='seo-panel-blog-post')
router.register('blog-post-sections', BlogPostSectionSEOPanelViewSet, basename='seo-panel-blog-post-section')
router.register('blog-categories', BlogCategorySEOPanelViewSet, basename='seo-panel-blog-category')
router.register('authors', AuthorSEOPanelViewSet, basename='seo-panel-author')

urlpatterns = router.urls + [
    path('auth/token/', TokenObtainPairView.as_view(), name='seo-panel-token'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='seo-panel-token-refresh'),
    path('dashboard/stats/', DashboardStatsView.as_view(), name='seo-panel-dashboard-stats'),
    path('media/upload/', RichTextImageUploadView.as_view(), name='seo-panel-media-upload'),
]

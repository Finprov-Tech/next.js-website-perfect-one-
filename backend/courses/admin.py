from django.contrib import admin

from courses.models import Course, CourseCategory, CourseProgramType, CourseReviewIssue


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'program_type', 'status', 'needs_content_review', 'needs_url_review')
    list_filter = ('status', 'category', 'program_type', 'needs_content_review', 'needs_url_review')
    search_fields = ('title', 'slug')


admin.site.register(CourseCategory)
admin.site.register(CourseProgramType)


@admin.register(CourseReviewIssue)
class CourseReviewIssueAdmin(admin.ModelAdmin):
    list_display = ('course', 'category', 'field_name', 'status', 'blocking', 'reviewed_by', 'reviewed_at')
    list_filter = ('category', 'status', 'blocking')
    search_fields = ('course__title', 'course__slug', 'summary', 'field_name')
    readonly_fields = ('issue_key', 'details', 'reviewed_by', 'reviewed_at', 'created_at', 'updated_at')

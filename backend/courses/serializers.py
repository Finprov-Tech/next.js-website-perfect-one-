from rest_framework import serializers

from courses.models import (
    Course, CourseAudience, CourseCareerProspect, CourseCertification, CourseCurriculumModule,
    CourseFAQ, CourseHighlight, CourseHiringPartner, CourseJobOpportunity, CourseSkill, CourseTool,
)


class TextItemSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ['id', 'text', 'display_order']


def text_serializer(model):
    return type(f'{model.__name__}Serializer', (TextItemSerializer,), {'Meta': type('Meta', (TextItemSerializer.Meta,), {'model': model})})


CourseHighlightSerializer = text_serializer(CourseHighlight)
CourseToolSerializer = text_serializer(CourseTool)
CourseHiringPartnerSerializer = text_serializer(CourseHiringPartner)
CourseSkillSerializer = text_serializer(CourseSkill)
CourseAudienceSerializer = text_serializer(CourseAudience)
CourseJobOpportunitySerializer = text_serializer(CourseJobOpportunity)
CourseCertificationSerializer = text_serializer(CourseCertification)
CourseCareerProspectSerializer = text_serializer(CourseCareerProspect)


class CurriculumModuleSerializer(serializers.ModelSerializer):
    topics = serializers.SerializerMethodField()

    class Meta:
        model = CourseCurriculumModule
        fields = ['id', 'title', 'topics', 'display_order']

    def get_topics(self, obj):
        return [row.text for row in obj.topics.filter(is_active=True)]


class CourseFAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseFAQ
        fields = ['id', 'question', 'answer', 'display_order']


class CourseListSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='category.name')
    program_type = serializers.CharField(source='program_type.name')

    class Meta:
        model = Course
        fields = ['id', 'slug', 'title', 'category', 'program_type', 'badge', 'badge_css_class', 'duration',
                  'mode', 'tool_summary', 'short_description', 'image', 'image_alt', 'display_order', 'updated_at']


class CourseDetailSerializer(CourseListSerializer):
    aliases = serializers.SlugRelatedField(many=True, read_only=True, slug_field='slug')
    highlights = CourseHighlightSerializer(many=True, read_only=True)
    tools = CourseToolSerializer(many=True, read_only=True)
    hiring_partners = CourseHiringPartnerSerializer(many=True, read_only=True)
    skills = CourseSkillSerializer(many=True, read_only=True)
    audiences = CourseAudienceSerializer(many=True, read_only=True)
    job_opportunities = CourseJobOpportunitySerializer(many=True, read_only=True)
    certifications = CourseCertificationSerializer(many=True, read_only=True)
    career_prospects = CourseCareerProspectSerializer(many=True, read_only=True)
    curriculum_modules = CurriculumModuleSerializer(many=True, read_only=True)
    faqs = CourseFAQSerializer(many=True, read_only=True)
    seo = serializers.SerializerMethodField()

    class Meta(CourseListSerializer.Meta):
        fields = CourseListSerializer.Meta.fields + [
            'hero_description', 'snapshot_text', 'online_fees', 'offline_fees', 'fee_summary', 'eligibility',
            'hours_of_learning', 'industry_projects', 'tools_used_stat', 'syllabus_pdf', 'syllabus_button_text',
            'aliases', 'highlights', 'tools', 'hiring_partners', 'skills', 'audiences', 'job_opportunities',
            'certifications', 'career_prospects', 'curriculum_modules', 'faqs', 'seo',
        ]

    def get_seo(self, obj):
        try:
            seo = obj.seo
        except Exception:
            return None
        return {field: getattr(seo, field) for field in ('seo_title', 'meta_description', 'focus_keyword', 'canonical_url', 'meta_robots', 'og_title', 'og_description', 'og_url', 'schema_type', 'include_in_sitemap')}

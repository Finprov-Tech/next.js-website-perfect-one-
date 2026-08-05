from django import forms
from django.apps import apps
from django.contrib import admin

from core.admin import image_preview
from core.admin_site import cms_admin_site
from core.models import HeadingFieldsMixin
from seo.models import Redirect, SEOMeta

TITLE_MIN, TITLE_MAX = 50, 60
DESCRIPTION_MIN, DESCRIPTION_MAX = 150, 160


class SEOMetaAdminForm(forms.ModelForm):
    """Collects non-blocking SEO quality warnings on `clean()` (does not raise —
    duplicate keyword, missing fields, and length checks must warn, not block
    publishing). `PageAdmin.save_formset` reads `instance._seo_warnings` after
    save and surfaces them via `django.contrib.messages`."""

    class Meta:
        model = SEOMeta
        fields = '__all__'

    def clean(self):
        cleaned = super().clean()
        warnings = []

        focus_keyword = cleaned.get('focus_keyword')
        if not focus_keyword:
            warnings.append('SEO: no focus keyword set.')
        else:
            dupes = SEOMeta.objects.filter(focus_keyword__iexact=focus_keyword)
            if self.instance.pk:
                dupes = dupes.exclude(pk=self.instance.pk)
            dupe_names = list(dupes.select_related('page').values_list('page__name', flat=True))
            if dupe_names:
                warnings.append(
                    f"SEO: focus keyword '{focus_keyword}' is also used on: {', '.join(dupe_names)}."
                )

        seo_title = cleaned.get('seo_title')
        if not seo_title:
            warnings.append('SEO: no SEO title set.')
        elif not (TITLE_MIN <= len(seo_title) <= TITLE_MAX):
            warnings.append(
                f'SEO: title is {len(seo_title)} characters (recommended {TITLE_MIN}-{TITLE_MAX}).'
            )

        meta_description = cleaned.get('meta_description')
        if not meta_description:
            warnings.append('SEO: no meta description set.')
        elif not (DESCRIPTION_MIN <= len(meta_description) <= DESCRIPTION_MAX):
            warnings.append(
                f'SEO: meta description is {len(meta_description)} characters '
                f'(recommended {DESCRIPTION_MIN}-{DESCRIPTION_MAX}).'
            )

        schema_type = cleaned.get('schema_type')
        if not schema_type or schema_type == 'none':
            warnings.append('SEO: no schema type selected.')

        self.instance._seo_warnings = warnings
        return cleaned


class SEOMetaInline(admin.StackedInline):
    model = SEOMeta
    form = SEOMetaAdminForm
    can_delete = False
    fieldsets = (
        ('General SEO', {
            'fields': ('seo_title', 'meta_description', 'focus_keyword', 'canonical_url', 'meta_robots', 'h1_status'),
        }),
        ('Social Sharing', {
            'fields': ('og_title', 'og_description', 'og_image', 'og_image_preview', 'og_url'),
        }),
        ('Schema', {
            'fields': ('schema_type', 'custom_schema_json'),
            'description': 'If "Custom schema JSON" is filled in, it always overrides the auto-generated '
                            'schema for the selected type on the live site.',
        }),
        ('Sitemap', {
            'fields': ('include_in_sitemap',),
        }),
        ('Content SEO', {
            'fields': ('author_name', 'author_bio', 'author_image', 'author_image_preview', 'word_count'),
            'description': 'Author fields apply to blog-type pages only.',
        }),
    )
    readonly_fields = ('og_image_preview', 'author_image_preview', 'h1_status')

    class Media:
        js = ('seo/admin/seo_counters.js',)
        css = {'all': ('seo/admin/seo_counters.css',)}

    def og_image_preview(self, obj):
        return image_preview(obj, 'og_image')

    def author_image_preview(self, obj):
        return image_preview(obj, 'author_image')

    @admin.display(description='H1 heading')
    def h1_status(self, obj):
        if not obj or not obj.pk or not obj.page_id:
            return 'Save the page first to check.'
        for model in apps.get_models():
            if issubclass(model, HeadingFieldsMixin) and hasattr(model, 'page'):
                if model.objects.filter(page_id=obj.page_id, heading_level='h1', is_active=True).exists():
                    return 'OK — an H1 heading exists on this page.'
        return 'Warning: no module on this page has its heading level set to H1.'


@admin.register(Redirect, site=cms_admin_site)
class RedirectAdmin(admin.ModelAdmin):
    list_display = ('old_path', 'new_path', 'redirect_type', 'is_active', 'chain_warning', 'created_at')
    list_filter = ('redirect_type', 'is_active')
    list_editable = ('is_active',)
    search_fields = ('old_path', 'new_path')
    readonly_fields = ('created_at',)

    @admin.display(description='Chain?')
    def chain_warning(self, obj):
        if Redirect.objects.filter(old_path=obj.new_path).exclude(pk=obj.pk).exists():
            return 'Warning: chained redirect'
        return ''

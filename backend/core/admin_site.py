from django.contrib.admin import AdminSite


class CMSAdminSite(AdminSite):
    site_header = 'Finprov CMS'
    site_title = 'Finprov CMS Admin'
    index_title = 'Content Management'

    # Apps listed here (by app_label) are shown first, in this order; everything
    # else (e.g. Django's built-in "auth" app) is appended afterwards.
    APP_ORDER = ['pages', 'modules', 'seo', 'core']

    def get_app_list(self, request, app_label=None):
        app_list = super().get_app_list(request, app_label=app_label)
        order = {label: i for i, label in enumerate(self.APP_ORDER)}
        return sorted(app_list, key=lambda app: order.get(app['app_label'], len(order)))


cms_admin_site = CMSAdminSite(name='cms_admin')

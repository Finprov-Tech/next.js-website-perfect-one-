from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path

from core.admin_site import cms_admin_site

urlpatterns = [
    path('admin/', cms_admin_site.urls),
    path('api/v1/', include('api.urls')),
    path('', include('accounts.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

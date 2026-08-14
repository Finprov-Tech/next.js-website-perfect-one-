from django.conf import settings


def frontend_url_for(slug):
    """Builds the live public URL for a page's slug — mirrors the frontend's
    own internal-link convention (resolveCmsLink in lib/cms.ts): the home
    page is '/', everything else is '/<slug>'."""
    path = '' if slug == 'home' else f'/{slug}'
    return f'{settings.FRONTEND_BASE_URL}{path}'


def frontend_url_for_blog_post(slug):
    return f'{settings.FRONTEND_BASE_URL}/blog/{slug}'


def frontend_url_for_course(slug):
    return f'{settings.FRONTEND_BASE_URL}/courses/{slug}'

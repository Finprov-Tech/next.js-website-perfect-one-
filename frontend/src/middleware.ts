import { NextResponse, type NextRequest } from "next/server";

const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || "http://127.0.0.1:8000";
type RedirectRow = { old_path: string; new_path: string; redirect_type: 301 | 302 };

// Edge Middleware doesn't reliably honor Next's `fetch` data cache, so this
// keeps its own module-level TTL cache rather than relying on `next.revalidate`.
async function getRedirectMap(): Promise<Map<string, RedirectRow>> {
  const map = new Map<string, RedirectRow>();
  try {
    const res = await fetch(`${CMS_API_URL}/api/v1/redirects/`, { cache: "no-store" });
    if (res.ok) {
      const payload = (await res.json()) as RedirectRow[] | { results?: RedirectRow[] };
      const rows = Array.isArray(payload) ? payload : (payload.results ?? []);
      for (const row of rows) {
        map.set(row.old_path, row);
      }
    }
  } catch {
    // CMS unreachable — fall through with an empty map; don't block requests.
  }

  return map;
}

function normalizePath(pathname: string): string {
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

const CONTACT_CANONICAL = "/contact/";

export async function middleware(request: NextRequest) {
  const pathname = normalizePath(request.nextUrl.pathname);

  // Migrated WP slug — must not override the dedicated Next.js contact page (map + form).
  if (pathname === "/contact-us/") {
    return NextResponse.redirect(new URL(CONTACT_CANONICAL, request.url), 301);
  }

  const redirects = await getRedirectMap();
  const match = redirects.get(pathname);

  if (match) {
    // WordPress imported /contact/ → /contact-us/ breaks our dedicated /contact route.
    if (pathname === CONTACT_CANONICAL && normalizePath(match.new_path) === "/contact-us/") {
      return NextResponse.next();
    }
    const destination = normalizePath(match.new_path) === "/contact-us/" ? CONTACT_CANONICAL : match.new_path;
    return NextResponse.redirect(new URL(destination, request.url), match.redirect_type);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|api/|.*\\.[\\w]+$).*)"],
};

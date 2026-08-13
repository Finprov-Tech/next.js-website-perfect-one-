import { NextResponse, type NextRequest } from "next/server";

const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || "http://127.0.0.1:8000";
const CACHE_TTL_MS = 5 * 60 * 1000;

type RedirectRow = { old_path: string; new_path: string; redirect_type: 301 | 302 };

let cache: { map: Map<string, RedirectRow>; expiresAt: number } | null = null;

// Edge Middleware doesn't reliably honor Next's `fetch` data cache, so this
// keeps its own module-level TTL cache rather than relying on `next.revalidate`.
async function getRedirectMap(): Promise<Map<string, RedirectRow>> {
  if (cache && cache.expiresAt > Date.now()) {
    return cache.map;
  }

  const map = new Map<string, RedirectRow>();
  try {
    const res = await fetch(`${CMS_API_URL}/api/v1/redirects/`);
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

  cache = { map, expiresAt: Date.now() + CACHE_TTL_MS };
  return map;
}

function normalizePath(pathname: string): string {
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export async function middleware(request: NextRequest) {
  const redirects = await getRedirectMap();
  const match = redirects.get(normalizePath(request.nextUrl.pathname));

  if (match) {
    return NextResponse.redirect(new URL(match.new_path, request.url), match.redirect_type);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|api/|.*\\.[\\w]+$).*)"],
};

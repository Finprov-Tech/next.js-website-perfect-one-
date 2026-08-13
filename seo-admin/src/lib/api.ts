import "server-only";

import { getAccessToken, getRefreshToken, setSessionCookies } from "@/lib/session";

const DJANGO_API_URL = process.env.DJANGO_API_URL ?? "http://127.0.0.1:8000";

export class SessionExpiredError extends Error {
  constructor() {
    super("SEO panel session expired — please log in again.");
    this.name = "SessionExpiredError";
  }
}

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown) {
    super(`Django API request failed with status ${status}`);
    this.status = status;
    this.body = body;
  }
}

async function refreshAccessToken(): Promise<string> {
  const refresh = await getRefreshToken();
  if (!refresh) throw new SessionExpiredError();

  const res = await fetch(`${DJANGO_API_URL}/api/v1/seo-panel/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
    cache: "no-store",
  });
  if (!res.ok) throw new SessionExpiredError();

  const data = (await res.json()) as { access: string };
  // SIMPLE_JWT.ROTATE_REFRESH_TOKENS is on, but the refresh endpoint only
  // returns a new access token unless BLACKLIST rotation is also enabled —
  // re-set just the access cookie, keep the existing refresh cookie.
  await setSessionCookies(data.access, refresh);
  return data.access;
}

/** Server-side fetch to the Django SEO-panel API, with the session cookie's
 * JWT attached and one automatic refresh-and-retry on a 401. Never call this
 * from client code — it reads httpOnly cookies via next/headers. */
export async function djangoFetch(path: string, init: RequestInit = {}, _retried = false): Promise<Response> {
  const token = await getAccessToken();
  if (!token) throw new SessionExpiredError();

  const headers = new Headers(init.headers);
  const isFormData = typeof FormData !== "undefined" && init.body instanceof FormData;
  if (init.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${DJANGO_API_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (res.status === 401 && !_retried) {
    await refreshAccessToken();
    return djangoFetch(path, init, true);
  }

  return res;
}

export async function djangoJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await djangoFetch(path, init);
  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      // non-JSON error body — leave body as null
    }
    throw new ApiError(res.status, body);
  }
  return res.json() as Promise<T>;
}

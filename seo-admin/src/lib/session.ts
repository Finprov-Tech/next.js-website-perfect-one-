import { cookies } from "next/headers";

const ACCESS_COOKIE = "seo_access";
const REFRESH_COOKIE = "seo_refresh";

// Matches SIMPLE_JWT's ACCESS_TOKEN_LIFETIME / REFRESH_TOKEN_LIFETIME in
// backend/cms/settings.py — keep these in sync if that changes.
const ACCESS_MAX_AGE = 8 * 60 * 60;
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function setSessionCookies(access: string, refresh: string) {
  const store = await cookies();
  store.set(ACCESS_COOKIE, access, { ...cookieOptions, maxAge: ACCESS_MAX_AGE });
  store.set(REFRESH_COOKIE, refresh, { ...cookieOptions, maxAge: REFRESH_MAX_AGE });
}

export async function clearSessionCookies() {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}

export async function getAccessToken() {
  const store = await cookies();
  return store.get(ACCESS_COOKIE)?.value ?? null;
}

export async function getRefreshToken() {
  const store = await cookies();
  return store.get(REFRESH_COOKIE)?.value ?? null;
}

import { NextResponse } from "next/server";
import { setSessionCookies } from "@/lib/session";

const DJANGO_API_URL = process.env.DJANGO_API_URL ?? "http://127.0.0.1:8000";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  const res = await fetch(`${DJANGO_API_URL}/api/v1/seo-panel/auth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
  }

  const data = (await res.json()) as { access: string; refresh: string };

  // A valid Django login doesn't imply SEO Team membership — IsSEOTeamMember
  // would reject every real request later anyway, but checking here gives a
  // clear message immediately instead of a confusing "logged in, but
  // everything 403s" experience.
  const permCheck = await fetch(`${DJANGO_API_URL}/api/v1/seo-panel/dashboard/stats/`, {
    headers: { Authorization: `Bearer ${data.access}` },
    cache: "no-store",
  });
  if (!permCheck.ok) {
    return NextResponse.json(
      { error: "This account doesn't have access to the SEO panel." },
      { status: 403 },
    );
  }

  await setSessionCookies(data.access, data.refresh);

  return NextResponse.json({ ok: true });
}

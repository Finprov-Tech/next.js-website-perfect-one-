import { NextResponse, type NextRequest } from "next/server";
import { djangoFetch, SessionExpiredError } from "@/lib/api";

/** A single catch-all proxy for every seo_panel endpoint (GET/PATCH/POST/
 * DELETE) instead of one Next.js route file per Django endpoint — the
 * client never calls Django directly, only this, so the JWT never leaves
 * the server. Path/method/body pass through as-is; djangoFetch attaches
 * the Authorization header (with refresh-on-401) from the session cookie. */
async function proxy(request: NextRequest, path: string[]) {
  const search = request.nextUrl.search;
  const targetPath = `/api/v1/seo-panel/${path.join("/")}/${search}`;

  const hasBody = request.method !== "GET" && request.method !== "DELETE";
  const contentType = request.headers.get("content-type") ?? "";
  let body: BodyInit | undefined;
  let headers: Record<string, string> | undefined;

  if (hasBody && contentType.includes("multipart/form-data")) {
    body = await request.formData();
  } else if (hasBody) {
    body = await request.text();
    headers = { "Content-Type": "application/json" };
  }

  try {
    const res = await djangoFetch(targetPath, { method: request.method, body, headers });
    const responseBody = res.status === 204 ? null : await res.text();
    return new NextResponse(responseBody, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
    });
  } catch (err) {
    if (err instanceof SessionExpiredError) {
      return NextResponse.json({ error: "Session expired — please log in again." }, { status: 401 });
    }
    throw err;
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await params).path);
}
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await params).path);
}
export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await params).path);
}
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(request, (await params).path);
}

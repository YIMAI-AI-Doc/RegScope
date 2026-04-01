import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthSecret, getIngestSecret } from "@/lib/auth-secrets";
import { canAccessOpsRoute } from "@/lib/permissions";

function isProtectedWriteApi(pathname: string, method: string) {
  if (method !== "POST" && method !== "DELETE") {
    return false;
  }

  if (pathname === "/api/follows") {
    return method === "POST" || method === "DELETE";
  }

  if (pathname === "/api/discussions") {
    return method === "POST";
  }

  if (/^\/api\/discussions\/[^/]+\/answers$/.test(pathname)) {
    return method === "POST";
  }

  if (/^\/api\/answers\/[^/]+\/(vote|accept)$/.test(pathname)) {
    return method === "POST";
  }

  return false;
}

function unauthorizedJson() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function redirectToSignIn(request: NextRequest) {
  const signInUrl = new URL("/api/auth/signin", request.url);
  signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(signInUrl);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/api/ingest/run" && request.method === "POST") {
    const secret = request.headers.get("x-regscope-ingest-secret");
    if (secret && secret === getIngestSecret()) {
      return NextResponse.next();
    }

    const token = await getToken({ req: request, secret: getAuthSecret() });
    if (canAccessOpsRoute((token as { role?: string } | null)?.role)) {
      return NextResponse.next();
    }

    return unauthorizedJson();
  }

  if (pathname === "/me/follows") {
    const token = await getToken({ req: request, secret: getAuthSecret() });
    if (token?.email) {
      return NextResponse.next();
    }

    return redirectToSignIn(request);
  }

  if (isProtectedWriteApi(pathname, request.method)) {
    const token = await getToken({ req: request, secret: getAuthSecret() });
    if (token?.email) {
      return NextResponse.next();
    }

    return unauthorizedJson();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/me/follows",
    "/api/follows",
    "/api/answers/:path*",
    "/api/discussions",
    "/api/discussions/:path*",
    "/api/ingest/run",
  ],
};

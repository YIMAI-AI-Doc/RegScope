import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getAuthSecret, getIngestSecret } from "@/lib/auth";
import { runAllFeeds } from "@/workers/ingest/run-all-feeds";

async function isAuthorized(request: NextRequest) {
  const secret = request.headers.get("x-regscope-ingest-secret");
  if (secret && secret === getIngestSecret()) {
    return true;
  }

  const token = await getToken({ req: request, secret: getAuthSecret() });
  return (token as { role?: string } | null)?.role === "ADMIN";
}

export async function POST(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const report = await runAllFeeds();
  return NextResponse.json(report, { status: 200 });
}

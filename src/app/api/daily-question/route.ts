import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDailyQuizPanelData } from "@/lib/quiz/queries";

export async function GET() {
  const session = await getServerSession(authOptions);
  const panel = await getDailyQuizPanelData(session?.user?.id ?? null);

  if (!panel) {
    return NextResponse.json({ error: "当前暂无题目" }, { status: 404 });
  }

  return NextResponse.json(panel, { status: 200 });
}

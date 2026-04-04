import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { grantPetPoints } from "@/lib/pets/grant-points";
import { submitDailyQuizAnswer } from "@/lib/quiz/queries";

// TODO(divine-beast): Wire ARTICLE +3 to a dedicated user-authored article publishing route when RegScope adds one.
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录后作答" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const selection = Array.isArray(payload?.selection)
    ? payload.selection.filter((value): value is string => typeof value === "string")
    : typeof payload?.option === "string"
    ? [payload.option]
    : [];

  try {
    const result = await submitDailyQuizAnswer(session.user.id, selection);

    try {
      await grantPetPoints({
        userId: session.user.id,
        eventType: "DAILY_QUESTION",
        sourceId: result.dateKey,
        sourceType: "DAILY_QUESTION",
      });
    } catch (petError) {
      console.error("Failed to grant divine beast points after daily question answer", petError);
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "INVALID_OPTION") {
        return NextResponse.json({ error: "答题选项无效" }, { status: 400 });
      }
      if (error.message === "ALREADY_ANSWERED") {
        return NextResponse.json({ error: "今日已答题" }, { status: 409 });
      }
      if (error.message === "NO_QUESTION") {
        return NextResponse.json({ error: "当前暂无题目" }, { status: 404 });
      }
    }

    return NextResponse.json({ error: "提交失败，请稍后重试" }, { status: 500 });
  }
}

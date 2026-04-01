import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const MAX_DATA_URL_LENGTH = 200_000; // ~200KB base64

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const dataUrl = typeof body?.dataUrl === "string" ? body.dataUrl.trim() : null;

  if (!dataUrl || !dataUrl.startsWith("data:image/")) {
    return NextResponse.json({ error: "请上传图片文件" }, { status: 400 });
  }
  if (dataUrl.length > MAX_DATA_URL_LENGTH) {
    return NextResponse.json({ error: "图片过大，请压缩后再试（<200KB）" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { avatarUrl: dataUrl },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { avatarUrl: null },
  });

  return NextResponse.json({ ok: true });
}

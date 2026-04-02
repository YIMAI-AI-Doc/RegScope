import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import sharp from "sharp";

const MAX_UPLOAD_BYTES = 3 * 1024 * 1024; // 3MB upload cap
const TARGET_STORED_BYTES = 200 * 1024; // 200KB compressed target
const SIZE_STEPS = [512, 448, 384, 320] as const;
const QUALITY_STEPS = [82, 76, 70, 64, 58, 52, 46, 40] as const;

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

  const parsed = parseDataUrl(dataUrl);
  if (!parsed) {
    return NextResponse.json({ error: "图片格式不支持，请重试" }, { status: 400 });
  }
  if (parsed.buffer.length > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "图片过大，请上传小于 3MB 的图片" }, { status: 400 });
  }

  let compressed: Buffer;
  try {
    compressed = await compressAvatar(parsed.buffer);
  } catch {
    return NextResponse.json({ error: "图片处理失败，请更换图片后重试" }, { status: 400 });
  }
  const storedDataUrl = `data:image/webp;base64,${compressed.toString("base64")}`;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { avatarUrl: storedDataUrl },
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

function parseDataUrl(dataUrl: string): { buffer: Buffer } | null {
  const matched = dataUrl.match(/^data:image\/[a-zA-Z0-9.+-]+;base64,(.+)$/);
  if (!matched) return null;
  try {
    const buffer = Buffer.from(matched[1], "base64");
    if (buffer.length === 0) return null;
    return { buffer };
  } catch {
    return null;
  }
}

async function compressAvatar(inputBuffer: Buffer): Promise<Buffer> {
  let latest = await sharp(inputBuffer)
    .rotate()
    .resize(512, 512, { fit: "cover", position: "attention" })
    .webp({ quality: 80 })
    .toBuffer();

  for (const size of SIZE_STEPS) {
    for (const quality of QUALITY_STEPS) {
      const candidate = await sharp(inputBuffer)
        .rotate()
        .resize(size, size, { fit: "cover", position: "attention" })
        .webp({ quality })
        .toBuffer();
      latest = candidate;
      if (candidate.length <= TARGET_STORED_BYTES) {
        return candidate;
      }
    }
  }

  return latest;
}

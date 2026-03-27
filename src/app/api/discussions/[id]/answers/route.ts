import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthSecret } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { evidenceLabelValues } from "@/lib/discussions/status";

const createAnswerSchema = z.object({
  body: z.string().min(8),
  evidenceLabel: z.enum(evidenceLabelValues).optional(),
});

async function requireSessionUser(request: NextRequest) {
  const token = await getToken({ req: request, secret: getAuthSecret() });

  if (!token?.email) {
    return null;
  }

  return prisma.user.upsert({
    where: { email: token.email },
    update: {
      ...(typeof token.name === "string" ? { name: token.name } : {}),
      ...(token.role === "ADMIN" ? { role: "ADMIN" } : {}),
    },
    create: {
      email: token.email,
      name: typeof token.name === "string" ? token.name : null,
      role: token.role === "ADMIN" ? "ADMIN" : "USER",
    },
  });
}

type Params = {
  params: {
    id: string;
  };
};

export async function POST(request: NextRequest, { params }: Params) {
  const user = await requireSessionUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createAnswerSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid answer payload" }, { status: 400 });
  }

  const discussion = await prisma.discussion.findUnique({
    where: { id: params.id },
    select: { id: true },
  });

  if (!discussion) {
    return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
  }

  const answer = await prisma.answer.create({
    data: {
      discussionId: discussion.id,
      authorId: user.id,
      body: parsed.data.body,
      evidenceLabel: parsed.data.evidenceLabel ?? "UNVERIFIED",
    },
  });

  return NextResponse.json(
    {
      id: answer.id,
      discussionId: answer.discussionId,
      evidenceLabel: answer.evidenceLabel,
    },
    { status: 201 },
  );
}

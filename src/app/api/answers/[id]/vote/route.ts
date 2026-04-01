import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthSecret } from "@/lib/auth";
import { prisma } from "@/lib/db";

const voteSchema = z.object({
  value: z.union([z.literal(1), z.literal(-1), z.literal(0)]),
});

type Params = {
  params: {
    id: string;
  };
};

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

  const parsed = voteSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid vote payload" }, { status: 400 });
  }

  const answer = await prisma.answer.findUnique({
    where: { id: params.id },
    select: { id: true },
  });

  if (!answer) {
    return NextResponse.json({ error: "Answer not found" }, { status: 404 });
  }

  if (parsed.data.value === 0) {
    await prisma.answerVote.deleteMany({
      where: {
        answerId: answer.id,
        userId: user.id,
      },
    });
  } else {
    await prisma.answerVote.upsert({
      where: {
        answerId_userId: {
          answerId: answer.id,
          userId: user.id,
        },
      },
      update: {
        value: parsed.data.value,
      },
      create: {
        answerId: answer.id,
        userId: user.id,
        value: parsed.data.value,
      },
    });
  }

  const votes = await prisma.answerVote.findMany({
    where: { answerId: answer.id },
    select: { userId: true, value: true },
  });

  return NextResponse.json(
    {
      answerId: answer.id,
      voteScore: votes.reduce((total, vote) => total + vote.value, 0),
      viewerVote: votes.find((vote) => vote.userId === user.id)?.value ?? 0,
    },
    { status: 200 },
  );
}

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { getAuthSecret } from "@/lib/auth";
import { prisma } from "@/lib/db";

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

  const answer = await prisma.answer.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      isAccepted: true,
      discussion: {
        select: {
          id: true,
          createdById: true,
        },
      },
    },
  });

  if (!answer) {
    return NextResponse.json({ error: "Answer not found" }, { status: 404 });
  }

  const canAccept = user.role === "ADMIN" || answer.discussion.createdById === user.id;
  if (!canAccept) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.$transaction([
    prisma.answer.updateMany({
      where: {
        discussionId: answer.discussion.id,
        isAccepted: true,
      },
      data: {
        isAccepted: false,
      },
    }),
    ...(answer.isAccepted
      ? []
      : [
          prisma.answer.update({
            where: { id: answer.id },
            data: { isAccepted: true },
          }),
        ]),
  ]);

  return NextResponse.json(
    {
      answerId: answer.id,
      isAccepted: !answer.isAccepted,
    },
    { status: 200 },
  );
}

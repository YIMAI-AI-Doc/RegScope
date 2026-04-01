import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { getAuthSecret } from "@/lib/auth";
import { prisma } from "@/lib/db";

type Params = {
  params: {
    slug: string;
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
    return NextResponse.json({ status: "anonymous" }, { status: 200 });
  }

  const discussion = await prisma.discussion.findUnique({
    where: { slug: params.slug },
    select: { id: true },
  });

  if (!discussion) {
    return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
  }

  await prisma.discussionView.upsert({
    where: {
      userId_discussionId: {
        userId: user.id,
        discussionId: discussion.id,
      },
    },
    update: {
      viewCount: {
        increment: 1,
      },
    },
    create: {
      userId: user.id,
      discussionId: discussion.id,
    },
  });

  return NextResponse.json({ status: "tracked" }, { status: 200 });
}

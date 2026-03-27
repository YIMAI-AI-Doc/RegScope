import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthSecret } from "@/lib/auth";
import { prisma } from "@/lib/db";

const followTargetSchema = z.object({
  targetType: z.enum(["SOURCE", "COUNTRY", "TOPIC"]),
  slug: z.string().min(1),
});

type FollowTargetType = z.infer<typeof followTargetSchema>["targetType"];

async function requireSessionUser(request: NextRequest) {
  const token = await getToken({ req: request, secret: getAuthSecret() });

  if (!token?.email) {
    return null;
  }

  const user = await prisma.user.upsert({
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

  return user;
}

async function resolveTarget(targetType: FollowTargetType, slug: string) {
  switch (targetType) {
    case "SOURCE":
      return prisma.source.findUnique({ where: { slug } });
    case "COUNTRY":
      return prisma.country.findUnique({ where: { slug } });
    case "TOPIC":
      return prisma.topic.findUnique({ where: { slug } });
    default:
      return null;
  }
}

function followWhere(userId: string, targetType: FollowTargetType, targetId: string) {
  if (targetType === "SOURCE") {
    return { userId, targetType, sourceId: targetId, countryId: null, topicId: null };
  }

  if (targetType === "COUNTRY") {
    return { userId, targetType, countryId: targetId, sourceId: null, topicId: null };
  }

  return { userId, targetType, topicId: targetId, sourceId: null, countryId: null };
}

async function handleFollowMutation(request: NextRequest, action: "follow" | "unfollow") {
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

  const parsed = followTargetSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid target" }, { status: 400 });
  }

  const target = await resolveTarget(parsed.data.targetType, parsed.data.slug);
  if (!target) {
    return NextResponse.json({ error: "Target not found" }, { status: 404 });
  }

  const targetId = target.id;
  const where = followWhere(user.id, parsed.data.targetType, targetId);

  if (action === "unfollow") {
    await prisma.follow.deleteMany({ where });
    return NextResponse.json({ status: "unfollowed", targetType: parsed.data.targetType, slug: parsed.data.slug });
  }

  await prisma.follow.deleteMany({ where });
  await prisma.follow.create({ data: where });

  return NextResponse.json({ status: "followed", targetType: parsed.data.targetType, slug: parsed.data.slug });
}

export async function POST(request: NextRequest) {
  return handleFollowMutation(request, "follow");
}

export async function DELETE(request: NextRequest) {
  return handleFollowMutation(request, "unfollow");
}

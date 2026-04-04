import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAuthSecret } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { canEditCanonicalConclusion, discussionStatusValues, evidenceLabelValues } from "@/lib/discussions/status";
import { grantPetPoints } from "@/lib/pets/grant-points";

const createDiscussionSchema = z.object({
  title: z.string().min(8),
  summary: z.string().min(12),
  countrySlug: z.string().min(1).optional(),
  topicSlug: z.string().min(1).optional(),
  status: z.enum(discussionStatusValues).optional(),
  canonicalConclusion: z
    .object({
      summary: z.string().min(8),
      evidenceNote: z.string().min(1).optional(),
    })
    .optional(),
  evidence: z
    .array(
      z.object({
        title: z.string().min(3),
        url: z.string().url().optional().or(z.literal("")),
        note: z.string().min(1).optional(),
        sourceLabel: z.enum(evidenceLabelValues).optional(),
      }),
    )
    .optional(),
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

function buildSlug(title: string) {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);

  return `${base || "discussion"}-${Date.now().toString(36)}`;
}

export async function POST(request: NextRequest) {
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

  const parsed = createDiscussionSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid discussion payload" }, { status: 400 });
  }

  if (parsed.data.canonicalConclusion && !canEditCanonicalConclusion(user.role)) {
    return NextResponse.json({ error: "Conclusion editing is restricted" }, { status: 403 });
  }

  const [country, topic] = await Promise.all([
    parsed.data.countrySlug ? prisma.country.findUnique({ where: { slug: parsed.data.countrySlug } }) : Promise.resolve(null),
    parsed.data.topicSlug ? prisma.topic.findUnique({ where: { slug: parsed.data.topicSlug } }) : Promise.resolve(null),
  ]);

  if (parsed.data.countrySlug && !country) {
    return NextResponse.json({ error: "Country not found" }, { status: 404 });
  }

  if (parsed.data.topicSlug && !topic) {
    return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  }

  const slug = buildSlug(parsed.data.title);
  const discussion = await prisma.discussion.create({
    data: {
      slug,
      title: parsed.data.title,
      summary: parsed.data.summary,
      status: parsed.data.status ?? "OPEN",
      countryId: country?.id ?? null,
      topicId: topic?.id ?? null,
      createdById: user.id,
      conclusion: parsed.data.canonicalConclusion
        ? {
            create: {
              summary: parsed.data.canonicalConclusion.summary,
              evidenceNote: parsed.data.canonicalConclusion.evidenceNote ?? null,
              updatedById: user.id,
            },
          }
        : undefined,
      evidence: parsed.data.evidence?.length
        ? {
            create: parsed.data.evidence.map((item) => ({
              title: item.title,
              url: item.url && item.url.length > 0 ? item.url : null,
              note: item.note ?? null,
              sourceLabel: item.sourceLabel ?? "UNVERIFIED",
            })),
          }
        : undefined,
    },
  });

  try {
    await grantPetPoints({
      userId: user.id,
      eventType: "DISCUSSION_POST",
      sourceId: discussion.id,
      sourceType: "DISCUSSION",
    });
  } catch (petError) {
    console.error("Failed to grant divine beast points after discussion creation", petError);
  }

  return NextResponse.json(
    {
      id: discussion.id,
      slug: discussion.slug,
      status: discussion.status,
    },
    { status: 201 },
  );
}

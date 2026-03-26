import { PrismaClient, type ContentType } from "@prisma/client";

export type ContentUpsertInput = {
  slug: string;
  title: string;
  summary: string;
  body?: string | null;
  canonicalUrl: string;
  contentType: ContentType;
  publishedAt: Date;
  sourceId: string;
  countryId?: string | null;
  primaryTopicId?: string | null;
};

export type PrismaContentItemDelegate = {
  upsert: PrismaClient["contentItem"]["upsert"];
};

export type PrismaLike = {
  contentItem: PrismaContentItemDelegate;
};

export async function upsertContentItem(
  input: ContentUpsertInput,
  client?: PrismaLike,
) {
  const db = client ?? (await getDefaultPrismaClient());
  const canonicalUrl = input.canonicalUrl.trim();

  return db.contentItem.upsert({
    where: { canonicalUrl },
    update: {
      slug: input.slug,
      title: input.title,
      summary: input.summary,
      body: input.body ?? null,
      contentType: input.contentType,
      publishedAt: input.publishedAt,
      sourceId: input.sourceId,
      countryId: input.countryId ?? null,
      primaryTopicId: input.primaryTopicId ?? null,
    },
    create: {
      slug: input.slug,
      title: input.title,
      summary: input.summary,
      body: input.body ?? null,
      canonicalUrl,
      contentType: input.contentType,
      publishedAt: input.publishedAt,
      sourceId: input.sourceId,
      countryId: input.countryId ?? null,
      primaryTopicId: input.primaryTopicId ?? null,
    },
  });
}

let cachedDefaultClient: PrismaLike | null = null;

async function getDefaultPrismaClient(): Promise<PrismaLike> {
  if (cachedDefaultClient) {
    return cachedDefaultClient;
  }

  const { prisma } = await import("@/lib/db");
  cachedDefaultClient = prisma;
  return prisma;
}

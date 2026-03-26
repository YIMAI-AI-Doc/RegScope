import {
  PrismaClient,
  ContentType,
  DiscussionStatus,
  EvidenceLabel,
  FeedFormat,
} from "@prisma/client";

const prisma = new PrismaClient();

const topTopics = [
  { slug: "clinical-trials", name: "临床试验" },
  { slug: "cmc-and-manufacturing", name: "CMC 与生产" },
  { slug: "registration-submission", name: "注册申报" },
  { slug: "labeling-and-insert", name: "标签与说明书" },
  { slug: "post-marketing", name: "上市后管理" },
  { slug: "pharmacovigilance", name: "药物警戒" },
  { slug: "digital-ai-regulation", name: "数字化与 AI 监管" },
  { slug: "international-guidance", name: "国际协调与指南" },
] as const;

async function main() {
  const topics = await Promise.all(
    topTopics.map((topic) =>
      prisma.topic.upsert({
        where: { slug: topic.slug },
        update: { name: topic.name, level: 1 },
        create: { slug: topic.slug, name: topic.name, level: 1 },
      }),
    ),
  );

  const countries = await Promise.all([
    prisma.country.upsert({
      where: { slug: "us" },
      update: { name: "美国", region: "北美" },
      create: { slug: "us", name: "美国", region: "北美" },
    }),
    prisma.country.upsert({
      where: { slug: "eu" },
      update: { name: "欧盟", region: "欧洲" },
      create: { slug: "eu", name: "欧盟", region: "欧洲" },
    }),
    prisma.country.upsert({
      where: { slug: "cn" },
      update: { name: "中国", region: "亚太" },
      create: { slug: "cn", name: "中国", region: "亚太" },
    }),
  ]);

  const sources = await Promise.all([
    prisma.source.upsert({
      where: { slug: "fda" },
      update: {
        name: "美国 FDA",
        description: "美国食品药品监督管理局官方信息源",
        websiteUrl: "https://www.fda.gov/",
        feedUrl: "https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds",
        feedFormat: FeedFormat.RSS,
        countryId: countries[0].id,
        isOfficial: true,
      },
      create: {
        slug: "fda",
        name: "美国 FDA",
        description: "美国食品药品监督管理局官方信息源",
        websiteUrl: "https://www.fda.gov/",
        feedUrl: "https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds",
        feedFormat: FeedFormat.RSS,
        countryId: countries[0].id,
        isOfficial: true,
      },
    }),
    prisma.source.upsert({
      where: { slug: "ema" },
      update: {
        name: "欧盟 EMA",
        description: "欧洲药品管理局官方信息源",
        websiteUrl: "https://www.ema.europa.eu/",
        feedUrl: "https://www.ema.europa.eu/en/rss.xml",
        feedFormat: FeedFormat.RSS,
        countryId: countries[1].id,
        isOfficial: true,
      },
      create: {
        slug: "ema",
        name: "欧盟 EMA",
        description: "欧洲药品管理局官方信息源",
        websiteUrl: "https://www.ema.europa.eu/",
        feedUrl: "https://www.ema.europa.eu/en/rss.xml",
        feedFormat: FeedFormat.RSS,
        countryId: countries[1].id,
        isOfficial: true,
      },
    }),
  ]);

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@regscope.local" },
    update: { name: "Demo User" },
    create: { email: "demo@regscope.local", name: "Demo User" },
  });

  await prisma.contentItem.upsert({
    where: { canonicalUrl: "https://www.fda.gov/demo/ai-guidance" },
    update: {
      title: "FDA 发布 AI 监管相关示例内容",
      summary: "用于验证首页、列表和详情页展示。",
      publishedAt: new Date(),
      contentType: ContentType.GUIDANCE,
      sourceId: sources[0].id,
      countryId: countries[0].id,
      primaryTopicId: topics[6].id,
    },
    create: {
      slug: "fda-ai-guidance-demo",
      title: "FDA 发布 AI 监管相关示例内容",
      summary: "用于验证首页、列表和详情页展示。",
      canonicalUrl: "https://www.fda.gov/demo/ai-guidance",
      publishedAt: new Date(),
      contentType: ContentType.GUIDANCE,
      sourceId: sources[0].id,
      countryId: countries[0].id,
      primaryTopicId: topics[6].id,
    },
  });

  const discussion = await prisma.discussion.upsert({
    where: { slug: "ai-guidance-impact" },
    update: {
      title: "AI 指南对现有申报路径的影响是什么？",
      summary: "讨论 AI 监管示例内容的影响范围。",
      status: DiscussionStatus.PROVISIONAL_CONCLUSION,
      countryId: countries[0].id,
      topicId: topics[6].id,
      createdById: demoUser.id,
    },
    create: {
      slug: "ai-guidance-impact",
      title: "AI 指南对现有申报路径的影响是什么？",
      summary: "讨论 AI 监管示例内容的影响范围。",
      status: DiscussionStatus.PROVISIONAL_CONCLUSION,
      countryId: countries[0].id,
      topicId: topics[6].id,
      createdById: demoUser.id,
    },
  });

  await prisma.discussionConclusion.upsert({
    where: { discussionId: discussion.id },
    update: {
      summary: "当前阶段可视为对数据治理提出更明确要求，未必立刻改变全部申报路径。",
      evidenceNote: "优先参考官方原文，再结合行业解读。",
      updatedById: demoUser.id,
    },
    create: {
      discussionId: discussion.id,
      summary: "当前阶段可视为对数据治理提出更明确要求，未必立刻改变全部申报路径。",
      evidenceNote: "优先参考官方原文，再结合行业解读。",
      updatedById: demoUser.id,
    },
  });

  await prisma.discussionEvidence.createMany({
    data: [
      {
        discussionId: discussion.id,
        title: "FDA demo guidance note",
        url: "https://www.fda.gov/demo/ai-guidance",
        sourceLabel: EvidenceLabel.OFFICIAL,
      },
      {
        discussionId: discussion.id,
        title: "Industry interpretation note",
        sourceLabel: EvidenceLabel.ANALYSIS,
        note: "用于展示讨论页证据层级。",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.answer.upsert({
    where: {
      discussionId_authorId_body: {
        discussionId: discussion.id,
        authorId: demoUser.id,
        body: "这是用于种子数据的示例回答。",
      },
    },
    update: {
      evidenceLabel: EvidenceLabel.EXPERIENCE,
      isAccepted: true,
    },
    create: {
      discussionId: discussion.id,
      authorId: demoUser.id,
      body: "这是用于种子数据的示例回答。",
      evidenceLabel: EvidenceLabel.EXPERIENCE,
      isAccepted: true,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

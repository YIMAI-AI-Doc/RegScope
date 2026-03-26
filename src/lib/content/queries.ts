import { prisma } from "@/lib/db";

export type IntelligenceCardData = {
  slug: string;
  href: string;
  title: string;
  summary: string;
  sourceName: string;
  countryName: string;
  topicName: string;
  contentTypeLabel: string;
  publishedAtLabel: string;
  accent: "blue" | "teal" | "amber" | "violet";
};

export type SmallCardData = {
  slug: string;
  href: string;
  label: string;
  note: string;
  badge?: string;
};

export type DiscussionDigestData = {
  slug: string;
  href: string;
  title: string;
  summary: string;
  status: string;
  conclusion: string;
  evidenceCount: number;
  answerCount: number;
  updatedAtLabel: string;
};

export type HomepageData = {
  alert: {
    title: string;
    summary: string;
    meta: string;
  };
  featuredCards: IntelligenceCardData[];
  officialSources: SmallCardData[];
  topicCards: SmallCardData[];
  countryCards: SmallCardData[];
  discussions: DiscussionDigestData[];
  trending: SmallCardData[];
};

export type FeedFilters = {
  country?: string;
  source?: string;
  topic?: string;
  contentType?: string;
  timeRange?: string;
  query?: string;
};

export type FeedPageData = {
  items: IntelligenceCardData[];
  total: number;
  filters: {
    countries: SmallCardData[];
    sources: SmallCardData[];
    topics: SmallCardData[];
    contentTypes: SmallCardData[];
    timeRanges: SmallCardData[];
  };
};

type DbContentItem = Awaited<ReturnType<typeof loadContentItems>>[number];

const demoHomepage: HomepageData = {
  alert: {
    title: "今日监管预警",
    summary: "FDA、EMA、NMPA 等来源的高优先级更新会优先展示在这里。",
    meta: "按国家 / 机构 / 领域追踪",
  },
  featuredCards: [
    {
      slug: "fda-ai-guidance",
      href: "/feed?topic=digital-ai-regulation",
      title: "FDA 更新 AI 监管草案，强调数据治理与可追溯性",
      summary: "围绕模型训练、验证、变更控制和文档留痕给出更明确的审评关注点。",
      sourceName: "美国 FDA",
      countryName: "美国",
      topicName: "数字化与 AI 监管",
      contentTypeLabel: "Guidance",
      publishedAtLabel: "2 小时前",
      accent: "blue",
    },
    {
      slug: "ema-cmc-update",
      href: "/feed?topic=cmc-and-manufacturing",
      title: "EMA 发出 CMC 变更管理提示，重申稳定性数据优先级",
      summary: "针对工艺、杂质和稳定性证据的提交方式做出更细的说明。",
      sourceName: "欧盟 EMA",
      countryName: "欧盟",
      topicName: "CMC 与生产",
      contentTypeLabel: "Policy",
      publishedAtLabel: "今日",
      accent: "teal",
    },
    {
      slug: "nmpa-labeling-note",
      href: "/feed?topic=labeling-and-insert",
      title: "NMPA 说明书格式调整进入征求意见阶段",
      summary: "标签与说明书的结构化表达、风险提示和适应症描述成为重点。",
      sourceName: "中国 NMPA",
      countryName: "中国",
      topicName: "标签与说明书",
      contentTypeLabel: "Policy",
      publishedAtLabel: "昨日",
      accent: "amber",
    },
  ],
  officialSources: [
    {
      slug: "fda",
      href: "/sources/fda",
      label: "美国 FDA",
      note: "官方监管机构",
      badge: "RSS",
    },
    {
      slug: "ema",
      href: "/sources/ema",
      label: "欧盟 EMA",
      note: "官方监管机构",
      badge: "RSS",
    },
    {
      slug: "nmpa",
      href: "/sources/nmpa",
      label: "中国 NMPA",
      note: "官方监管机构",
      badge: "官方",
    },
    {
      slug: "mhra",
      href: "/sources/mhra",
      label: "英国 MHRA",
      note: "官方监管机构",
      badge: "RSS",
    },
  ],
  topicCards: [
    {
      slug: "digital-ai-regulation",
      href: "/topics/digital-ai-regulation",
      label: "数字化与 AI 监管",
      note: "高关注订阅",
      badge: "9",
    },
    {
      slug: "clinical-trials",
      href: "/topics/clinical-trials",
      label: "临床试验",
      note: "高价值订阅",
      badge: "12",
    },
    {
      slug: "cmc-and-manufacturing",
      href: "/topics/cmc-and-manufacturing",
      label: "CMC 与生产",
      note: "热门订阅",
      badge: "8",
    },
    {
      slug: "pharmacovigilance",
      href: "/topics/pharmacovigilance",
      label: "药物警戒",
      note: "持续更新",
      badge: "6",
    },
  ],
  countryCards: [
    {
      slug: "us",
      href: "/countries/us",
      label: "美国",
      note: "FDA 追踪",
      badge: "北美",
    },
    {
      slug: "eu",
      href: "/countries/eu",
      label: "欧盟",
      note: "EMA 追踪",
      badge: "欧洲",
    },
    {
      slug: "cn",
      href: "/countries/cn",
      label: "中国",
      note: "NMPA 追踪",
      badge: "亚太",
    },
    {
      slug: "uk",
      href: "/countries/uk",
      label: "英国",
      note: "MHRA 追踪",
      badge: "欧洲",
    },
  ],
  discussions: [
    {
      slug: "ai-guidance-impact",
      href: "/discussions/ai-guidance-impact",
      title: "AI 指南对现有申报路径的影响是什么？",
      summary: "需要优先判断它是立即改变流程，还是主要强化数据治理。",
      status: "已形成阶段性结论",
      conclusion: "当前更像是对文档、验证和可追溯性的要求升级，而不是路径重构。",
      evidenceCount: 2,
      answerCount: 4,
      updatedAtLabel: "1 小时前",
    },
    {
      slug: "cmc-change-control",
      href: "/discussions/cmc-change-control",
      title: "CMC 变更控制怎样判断是否需要补充稳定性数据？",
      summary: "不同地区对同类变更的证据要求不完全一致。",
      status: "讨论中",
      conclusion: "多数回复倾向于先看变更是否影响关键质量属性。",
      evidenceCount: 3,
      answerCount: 6,
      updatedAtLabel: "3 小时前",
    },
  ],
  trending: [
    {
      slug: "trending-fda",
      href: "/countries/us",
      label: "美国 FDA",
      note: "12 条更新",
      badge: "热点",
    },
    {
      slug: "trending-ai",
      href: "/topics/digital-ai-regulation",
      label: "数字化与 AI 监管",
      note: "9 个关注",
      badge: "升温",
    },
    {
      slug: "trending-ema",
      href: "/countries/eu",
      label: "欧盟 EMA",
      note: "7 条更新",
      badge: "稳定",
    },
  ],
};

export async function getHomepageData(): Promise<HomepageData> {
  try {
    const [contentItems, discussions] = await Promise.all([
      loadContentItems(),
      loadDiscussionDigests(),
    ]);

    if (contentItems.length === 0 && discussions.length === 0) {
      return demoHomepage;
    }

    return {
      ...demoHomepage,
      featuredCards: contentItems.slice(0, 3).map(mapContentToCard),
      discussions: discussions.slice(0, 2).map(mapDiscussionToDigest),
    };
  } catch {
    return demoHomepage;
  }
}

export async function getFeedPageData(filters: FeedFilters = {}): Promise<FeedPageData> {
  try {
    const contentItems = await loadContentItems();
    const filtered = filterContentItems(contentItems, filters);

    return {
      items: filtered.map(mapContentToCard),
      total: filtered.length,
      filters: demoFeedFilters,
    };
  } catch {
    const filtered = filterContentItems(demoContentItems, filters);
    return {
      items: filtered.map(mapContentToCard),
      total: filtered.length,
      filters: demoFeedFilters,
    };
  }
}

const demoFeedFilters = {
  countries: [
    { slug: "all-countries", href: "/feed", label: "全部国家", note: "默认", badge: "" },
    { slug: "us", href: "/feed?country=us", label: "美国", note: "FDA", badge: "北美" },
    { slug: "eu", href: "/feed?country=eu", label: "欧盟", note: "EMA", badge: "欧洲" },
    { slug: "cn", href: "/feed?country=cn", label: "中国", note: "NMPA", badge: "亚太" },
  ],
  sources: [
    { slug: "all-sources", href: "/feed", label: "全部来源", note: "默认", badge: "" },
    { slug: "fda", href: "/feed?source=fda", label: "美国 FDA", note: "官方来源", badge: "RSS" },
    { slug: "ema", href: "/feed?source=ema", label: "欧盟 EMA", note: "官方来源", badge: "RSS" },
    { slug: "nmpa", href: "/feed?source=nmpa", label: "中国 NMPA", note: "官方来源", badge: "官方" },
  ],
  topics: [
    { slug: "all-topics", href: "/feed", label: "全部领域", note: "默认", badge: "" },
    { slug: "digital-ai-regulation", href: "/feed?topic=digital-ai-regulation", label: "数字化与 AI 监管", note: "重点", badge: "9" },
    { slug: "cmc-and-manufacturing", href: "/feed?topic=cmc-and-manufacturing", label: "CMC 与生产", note: "重点", badge: "8" },
    { slug: "clinical-trials", href: "/feed?topic=clinical-trials", label: "临床试验", note: "重点", badge: "12" },
  ],
  contentTypes: [
    { slug: "all-types", href: "/feed", label: "全部类型", note: "默认", badge: "" },
    { slug: "policy", href: "/feed?contentType=POLICY", label: "政策", note: "官方", badge: "P" },
    { slug: "guidance", href: "/feed?contentType=GUIDANCE", label: "指南", note: "官方", badge: "G" },
    { slug: "news", href: "/feed?contentType=NEWS", label: "新闻", note: "解读", badge: "N" },
  ],
  timeRanges: [
    { slug: "all-time", href: "/feed", label: "全部时间", note: "默认", badge: "" },
    { slug: "24h", href: "/feed?timeRange=24h", label: "24 小时", note: "最新", badge: "24h" },
    { slug: "7d", href: "/feed?timeRange=7d", label: "7 天", note: "本周", badge: "7d" },
    { slug: "30d", href: "/feed?timeRange=30d", label: "30 天", note: "本月", badge: "30d" },
  ],
};

const demoContentItems: DbContentItem[] = [
  {
    id: "demo-1",
    slug: "fda-ai-guidance",
    title: "FDA 更新 AI 监管草案，强调数据治理与可追溯性",
    summary: "围绕模型训练、验证、变更控制和文档留痕给出更明确的审评关注点。",
    body: null,
    canonicalUrl: "https://www.fda.gov/demo/ai-guidance",
    contentType: "GUIDANCE",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    sourceId: "fda",
    countryId: "us",
    primaryTopicId: "digital-ai-regulation",
    createdAt: new Date(),
    updatedAt: new Date(),
    source: { id: "fda", slug: "fda", name: "美国 FDA", countryId: "us" } as never,
    country: { id: "us", slug: "us", name: "美国" } as never,
    primaryTopic: { id: "digital-ai-regulation", slug: "digital-ai-regulation", name: "数字化与 AI 监管" } as never,
  },
  {
    id: "demo-2",
    slug: "ema-cmc-update",
    title: "EMA 发出 CMC 变更管理提示，重申稳定性数据优先级",
    summary: "针对工艺、杂质和稳定性证据的提交方式做出更细的说明。",
    body: null,
    canonicalUrl: "https://www.ema.europa.eu/demo/cmc-update",
    contentType: "POLICY",
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
    sourceId: "ema",
    countryId: "eu",
    primaryTopicId: "cmc-and-manufacturing",
    createdAt: new Date(),
    updatedAt: new Date(),
    source: { id: "ema", slug: "ema", name: "欧盟 EMA", countryId: "eu" } as never,
    country: { id: "eu", slug: "eu", name: "欧盟" } as never,
    primaryTopic: { id: "cmc-and-manufacturing", slug: "cmc-and-manufacturing", name: "CMC 与生产" } as never,
  },
  {
    id: "demo-3",
    slug: "nmpa-labeling-note",
    title: "NMPA 说明书格式调整进入征求意见阶段",
    summary: "标签与说明书的结构化表达、风险提示和适应症描述成为重点。",
    body: null,
    canonicalUrl: "https://www.nmpa.gov.cn/demo/labeling",
    contentType: "POLICY",
    publishedAt: new Date(Date.now() - 30 * 60 * 60 * 1000),
    sourceId: "nmpa",
    countryId: "cn",
    primaryTopicId: "labeling-and-insert",
    createdAt: new Date(),
    updatedAt: new Date(),
    source: { id: "nmpa", slug: "nmpa", name: "中国 NMPA", countryId: "cn" } as never,
    country: { id: "cn", slug: "cn", name: "中国" } as never,
    primaryTopic: { id: "labeling-and-insert", slug: "labeling-and-insert", name: "标签与说明书" } as never,
  },
];

async function loadContentItems(): Promise<DbContentItem[]> {
  const items = await prisma.contentItem.findMany({
    orderBy: [{ publishedAt: "desc" }],
    take: 24,
    include: {
      source: true,
      country: true,
      primaryTopic: true,
    },
  });

  return items;
}

async function loadDiscussionDigests() {
  return prisma.discussion.findMany({
    orderBy: [{ updatedAt: "desc" }],
    take: 8,
    include: {
      conclusion: true,
      evidence: true,
      answers: true,
    },
  });
}

function mapDiscussionToDigest(discussion: Awaited<ReturnType<typeof loadDiscussionDigests>>[number]): DiscussionDigestData {
  return {
    slug: discussion.slug,
    href: `/discussions/${discussion.slug}`,
    title: discussion.title,
    summary: discussion.summary,
    status: discussion.status.replaceAll("_", " "),
    conclusion: discussion.conclusion?.summary ?? "当前还在收集证据，建议先查看官方原文和高票回复。",
    evidenceCount: discussion.evidence.length,
    answerCount: discussion.answers.length,
    updatedAtLabel: formatTimeAgo(discussion.updatedAt),
  };
}

function filterContentItems(items: DbContentItem[], filters: FeedFilters) {
  return items.filter((item) => {
    if (filters.country && item.country?.slug !== filters.country) {
      return false;
    }

    if (filters.source && item.source.slug !== filters.source) {
      return false;
    }

    if (filters.topic && item.primaryTopic?.slug !== filters.topic) {
      return false;
    }

    if (filters.contentType && item.contentType !== filters.contentType) {
      return false;
    }

    if (filters.timeRange && !matchesTimeRange(item.publishedAt, filters.timeRange)) {
      return false;
    }

    if (filters.query) {
      const query = filters.query.trim().toLowerCase();
      const text = `${item.title} ${item.summary} ${item.source.name}`.toLowerCase();

      if (!text.includes(query)) {
        return false;
      }
    }

    return true;
  });
}

function mapContentToCard(item: DbContentItem): IntelligenceCardData {
  return {
    slug: item.slug,
    href: `/content/${item.slug}`,
    title: item.title,
    summary: item.summary,
    sourceName: item.source?.name ?? "未知来源",
    countryName: item.country?.name ?? "全球",
    topicName: item.primaryTopic?.name ?? "未分类",
    contentTypeLabel: item.contentType,
    publishedAtLabel: formatTimeAgo(item.publishedAt),
    accent: pickAccent(item.contentType),
  };
}

function pickAccent(contentType: string): IntelligenceCardData["accent"] {
  switch (contentType) {
    case "GUIDANCE":
      return "blue";
    case "POLICY":
      return "teal";
    case "ALERT":
      return "amber";
    default:
      return "violet";
  }
}

function matchesTimeRange(date: Date, range: string) {
  const diffHours = (Date.now() - date.getTime()) / (1000 * 60 * 60);

  switch (range) {
    case "24h":
      return diffHours <= 24;
    case "7d":
      return diffHours <= 24 * 7;
    case "30d":
      return diffHours <= 24 * 30;
    default:
      return true;
  }
}

function formatTimeAgo(date: Date) {
  const diffHours = Math.max(0, Math.round((Date.now() - date.getTime()) / (1000 * 60 * 60)));

  if (diffHours < 1) {
    return "刚刚";
  }

  if (diffHours < 24) {
    return `${diffHours} 小时前`;
  }

  const days = Math.max(1, Math.round(diffHours / 24));

  if (days === 1) {
    return "昨日";
  }

  return `${days} 天前`;
}

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getDiscussionStatusMeta } from "@/lib/discussions/status";

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

export type CatalogCardData = SmallCardData & {
  summary: string;
};

export type TopicDirectoryData = {
  title: string;
  summary: string;
  cards: CatalogCardData[];
  latestContent: IntelligenceCardData[];
  relatedDiscussions: DiscussionDigestData[];
};

export type SourceDirectoryData = {
  title: string;
  summary: string;
  cards: CatalogCardData[];
  latestContent: IntelligenceCardData[];
  relatedDiscussions: DiscussionDigestData[];
};

export type CountryDirectoryData = {
  title: string;
  summary: string;
  cards: CatalogCardData[];
  latestContent: IntelligenceCardData[];
  relatedDiscussions: DiscussionDigestData[];
};

export type ContentDetailData = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  canonicalUrl: string;
  contentTypeLabel: string;
  publishedAtLabel: string;
  sourceName: string;
  sourceHref: string;
  countryName: string;
  countryHref: string;
  topicName: string;
  topicHref: string;
  accent: IntelligenceCardData["accent"];
};

export type TopicPageData = {
  topic: CatalogCardData;
  subtopics: CatalogCardData[];
  latestContent: IntelligenceCardData[];
  relatedSources: CatalogCardData[];
  relatedDiscussions: DiscussionDigestData[];
};

export type SourcePageData = {
  source: CatalogCardData;
  latestContent: IntelligenceCardData[];
  relatedTopics: CatalogCardData[];
  relatedDiscussions: DiscussionDigestData[];
};

export type CountryPageData = {
  country: CatalogCardData;
  latestContent: IntelligenceCardData[];
  relatedSources: CatalogCardData[];
  relatedTopics: CatalogCardData[];
  relatedDiscussions: DiscussionDigestData[];
};

export type ContentPageData = {
  content: ContentDetailData;
  relatedContent: IntelligenceCardData[];
  relatedDiscussions: DiscussionDigestData[];
};

type DbContentItem = Prisma.ContentItemGetPayload<{
  include: {
    source: true;
    country: true;
    primaryTopic: true;
  };
}>;

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
    {
      slug: "pmda",
      href: "/sources/pmda",
      label: "日本 PMDA",
      note: "官方监管机构",
      badge: "RSS",
    },
    {
      slug: "health-canada",
      href: "/sources/health-canada",
      label: "加拿大 Health Canada",
      note: "官方监管机构",
      badge: "ATOM",
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
    {
      slug: "registration-submission",
      href: "/topics/registration-submission",
      label: "注册申报",
      note: "资料递交",
      badge: "10",
    },
    {
      slug: "international-guidance",
      href: "/topics/international-guidance",
      label: "国际协调与指南",
      note: "跨区域对齐",
      badge: "5",
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
    {
      slug: "jp",
      href: "/countries/jp",
      label: "日本",
      note: "PMDA 追踪",
      badge: "亚太",
    },
    {
      slug: "ca",
      href: "/countries/ca",
      label: "加拿大",
      note: "Health Canada 追踪",
      badge: "北美",
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
    {
      slug: "labeling-digital-supplement",
      href: "/discussions/labeling-digital-supplement",
      title: "数字化标签补充信息可以替代纸面说明书更新吗？",
      summary: "监管方普遍接受补充路径，但对主文件与数字补充信息的边界仍较谨慎。",
      status: "已形成阶段性结论",
      conclusion: "更现实的方向是让数字化内容承担补充说明，而不是替代主说明书的法定更新职责。",
      evidenceCount: 2,
      answerCount: 4,
      updatedAtLabel: "5 小时前",
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
      featuredCards:
        contentItems.length > 0
          ? contentItems.slice(0, 3).map(mapContentToCard)
          : demoHomepage.featuredCards,
      discussions:
        discussions.length > 0
          ? discussions.slice(0, 3).map(mapDiscussionToDigest)
          : demoHomepage.discussions,
    };
  } catch {
    return demoHomepage;
  }
}

export async function getFeedPageData(filters: FeedFilters = {}): Promise<FeedPageData> {
  try {
    const filtered = await loadFilteredContentItems(filters);

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

export async function getTopicDirectoryData(): Promise<TopicDirectoryData> {
  try {
    const [contentItems, discussions] = await Promise.all([
      loadFilteredContentItems(),
      loadDiscussionDigestsWithFallback(),
    ]);

    return {
      title: "领域订阅",
      summary: "按大领域和小领域订阅全球医药监管动态。",
      cards: topicCatalog,
      latestContent: contentItems.slice(0, 4).map(mapContentToCard),
      relatedDiscussions: discussions.slice(0, 3),
    };
  } catch {
    return {
      title: "领域订阅",
      summary: "按大领域和小领域订阅全球医药监管动态。",
      cards: topicCatalog,
      latestContent: demoContentItems.slice(0, 4).map(mapContentToCard),
      relatedDiscussions: demoHomepage.discussions,
    };
  }
}

export async function getSourceDirectoryData(): Promise<SourceDirectoryData> {
  try {
    const [contentItems, discussions] = await Promise.all([
      loadFilteredContentItems(),
      loadDiscussionDigestsWithFallback(),
    ]);

    return {
      title: "官方来源",
      summary: "聚合全球主要官方监管机构，进入来源页后查看最新发布。",
      cards: sourceCatalog,
      latestContent: contentItems.slice(0, 4).map(mapContentToCard),
      relatedDiscussions: discussions.slice(0, 3),
    };
  } catch {
    return {
      title: "官方来源",
      summary: "聚合全球主要官方监管机构，进入来源页后查看最新发布。",
      cards: sourceCatalog,
      latestContent: demoContentItems.slice(0, 4).map(mapContentToCard),
      relatedDiscussions: demoHomepage.discussions,
    };
  }
}

export async function getCountryDirectoryData(): Promise<CountryDirectoryData> {
  try {
    const [contentItems, discussions] = await Promise.all([
      loadFilteredContentItems(),
      loadDiscussionDigestsWithFallback(),
    ]);

    return {
      title: "国家地区",
      summary: "从监管辖区视角观察全球医药政策变化。",
      cards: countryCatalog,
      latestContent: contentItems.slice(0, 4).map(mapContentToCard),
      relatedDiscussions: discussions.slice(0, 3),
    };
  } catch {
    return {
      title: "国家地区",
      summary: "从监管辖区视角观察全球医药政策变化。",
      cards: countryCatalog,
      latestContent: demoContentItems.slice(0, 4).map(mapContentToCard),
      relatedDiscussions: demoHomepage.discussions,
    };
  }
}

export async function getTopicPageData(slug: string): Promise<TopicPageData> {
  const topic = findCatalogItem(topicCatalog, slug, "领域", "/topics");
  const contentItems = await loadFilteredContentItems({ topic: slug });
  const discussions = await loadDiscussionDigestsWithFallback();
  const relatedSources = buildSourcesFromContentItems(contentItems);
  const subtopics = buildTopicSubtopics(slug);
  const relatedDiscussions = filterDiscussionsByKeyword(discussions, topic.label);

  return {
    topic,
    subtopics,
    latestContent: contentItems.slice(0, 4).map(mapContentToCard),
    relatedSources,
    relatedDiscussions: (relatedDiscussions.length > 0 ? relatedDiscussions : discussions).slice(0, 3),
  };
}

export async function getSourcePageData(slug: string): Promise<SourcePageData> {
  const source = findCatalogItem(sourceCatalog, slug, "来源", "/sources");
  const contentItems = await loadFilteredContentItems({ source: slug });
  const discussions = await loadDiscussionDigestsWithFallback();
  const relatedTopics = buildTopicsFromContentItems(contentItems);
  const relatedDiscussions = filterDiscussionsByKeyword(discussions, source.label);

  return {
    source,
    latestContent: contentItems.slice(0, 4).map(mapContentToCard),
    relatedTopics,
    relatedDiscussions: (relatedDiscussions.length > 0 ? relatedDiscussions : discussions).slice(0, 3),
  };
}

export async function getCountryPageData(slug: string): Promise<CountryPageData> {
  const country = findCatalogItem(countryCatalog, slug, "国家", "/countries");
  const contentItems = await loadFilteredContentItems({ country: slug });
  const discussions = await loadDiscussionDigestsWithFallback();
  const relatedSources = buildSourcesFromContentItems(contentItems);
  const relatedTopics = buildTopicsFromContentItems(contentItems);
  const relatedDiscussions = filterDiscussionsByKeyword(discussions, country.label);

  return {
    country,
    latestContent: contentItems.slice(0, 4).map(mapContentToCard),
    relatedSources,
    relatedTopics,
    relatedDiscussions: (relatedDiscussions.length > 0 ? relatedDiscussions : discussions).slice(0, 3),
  };
}

export async function getContentPageData(slug: string): Promise<ContentPageData> {
  const contentItem = await loadContentItemBySlug(slug);
  const current = contentItem ?? demoContentItems[0];
  const relatedContent = (await loadFilteredContentItems())
    .filter((item) => item.slug !== current.slug)
    .filter((item) =>
      item.sourceId === current.sourceId ||
      item.countryId === current.countryId ||
      item.primaryTopicId === current.primaryTopicId,
    )
    .slice(0, 3)
    .map(mapContentToCard);
  const discussions = await loadDiscussionDigestsWithFallback();
  const relatedDiscussions = filterDiscussionsByKeyword(
    discussions,
    current.primaryTopic?.name ?? current.title,
  );

  return {
    content: mapContentToDetail(current),
    relatedContent,
    relatedDiscussions: (relatedDiscussions.length > 0 ? relatedDiscussions : discussions).slice(0, 3),
  };
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

const topicCatalog: CatalogCardData[] = [
  {
    slug: "clinical-trials",
    href: "/topics/clinical-trials",
    label: "临床试验",
    note: "方案设计 / 去中心化 / RWE",
    badge: "12",
    summary: "围绕临床试验设计、执行和数据证据的全球监管变化。",
  },
  {
    slug: "cmc-and-manufacturing",
    href: "/topics/cmc-and-manufacturing",
    label: "CMC 与生产",
    note: "工艺 / 杂质 / 稳定性",
    badge: "8",
    summary: "聚焦工艺变更、稳定性、杂质控制和生产质量要求。",
  },
  {
    slug: "registration-submission",
    href: "/topics/registration-submission",
    label: "注册申报",
    note: "eCTD / 路径 / 资料提交",
    badge: "10",
    summary: "覆盖申报路径、递交流程与资料格式变化。",
  },
  {
    slug: "labeling-and-insert",
    href: "/topics/labeling-and-insert",
    label: "标签与说明书",
    note: "适应症 / 风险提示 / 说明书",
    badge: "6",
    summary: "关注标签、说明书、适应症和风险提示的法规变化。",
  },
  {
    slug: "post-marketing",
    href: "/topics/post-marketing",
    label: "上市后管理",
    note: "变更 / 再评价 / 风险管理",
    badge: "7",
    summary: "跟踪上市后变更、再评价和风险管理要求。",
  },
  {
    slug: "pharmacovigilance",
    href: "/topics/pharmacovigilance",
    label: "药物警戒",
    note: "安全性 / 信号 / 报告",
    badge: "6",
    summary: "聚焦安全性监测、信号识别和报告规则。",
  },
  {
    slug: "digital-ai-regulation",
    href: "/topics/digital-ai-regulation",
    label: "数字化与 AI 监管",
    note: "算法 / 数据治理 / 数字工具",
    badge: "9",
    summary: "覆盖 AI 辅助审评、数据治理和数字化工具监管。",
  },
  {
    slug: "international-guidance",
    href: "/topics/international-guidance",
    label: "国际协调与指南",
    note: "ICH / FDA / EMA / MHRA",
    badge: "5",
    summary: "聚焦国际监管协调、共识指南和跨区域对齐。",
  },
];

const sourceCatalog: CatalogCardData[] = [
  {
    slug: "fda",
    href: "/sources/fda",
    label: "美国 FDA",
    note: "官方监管机构",
    badge: "RSS",
    summary: "美国食品药品监督管理局的官方通知、指南与更新。",
  },
  {
    slug: "ema",
    href: "/sources/ema",
    label: "欧盟 EMA",
    note: "官方监管机构",
    badge: "RSS",
    summary: "欧洲药品管理局的指南、公告和协调信息。",
  },
  {
    slug: "nmpa",
    href: "/sources/nmpa",
    label: "中国 NMPA",
    note: "官方监管机构",
    badge: "官方",
    summary: "国家药监局发布的政策、征求意见和监管动态。",
  },
  {
    slug: "mhra",
    href: "/sources/mhra",
    label: "英国 MHRA",
    note: "官方监管机构",
    badge: "RSS",
    summary: "英国药品和健康产品管理局的监管更新。",
  },
  {
    slug: "pmda",
    href: "/sources/pmda",
    label: "日本 PMDA",
    note: "官方监管机构",
    badge: "RSS",
    summary: "日本 PMDA 的咨询、指导原则和审评相关更新。",
  },
  {
    slug: "health-canada",
    href: "/sources/health-canada",
    label: "加拿大 Health Canada",
    note: "官方监管机构",
    badge: "ATOM",
    summary: "加拿大卫生部的药品监管提醒、政策和通告。",
  },
];

const countryCatalog: CatalogCardData[] = [
  {
    slug: "us",
    href: "/countries/us",
    label: "美国",
    note: "FDA 追踪",
    badge: "北美",
    summary: "美国监管动态、指南草案和审评趋势的入口。",
  },
  {
    slug: "eu",
    href: "/countries/eu",
    label: "欧盟",
    note: "EMA 追踪",
    badge: "欧洲",
    summary: "欧盟范围内的监管协调、指南和成员国动态。",
  },
  {
    slug: "cn",
    href: "/countries/cn",
    label: "中国",
    note: "NMPA 追踪",
    badge: "亚太",
    summary: "中国境内政策、指南和征求意见的聚合入口。",
  },
  {
    slug: "uk",
    href: "/countries/uk",
    label: "英国",
    note: "MHRA 追踪",
    badge: "欧洲",
    summary: "英国监管公告、指南和药物安全动态。",
  },
  {
    slug: "jp",
    href: "/countries/jp",
    label: "日本",
    note: "PMDA 追踪",
    badge: "亚太",
    summary: "日本审评咨询、指导原则和实施口径变化的入口。",
  },
  {
    slug: "ca",
    href: "/countries/ca",
    label: "加拿大",
    note: "Health Canada 追踪",
    badge: "北美",
    summary: "加拿大监管提醒、标签政策与药物警戒更新入口。",
  },
];

const demoContentItems: DbContentItem[] = [
  createDemoContentItem({
    id: "demo-1",
    slug: "fda-ai-guidance",
    title: "FDA 更新 AI 监管草案，强调数据治理与可追溯性",
    summary: "围绕模型训练、验证、变更控制和文档留痕给出更明确的审评关注点。",
    canonicalUrl: "https://www.fda.gov/demo/ai-guidance",
    contentType: "GUIDANCE",
    publishedHoursAgo: 2,
    source: { id: "fda", slug: "fda", name: "美国 FDA", countryId: "us" },
    country: { id: "us", slug: "us", name: "美国" },
    topic: { id: "digital-ai-regulation", slug: "digital-ai-regulation", name: "数字化与 AI 监管" },
  }),
  createDemoContentItem({
    id: "demo-2",
    slug: "ema-cmc-update",
    title: "EMA 发出 CMC 变更管理提示，重申稳定性数据优先级",
    summary: "针对工艺、杂质和稳定性证据的提交方式做出更细的说明。",
    canonicalUrl: "https://www.ema.europa.eu/demo/cmc-update",
    contentType: "POLICY",
    publishedHoursAgo: 10,
    source: { id: "ema", slug: "ema", name: "欧盟 EMA", countryId: "eu" },
    country: { id: "eu", slug: "eu", name: "欧盟" },
    topic: { id: "cmc-and-manufacturing", slug: "cmc-and-manufacturing", name: "CMC 与生产" },
  }),
  createDemoContentItem({
    id: "demo-3",
    slug: "nmpa-labeling-note",
    title: "NMPA 说明书格式调整进入征求意见阶段",
    summary: "标签与说明书的结构化表达、风险提示和适应症描述成为重点。",
    canonicalUrl: "https://www.nmpa.gov.cn/demo/labeling",
    contentType: "POLICY",
    publishedHoursAgo: 30,
    source: { id: "nmpa", slug: "nmpa", name: "中国 NMPA", countryId: "cn" },
    country: { id: "cn", slug: "cn", name: "中国" },
    topic: { id: "labeling-and-insert", slug: "labeling-and-insert", name: "标签与说明书" },
  }),
  createDemoContentItem({
    id: "demo-4",
    slug: "mhra-decentralized-trial-note",
    title: "MHRA 补充去中心化临床执行预期",
    summary: "远程访视、电子知情和异常场景处理成为审查重点。",
    canonicalUrl: "https://www.gov.uk/demo/decentralized-trial-note",
    contentType: "GUIDANCE",
    publishedHoursAgo: 38,
    source: { id: "mhra", slug: "mhra", name: "英国 MHRA", countryId: "uk" },
    country: { id: "uk", slug: "uk", name: "英国" },
    topic: { id: "clinical-trials", slug: "clinical-trials", name: "临床试验" },
  }),
  createDemoContentItem({
    id: "demo-5",
    slug: "pmda-rwe-brief",
    title: "PMDA 提醒真实世界证据项目尽早界定方法学边界",
    summary: "数据适用性、外部对照和偏倚控制成为咨询前准备重点。",
    canonicalUrl: "https://www.pmda.go.jp/demo/rwe-brief",
    contentType: "NEWS",
    publishedHoursAgo: 46,
    source: { id: "pmda", slug: "pmda", name: "日本 PMDA", countryId: "jp" },
    country: { id: "jp", slug: "jp", name: "日本" },
    topic: { id: "clinical-trials", slug: "clinical-trials", name: "临床试验" },
  }),
  createDemoContentItem({
    id: "demo-6",
    slug: "health-canada-pv-alert",
    title: "Health Canada 重申严重不良反应时限要求",
    summary: "安全性报告时限、升级路径和补充材料要求被重新强调。",
    canonicalUrl: "https://www.canada.ca/demo/pv-alert",
    contentType: "ALERT",
    publishedHoursAgo: 56,
    source: { id: "health-canada", slug: "health-canada", name: "加拿大 Health Canada", countryId: "ca" },
    country: { id: "ca", slug: "ca", name: "加拿大" },
    topic: { id: "pharmacovigilance", slug: "pharmacovigilance", name: "药物警戒" },
  }),
  createDemoContentItem({
    id: "demo-7",
    slug: "fda-ectd-validation-note",
    title: "FDA 更新 eCTD 验证提示，强调递交前一致性检查",
    summary: "模块映射、命名与生命周期操作错误被列为高频问题。",
    canonicalUrl: "https://www.fda.gov/demo/ectd-validation-note",
    contentType: "POLICY",
    publishedHoursAgo: 66,
    source: { id: "fda", slug: "fda", name: "美国 FDA", countryId: "us" },
    country: { id: "us", slug: "us", name: "美国" },
    topic: { id: "registration-submission", slug: "registration-submission", name: "注册申报" },
  }),
  createDemoContentItem({
    id: "demo-8",
    slug: "ema-rmp-update",
    title: "EMA 更新风险管理计划模板实施说明",
    summary: "上市后管理与风险最小化措施的对应关系要求更清晰。",
    canonicalUrl: "https://www.ema.europa.eu/demo/rmp-update",
    contentType: "GUIDANCE",
    publishedHoursAgo: 80,
    source: { id: "ema", slug: "ema", name: "欧盟 EMA", countryId: "eu" },
    country: { id: "eu", slug: "eu", name: "欧盟" },
    topic: { id: "post-marketing", slug: "post-marketing", name: "上市后管理" },
  }),
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
  const statusMeta = getDiscussionStatusMeta(discussion.status);

  return {
    slug: discussion.slug,
    href: `/discussions/${discussion.slug}`,
    title: discussion.title,
    summary: discussion.summary,
    status: statusMeta.label,
    conclusion: discussion.conclusion?.summary ?? "当前还在收集证据，建议先查看官方原文和高票回复。",
    evidenceCount: discussion.evidence.length,
    answerCount: discussion.answers.length,
    updatedAtLabel: formatTimeAgo(discussion.updatedAt),
  };
}

async function loadFilteredContentItems(filters: FeedFilters = {}): Promise<DbContentItem[]> {
  try {
    const items = await loadContentItems();
    const sourceItems = items.length > 0 ? items : demoContentItems;
    return filterContentItems(sourceItems, filters);
  } catch {
    return filterContentItems(demoContentItems, filters);
  }
}

async function loadDiscussionDigestsWithFallback(): Promise<DiscussionDigestData[]> {
  try {
    const discussions = await loadDiscussionDigests();
    if (discussions.length === 0) {
      return demoHomepage.discussions;
    }

    return discussions.map(mapDiscussionToDigest);
  } catch {
    return demoHomepage.discussions;
  }
}

async function loadContentItemBySlug(slug: string): Promise<DbContentItem | undefined> {
  try {
    const items = await loadContentItems();
    const sourceItems = items.length > 0 ? items : demoContentItems;
    return sourceItems.find((item) => item.slug === slug);
  } catch {
    return demoContentItems.find((item) => item.slug === slug);
  }
}

function findCatalogItem(
  items: CatalogCardData[],
  slug: string,
  fallbackLabel: string,
  basePath: `/${string}`,
): CatalogCardData {
  return (
    items.find((item) => item.slug === slug) ?? {
      slug,
      href: `${basePath}/${slug}`,
      label: slugToLabel(slug, fallbackLabel),
      note: `${fallbackLabel}条目`,
      badge: "关注",
      summary: `这是 ${slugToLabel(slug, fallbackLabel)} 的默认介绍。`,
    }
  );
}

function buildSourcesFromContentItems(items: DbContentItem[]): CatalogCardData[] {
  const seen = new Map<string, CatalogCardData>();

  for (const item of items) {
    if (seen.has(item.source.slug)) {
      continue;
    }

    seen.set(item.source.slug, {
      slug: item.source.slug,
      href: `/sources/${item.source.slug}`,
      label: item.source.name,
      note: item.country?.name ?? "官方来源",
      badge: item.contentType,
      summary: `${item.source.name} 的最新发布入口。`,
    });
  }

  return [...seen.values()].slice(0, 4);
}

function buildTopicsFromContentItems(items: DbContentItem[]): CatalogCardData[] {
  const seen = new Map<string, CatalogCardData>();

  for (const item of items) {
    if (!item.primaryTopic || seen.has(item.primaryTopic.slug)) {
      continue;
    }

    seen.set(item.primaryTopic.slug, {
      slug: item.primaryTopic.slug,
      href: `/topics/${item.primaryTopic.slug}`,
      label: item.primaryTopic.name,
      note: "相关领域",
      badge: item.contentType,
      summary: `${item.primaryTopic.name} 的监管更新和讨论入口。`,
    });
  }

  return [...seen.values()].slice(0, 4);
}

function buildTopicSubtopics(slug: string): CatalogCardData[] {
  switch (slug) {
    case "clinical-trials":
      return createSubtopicCards([
        ["方案设计", "临床试验方案 / 终点 / 人群"],
        ["去中心化临床", "远程访视 / 电子化 / 分散式"],
        ["真实世界证据", "RWE / RWD / 外部对照"],
        ["临床运营", "执行 / 监查 / 质量管理"],
      ], `/feed?topic=${encodeURIComponent(slug)}`);
    case "cmc-and-manufacturing":
      return createSubtopicCards([
        ["稳定性", "货架期 / 条件 / 方案"],
        ["杂质控制", "工艺杂质 / 限度 / 监测"],
        ["工艺验证", "验证策略 / 放行 / 变更"],
        ["连续生产", "连续制造 / 自动化 / 控制"],
      ], `/feed?topic=${encodeURIComponent(slug)}`);
    case "registration-submission":
      return createSubtopicCards([
        ["eCTD", "结构 / 模块 / 提交"],
        ["补充资料", "问询 / 响应 / 资料补交"],
        ["审评沟通", "沟通机制 / 会议 / 路径"],
        ["申报路径", "优先审评 / 加速通道 / 适应症"],
      ], `/feed?topic=${encodeURIComponent(slug)}`);
    case "labeling-and-insert":
      return createSubtopicCards([
        ["说明书格式", "版式 / 结构 / 更新"],
        ["适应症", "适应症描述 / 边界 / 扩展"],
        ["风险提示", "警示语 / 不良反应 / 监测"],
        ["广告宣传", "合规 / 宣传限制 / 审核"],
      ], `/feed?topic=${encodeURIComponent(slug)}`);
    case "post-marketing":
      return createSubtopicCards([
        ["变更控制", "补充申请 / 重大变更 / 通知"],
        ["再评价", "再审查 / 再评价 / 证据更新"],
        ["上市后研究", "PMS / 真实世界 / 补充证据"],
        ["风险管理", "RMP / 缓解措施 / 信号响应"],
      ], `/feed?topic=${encodeURIComponent(slug)}`);
    case "pharmacovigilance":
      return createSubtopicCards([
        ["信号识别", "信号检测 / 评估 / 上报"],
        ["周期报告", "PSUR / PBRER / 递交"],
        ["个例报告", "ICSR / 时限 / 质量"],
        ["风险管理", "RMP / 风险最小化 / 沟通"],
      ], `/feed?topic=${encodeURIComponent(slug)}`);
    case "digital-ai-regulation":
      return createSubtopicCards([
        ["AI 辅助审评", "模型 / 评估 / 审评关注"],
        ["数据治理", "数据可追溯 / 留痕 / 权限"],
        ["模型验证", "验证 / 偏差 / 稳定性"],
        ["数字工具", "软件 / 平台 / 数字化工具"],
      ], `/feed?topic=${encodeURIComponent(slug)}`);
    case "international-guidance":
      return createSubtopicCards([
        ["ICH", "国际协调 / 指南 / 共识"],
        ["FDA / EMA", "跨区域对齐 / 监管口径"],
        ["MHRA / PMDA", "区域经验 / 执行差异"],
        ["指南解读", "二手解读 / 影响分析"],
      ], `/feed?topic=${encodeURIComponent(slug)}`);
    default:
      return createSubtopicCards([
        [slugToLabel(slug, "领域"), "默认子领域"],
        ["最新更新", "按时间追踪"],
        ["相关讨论", "社区问答"],
      ], `/feed?topic=${encodeURIComponent(slug)}`);
  }
}

function filterDiscussionsByKeyword(discussions: DiscussionDigestData[], keyword: string) {
  const text = keyword.trim().toLowerCase();

  return discussions.filter((discussion) => {
    const haystack = `${discussion.title} ${discussion.summary} ${discussion.conclusion}`.toLowerCase();
    return haystack.includes(text);
  });
}

function mapContentToDetail(item: DbContentItem): ContentDetailData {
  return {
    slug: item.slug,
    title: item.title,
    summary: item.summary,
    body: item.body ?? item.summary,
    canonicalUrl: item.canonicalUrl,
    contentTypeLabel: item.contentType,
    publishedAtLabel: formatTimeAgo(item.publishedAt),
    sourceName: item.source?.name ?? "未知来源",
    sourceHref: `/sources/${item.source?.slug ?? ""}`,
    countryName: item.country?.name ?? "全球",
    countryHref: `/countries/${item.country?.slug ?? ""}`,
    topicName: item.primaryTopic?.name ?? "未分类",
    topicHref: `/topics/${item.primaryTopic?.slug ?? ""}`,
    accent: pickAccent(item.contentType),
  };
}

function createSubtopicCards(items: Array<[string, string]>, href: string): CatalogCardData[] {
  return items.map(([label, summary], index) => ({
    slug: `${label}-${index}`,
    href,
    label,
    note: "小领域",
    badge: `${index + 1}`,
    summary,
  }));
}

function createDemoContentItem({
  id,
  slug,
  title,
  summary,
  canonicalUrl,
  contentType,
  publishedHoursAgo,
  source,
  country,
  topic,
}: {
  id: string;
  slug: string;
  title: string;
  summary: string;
  canonicalUrl: string;
  contentType: DbContentItem["contentType"];
  publishedHoursAgo: number;
  source: { id: string; slug: string; name: string; countryId: string | null };
  country: { id: string; slug: string; name: string };
  topic: { id: string; slug: string; name: string };
}): DbContentItem {
  const publishedAt = new Date(Date.now() - publishedHoursAgo * 60 * 60 * 1000);

  return {
    id,
    slug,
    title,
    summary,
    body: null,
    canonicalUrl,
    contentType,
    publishedAt,
    sourceId: source.id,
    countryId: country.id,
    primaryTopicId: topic.id,
    createdAt: publishedAt,
    updatedAt: publishedAt,
    source: source as never,
    country: country as never,
    primaryTopic: topic as never,
  };
}

function slugToLabel(slug: string, fallbackLabel: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ")
    .replace(/\bAi\b/g, "AI")
    .replace(/\bCmc\b/g, "CMC") || fallbackLabel;
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

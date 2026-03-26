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
      href: "/feed?query=AI%20%E6%8C%87%E5%8D%97%E5%AF%B9%E7%8E%B0%E6%9C%89%E7%94%B3%E6%8A%A5%E8%B7%AF%E5%BE%84%E7%9A%84%E5%BD%B1%E5%93%8D%E6%98%AF%E4%BB%80%E4%B9%88",
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
      href: "/feed?query=CMC%20%E5%8F%98%E6%9B%B4%E6%8E%A7%E5%88%B6%E6%80%8E%E6%A0%B7%E5%88%A4%E6%96%AD%E6%98%AF%E5%90%A6%E9%9C%80%E8%A6%81%E8%A1%A5%E5%85%85%E7%A8%B3%E5%AE%9A%E6%80%A7%E6%95%B0%E6%8D%AE",
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
];

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
    href: `/feed?query=${encodeURIComponent(discussion.title)}`,
    title: discussion.title,
    summary: discussion.summary,
    status: discussion.status.replaceAll("_", " "),
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

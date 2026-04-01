import { prisma } from "@/lib/db";
import { getDiscussionStatusMeta, getEvidenceLabelMeta, type DiscussionStatusValue, type EvidenceLabelValue } from "./status";

export type DiscussionListItemData = {
  slug: string;
  href: string;
  title: string;
  summary: string;
  status: DiscussionStatusValue;
  statusLabel: string;
  statusDescription: string;
  conclusion: string;
  evidenceCount: number;
  answerCount: number;
  countryLabel: string;
  countrySlug?: string;
  topicLabel: string;
  topicSlug?: string;
  updatedAtLabel: string;
};

export type DiscussionQuestionData = {
  title: string;
  summary: string;
  status: DiscussionStatusValue;
  statusLabel: string;
  statusDescription: string;
  countryLabel: string;
  countrySlug?: string;
  topicLabel: string;
  topicSlug?: string;
  createdByLabel: string;
  createdAtLabel: string;
  updatedAtLabel: string;
};

export type DiscussionConclusionData = {
  summary: string;
  evidenceNote: string | null;
  updatedByLabel: string;
  updatedAtLabel: string;
};

export type DiscussionEvidenceData = {
  id: string;
  title: string;
  url: string | null;
  note: string | null;
  label: EvidenceLabelValue;
  labelText: string;
};

export type DiscussionAnswerData = {
  id: string;
  authorId?: string;
  authorLabel: string;
  body: string;
  evidenceLabel: EvidenceLabelValue;
  evidenceLabelText: string;
  createdAtLabel: string;
  createdAtValue: string;
  isAccepted: boolean;
  voteScore: number;
  viewerVote: -1 | 0 | 1;
};

export type DiscussionControversyData = {
  title: string;
  summary: string;
  points: string[];
};

export type DiscussionRecommendationData = DiscussionListItemData & {
  reason: string;
  score: number;
};

export type DiscussionPageData = {
  id: string;
  slug: string;
  question: DiscussionQuestionData;
  conclusion: DiscussionConclusionData | null;
  evidence: DiscussionEvidenceData[];
  controversy: DiscussionControversyData;
  answers: DiscussionAnswerData[];
  relatedQuestions: DiscussionRecommendationData[];
  viewer: {
    isAuthenticated: boolean;
    canVote: boolean;
    canAcceptAnswers: boolean;
  };
};

export type DiscussionListData = {
  title: string;
  summary: string;
  recommendedItems: DiscussionRecommendationData[];
  items: DiscussionListItemData[];
};

export type DiscussionListPersonalization = {
  recentDiscussionSlugs?: string[];
  followedTopicSlugs?: string[];
  followedCountrySlugs?: string[];
};

export type DiscussionPageViewer = {
  userId?: string;
  role?: string;
};

type AnswerVoteValue = -1 | 0 | 1;

const demoDiscussionRecords: DiscussionPageData[] = [
  {
    id: "discussion-1",
    slug: "ai-guidance-impact",
    question: {
      title: "AI 指南对现有申报路径的影响是什么？",
      summary: "需要先判断它是立即改变流程，还是主要强化数据治理和留痕要求。",
      status: "PROVISIONAL_CONCLUSION",
      statusLabel: "阶段性结论",
      statusDescription: "已经形成当前判断，但仍可能随着新证据更新。",
      countryLabel: "美国",
      countrySlug: "us",
      topicLabel: "数字化与 AI 监管",
      topicSlug: "digital-ai-regulation",
      createdByLabel: "RegScope 编辑部",
      createdAtLabel: "2 小时前",
      updatedAtLabel: "1 小时前",
    },
    conclusion: {
      summary: "当前更像是对文档、验证和可追溯性的要求升级，而不是路径重构。",
      evidenceNote: "优先参考官方原文，再结合行业解读。",
      updatedByLabel: "RegScope 编辑部",
      updatedAtLabel: "1 小时前",
    },
    evidence: [
      {
        id: "evidence-1",
        title: "FDA demo guidance note",
        url: "https://www.fda.gov/demo/ai-guidance",
        note: "官方原文，适合先确认监管关注点。",
        label: "OFFICIAL",
        labelText: "官方原文",
      },
      {
        id: "evidence-2",
        title: "Industry interpretation note",
        url: null,
        note: "用于展示二手解读与经验判断如何区分。",
        label: "ANALYSIS",
        labelText: "权威解读",
      },
    ],
    controversy: {
      title: "争议焦点",
      summary: "当前讨论主要集中在“流程是否变化”和“数据治理要求是否足以影响申报策略”两个方向。",
      points: [
        "官方原文和行业解读对“路径变化”的判断仍存在解释空间。",
        "多数回复接受数据治理会加强，但对实施节奏的判断并不一致。",
        "如果要下更稳妥的结论，还需要更多地区的交叉证据。",
      ],
    },
    answers: [
      {
        id: "answer-1",
        authorId: "analyst-user",
        authorLabel: "Demo Analyst",
        body: "更偏向文档、验证和可追溯性的要求升级，暂时不建议理解成申报路径完全重构。",
        evidenceLabel: "OFFICIAL",
        evidenceLabelText: "官方原文",
        createdAtLabel: "58 分钟前",
        createdAtValue: new Date(Date.now() - 58 * 60 * 1000).toISOString(),
        isAccepted: true,
        voteScore: 6,
        viewerVote: 0,
      },
      {
        id: "answer-2",
        authorId: "demo-user",
        authorLabel: "RegScope 用户",
        body: "如果你们内部已经有模型验证和变更控制框架，可以先按增强版治理要求准备，而不是立刻改流程。",
        evidenceLabel: "EXPERIENCE",
        evidenceLabelText: "实践经验",
        createdAtLabel: "35 分钟前",
        createdAtValue: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
        isAccepted: false,
        voteScore: 2,
        viewerVote: 0,
      },
    ],
    relatedQuestions: [],
    viewer: {
      isAuthenticated: false,
      canVote: false,
      canAcceptAnswers: false,
    },
  },
  {
    id: "discussion-2",
    slug: "cmc-change-control",
    question: {
      title: "CMC 变更控制怎样判断是否需要补充稳定性数据？",
      summary: "不同地区对同类变更的证据要求不完全一致，讨论要先界定影响范围。",
      status: "CONTROVERSIAL",
      statusLabel: "高争议",
      statusDescription: "观点分歧较大，建议先看证据再下结论。",
      countryLabel: "全球",
      countrySlug: undefined,
      topicLabel: "CMC 与生产",
      topicSlug: "cmc-and-manufacturing",
      createdByLabel: "RegScope 编辑部",
      createdAtLabel: "5 小时前",
      updatedAtLabel: "3 小时前",
    },
    conclusion: {
      summary: "多数回复倾向于先看变更是否影响关键质量属性，再决定是否补充稳定性数据。",
      evidenceNote: "如果变更落在工艺、杂质或包装环节，通常需要更谨慎的评估。",
      updatedByLabel: "RegScope 编辑部",
      updatedAtLabel: "3 小时前",
    },
    evidence: [
      {
        id: "evidence-3",
        title: "Change control reference",
        url: null,
        note: "用于说明稳定性补充往往依赖影响范围。",
        label: "ANALYSIS",
        labelText: "权威解读",
      },
      {
        id: "evidence-4",
        title: "Manufacturer case note",
        url: null,
        note: "实践经验，通常只在内部评估时参考。",
        label: "EXPERIENCE",
        labelText: "实践经验",
      },
      {
        id: "evidence-5",
        title: "Draft line summary",
        url: null,
        note: "仍需核实原文上下文。",
        label: "UNVERIFIED",
        labelText: "待核实",
      },
    ],
    controversy: {
      title: "争议焦点",
      summary: "问题并不在于“要不要稳定性数据”本身，而在于“变更是否足以触发补充”的判断阈值。",
      points: [
        "不同地区对相似变更的证据颗粒度要求不同。",
        "如果只看单一地区经验，容易过度推断。",
        "需要先识别是否触及关键质量属性，再考虑稳定性补充。",
      ],
    },
    answers: [
      {
        id: "answer-3",
        authorLabel: "CMC Reviewer",
        body: "先看变更是否影响关键质量属性，如果影响范围明确，再判断是否补充稳定性数据。",
        evidenceLabel: "ANALYSIS",
        evidenceLabelText: "权威解读",
        createdAtLabel: "2 小时前",
        createdAtValue: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isAccepted: false,
        voteScore: 3,
        viewerVote: 0,
      },
    ],
    relatedQuestions: [],
    viewer: {
      isAuthenticated: false,
      canVote: false,
      canAcceptAnswers: false,
    },
  },
];

export async function getDiscussionListData(
  personalization: DiscussionListPersonalization = {},
): Promise<DiscussionListData> {
  const records = await loadDiscussionRecords({ take: 12 });
  const baseItems =
    records.length === 0
      ? demoDiscussionRecords.map(mapDiscussionPageToListItem)
      : records.map(mapDiscussionRecordToListItem);
  const rankedItems = rankDiscussionListItems(baseItems, personalization);

  return {
    title: "讨论问答",
    summary: "围绕全球医药监管问题，把结论、证据和争议点放在同一页。",
    recommendedItems: rankedItems.recommendedItems,
    items: rankedItems.items,
  };
}

export async function getDiscussionPageData(
  slug: string,
  viewer: DiscussionPageViewer = {},
): Promise<DiscussionPageData> {
  const record = await loadDiscussionRecordBySlug(slug);

  if (!record) {
    const demoRecord = demoDiscussionRecords.find((item) => item.slug === slug);
    if (demoRecord) {
      return {
        ...demoRecord,
        relatedQuestions: rankDiscussionListItems(
          demoDiscussionRecords
            .filter((item) => item.slug !== slug)
            .map(mapDiscussionPageToListItem),
        ).recommendedItems,
        viewer: {
          isAuthenticated: Boolean(viewer.userId),
          canVote: Boolean(viewer.userId),
          canAcceptAnswers: Boolean(viewer.userId),
        },
      };
    }

    return buildFallbackDiscussionPage(slug);
  }

  return mapDiscussionRecordToPage(
    record,
    viewer,
    buildRelatedQuestions(record, await loadDiscussionRecords({ take: 12 })),
  );
}

type LoadedDiscussionRecord = Awaited<ReturnType<typeof loadDiscussionRecords>>[number];

async function loadDiscussionRecords(options: { slug?: string; take?: number } = {}) {
  try {
    const discussions = await prisma.discussion.findMany({
      where: options.slug ? { slug: options.slug } : undefined,
      orderBy: [{ updatedAt: "desc" }],
      take: options.take,
      include: {
        country: { select: { slug: true, name: true } },
        topic: { select: { slug: true, name: true } },
        createdBy: { select: { name: true, email: true } },
        conclusion: {
          include: {
            updatedBy: { select: { name: true, email: true } },
          },
        },
        evidence: {
          orderBy: [{ createdAt: "asc" }],
        },
        answers: {
          orderBy: [{ isAccepted: "desc" }, { createdAt: "asc" }],
          include: {
            author: { select: { name: true, email: true } },
            votes: {
              select: {
                userId: true,
                value: true,
              },
            },
          },
        },
        views: {
          select: {
            userId: true,
            viewCount: true,
            lastViewedAt: true,
          },
          orderBy: [{ lastViewedAt: "desc" }],
          take: 12,
        },
      },
    });

    return discussions;
  } catch {
    return [];
  }
}

async function loadDiscussionRecordBySlug(slug: string): Promise<LoadedDiscussionRecord | undefined> {
  const records = await loadDiscussionRecords({ slug, take: 1 });
  return records[0];
}

function mapDiscussionPageToListItem(item: DiscussionPageData): DiscussionListItemData {
  return {
    slug: item.slug,
    href: `/discussions/${item.slug}`,
    title: item.question.title,
    summary: item.question.summary,
    status: item.question.status,
    statusLabel: item.question.statusLabel,
    statusDescription: item.question.statusDescription,
    conclusion: item.conclusion?.summary ?? "当前还在收集证据，建议先查看官方原文和回复。",
    evidenceCount: item.evidence.length,
    answerCount: item.answers.length,
    countryLabel: item.question.countryLabel,
    countrySlug: item.question.countrySlug,
    topicLabel: item.question.topicLabel,
    topicSlug: item.question.topicSlug,
    updatedAtLabel: item.question.updatedAtLabel,
  };
}

function mapDiscussionRecordToListItem(record: LoadedDiscussionRecord): DiscussionListItemData {
  return mapDiscussionPageToListItem(mapDiscussionRecordToPage(record, {}, []));
}

function mapDiscussionRecordToPage(
  record: LoadedDiscussionRecord,
  viewer: DiscussionPageViewer,
  relatedQuestions: DiscussionRecommendationData[],
): DiscussionPageData {
  const statusMeta = getDiscussionStatusMeta(record.status);
  const viewerCanAcceptAnswers =
    Boolean(viewer.userId && viewer.userId === record.createdById) || viewer.role === "ADMIN";

  return {
    id: record.id,
    slug: record.slug,
    question: {
      title: record.title,
      summary: record.summary,
      status: statusMeta.value,
      statusLabel: statusMeta.label,
      statusDescription: statusMeta.description,
      countryLabel: record.country?.name ?? "全球",
      countrySlug: record.country?.slug,
      topicLabel: record.topic?.name ?? "未分类",
      topicSlug: record.topic?.slug,
      createdByLabel: record.createdBy?.name ?? record.createdBy?.email ?? "RegScope 社区",
      createdAtLabel: formatRelativeTime(record.createdAt),
      updatedAtLabel: formatRelativeTime(record.updatedAt),
    },
    conclusion: record.conclusion
      ? {
          summary: record.conclusion.summary,
          evidenceNote: record.conclusion.evidenceNote,
          updatedByLabel: record.conclusion.updatedBy?.name ?? record.conclusion.updatedBy?.email ?? "RegScope 编辑部",
          updatedAtLabel: formatRelativeTime(record.conclusion.updatedAt),
        }
      : null,
    evidence: record.evidence.map((evidence) => {
      const evidenceMeta = getEvidenceLabelMeta(evidence.sourceLabel);
      return {
        id: evidence.id,
        title: evidence.title,
        url: evidence.url,
        note: evidence.note,
        label: evidenceMeta.value,
        labelText: evidenceMeta.label,
      };
    }),
    controversy: buildControversyData(record),
    answers: record.answers.map((answer) => {
      const evidenceMeta = getEvidenceLabelMeta(answer.evidenceLabel);
      const voteScore = answer.votes.reduce((total, vote) => total + vote.value, 0);
      const viewerVote = normalizeVoteValue(
        viewer.userId ? answer.votes.find((vote) => vote.userId === viewer.userId)?.value : undefined,
      );
      return {
        id: answer.id,
        authorId: answer.authorId,
        authorLabel: answer.author?.name ?? answer.author?.email ?? "匿名用户",
        body: answer.body,
        evidenceLabel: evidenceMeta.value,
        evidenceLabelText: evidenceMeta.label,
        createdAtLabel: formatRelativeTime(answer.createdAt),
        createdAtValue: answer.createdAt.toISOString(),
        isAccepted: answer.isAccepted,
        voteScore,
        viewerVote,
      };
    }),
    relatedQuestions,
    viewer: {
      isAuthenticated: Boolean(viewer.userId),
      canVote: Boolean(viewer.userId),
      canAcceptAnswers: viewerCanAcceptAnswers,
    },
  };
}

function buildControversyData(record: LoadedDiscussionRecord): DiscussionControversyData {
  const statusMeta = getDiscussionStatusMeta(record.status);
  const points = new Set<string>();

  points.add(statusMeta.description);

  if (record.evidence.length <= 1) {
    points.add("证据量较少，结论仍容易受单一来源影响。");
  }

  if (record.answers.some((answer) => answer.evidenceLabel !== "OFFICIAL")) {
    points.add("社区回复中包含经验判断，需和官方原文交叉验证。");
  }

  if (record.status === "CONTROVERSIAL") {
    points.add("当前分歧主要出现在解释路径和适用边界。");
  }

  if (record.status === "OPEN" || record.status === "IN_REVIEW") {
    points.add("更适合继续补充官方证据和问题背景。");
  }

  return {
    title: statusMeta.label === "高争议" ? "争议焦点" : "当前争议点",
    summary:
      record.conclusion?.evidenceNote ??
      "把仍未统一的判断单独列出，方便后来者快速定位需要继续验证的地方。",
    points: [...points],
  };
}

function buildFallbackDiscussionPage(slug: string): DiscussionPageData {
  return {
    id: slug,
    slug,
    question: {
      title: "当前还没有正式收录这个问题",
      summary: "可以先创建讨论条目，再逐步补充结论、证据和回复。",
      status: "OPEN",
      statusLabel: "待讨论",
      statusDescription: "问题已提出，仍在收集官方原文和背景信息。",
      countryLabel: "全球",
      countrySlug: undefined,
      topicLabel: "未分类",
      topicSlug: undefined,
      createdByLabel: "RegScope 社区",
      createdAtLabel: "刚刚",
      updatedAtLabel: "刚刚",
    },
    conclusion: null,
    evidence: [],
    controversy: {
      title: "争议焦点",
      summary: "暂无正式争议内容。",
      points: ["先补充问题定义，再逐步补充证据和回复。"],
    },
    answers: [],
    relatedQuestions: [],
    viewer: {
      isAuthenticated: false,
      canVote: false,
      canAcceptAnswers: false,
    },
  };
}

export function rankDiscussionListItems(
  items: DiscussionListItemData[],
  personalization: DiscussionListPersonalization = {},
): {
  items: DiscussionListItemData[];
  recommendedItems: DiscussionRecommendationData[];
} {
  const recentDiscussionSlugs = personalization.recentDiscussionSlugs ?? [];
  const recentSlugRank = new Map(recentDiscussionSlugs.map((slug, index) => [slug, index]));
  const followedTopicSlugs = new Set(personalization.followedTopicSlugs ?? []);
  const followedCountrySlugs = new Set(personalization.followedCountrySlugs ?? []);

  const scored = items.map((item, index) => {
    let score = item.answerCount * 3 + item.evidenceCount * 2;
    const reasons: string[] = [];

    if (item.status === "PROVISIONAL_CONCLUSION") {
      score += 5;
    } else if (item.status === "CONTROVERSIAL") {
      score += 3;
    } else if (item.status === "IN_REVIEW") {
      score += 2;
    } else if (item.status === "OPEN") {
      score += 1;
    }

    const recentIndex = recentSlugRank.get(item.slug);
    if (recentIndex !== undefined) {
      score += Math.max(8, 18 - recentIndex * 3);
      reasons.push(recentIndex === 0 ? "你刚看过这个问题" : "你最近浏览过相近问题");
    }

    if (item.topicSlug && followedTopicSlugs.has(item.topicSlug)) {
      score += 14;
      reasons.push("匹配你关注的领域");
    }

    if (item.countrySlug && followedCountrySlugs.has(item.countrySlug)) {
      score += 10;
      reasons.push("匹配你关注的国家");
    }

    return {
      item,
      score,
      reason:
        reasons[0] ??
        (item.answerCount >= 2
          ? "回答活跃，适合优先阅读"
          : item.evidenceCount >= 2
            ? "证据更完整，适合快速判断"
            : "讨论仍在升温，建议持续跟踪"),
      index,
    };
  });

  scored.sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }

    return left.index - right.index;
  });

  return {
    items: scored.map(({ item }) => item),
    recommendedItems: scored.slice(0, Math.min(3, scored.length)).map(({ item, reason, score }) => ({
      ...item,
      reason,
      score,
    })),
  };
}

function buildRelatedQuestions(
  current: LoadedDiscussionRecord,
  records: LoadedDiscussionRecord[],
): DiscussionRecommendationData[] {
  return records
    .filter((record) => record.slug !== current.slug)
    .map((record) => {
      const item = mapDiscussionRecordToListItem(record);
      let score = item.answerCount * 2 + item.evidenceCount * 2;
      const reasons: string[] = [];

      if (current.topicId && current.topicId === record.topicId) {
        score += 14;
        reasons.push("同领域延伸讨论");
      }

      if (current.countryId && current.countryId === record.countryId) {
        score += 10;
        reasons.push("同监管地区");
      }

      if (record.status === "PROVISIONAL_CONCLUSION") {
        score += 4;
      }

      return {
        ...item,
        reason: reasons[0] ?? "相关活跃问题",
        score,
      };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 3);
}

function normalizeVoteValue(value?: number): AnswerVoteValue {
  if (value === 1 || value === -1) {
    return value;
  }

  return 0;
}

function formatRelativeTime(date: Date) {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMinutes < 1) {
    return "刚刚";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} 分钟前`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} 小时前`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} 天前`;
}

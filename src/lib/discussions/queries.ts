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
  topicLabel: string;
  updatedAtLabel: string;
};

export type DiscussionQuestionData = {
  title: string;
  summary: string;
  status: DiscussionStatusValue;
  statusLabel: string;
  statusDescription: string;
  countryLabel: string;
  topicLabel: string;
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
  authorLabel: string;
  body: string;
  evidenceLabel: EvidenceLabelValue;
  evidenceLabelText: string;
  createdAtLabel: string;
  isAccepted: boolean;
};

export type DiscussionControversyData = {
  title: string;
  summary: string;
  points: string[];
};

export type DiscussionPageData = {
  slug: string;
  question: DiscussionQuestionData;
  conclusion: DiscussionConclusionData | null;
  evidence: DiscussionEvidenceData[];
  controversy: DiscussionControversyData;
  answers: DiscussionAnswerData[];
};

export type DiscussionListData = {
  title: string;
  summary: string;
  items: DiscussionListItemData[];
};

const demoDiscussionRecords: DiscussionPageData[] = [
  {
    slug: "ai-guidance-impact",
    question: {
      title: "AI 指南对现有申报路径的影响是什么？",
      summary: "需要先判断它是立即改变流程，还是主要强化数据治理和留痕要求。",
      status: "PROVISIONAL_CONCLUSION",
      statusLabel: "阶段性结论",
      statusDescription: "已经形成当前判断，但仍可能随着新证据更新。",
      countryLabel: "美国",
      topicLabel: "数字化与 AI 监管",
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
        authorLabel: "Demo Analyst",
        body: "更偏向文档、验证和可追溯性的要求升级，暂时不建议理解成申报路径完全重构。",
        evidenceLabel: "OFFICIAL",
        evidenceLabelText: "官方原文",
        createdAtLabel: "58 分钟前",
        isAccepted: true,
      },
      {
        id: "answer-2",
        authorLabel: "RegScope 用户",
        body: "如果你们内部已经有模型验证和变更控制框架，可以先按增强版治理要求准备，而不是立刻改流程。",
        evidenceLabel: "EXPERIENCE",
        evidenceLabelText: "实践经验",
        createdAtLabel: "35 分钟前",
        isAccepted: false,
      },
    ],
  },
  {
    slug: "cmc-change-control",
    question: {
      title: "CMC 变更控制怎样判断是否需要补充稳定性数据？",
      summary: "不同地区对同类变更的证据要求不完全一致，讨论要先界定影响范围。",
      status: "CONTROVERSIAL",
      statusLabel: "高争议",
      statusDescription: "观点分歧较大，建议先看证据再下结论。",
      countryLabel: "全球",
      topicLabel: "CMC 与生产",
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
        isAccepted: false,
      },
    ],
  },
];

export async function getDiscussionListData(): Promise<DiscussionListData> {
  const records = await loadDiscussionRecords({ take: 12 });

  if (records.length === 0) {
    return {
      title: "讨论问答",
      summary: "围绕全球医药监管问题，把结论、证据和争议点放在同一页。",
      items: demoDiscussionRecords.map(mapDiscussionPageToListItem),
    };
  }

  return {
    title: "讨论问答",
    summary: "围绕全球医药监管问题，把结论、证据和争议点放在同一页。",
    items: records.map(mapDiscussionPageToListItem),
  };
}

export async function getDiscussionPageData(slug: string): Promise<DiscussionPageData> {
  const record = await loadDiscussionRecordBySlug(slug);

  if (!record) {
    return demoDiscussionRecords.find((item) => item.slug === slug) ?? buildFallbackDiscussionPage(slug);
  }

  return mapDiscussionRecordToPage(record);
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
          },
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
    topicLabel: item.question.topicLabel,
    updatedAtLabel: item.question.updatedAtLabel,
  };
}

function mapDiscussionRecordToPage(record: LoadedDiscussionRecord): DiscussionPageData {
  const statusMeta = getDiscussionStatusMeta(record.status);

  return {
    slug: record.slug,
    question: {
      title: record.title,
      summary: record.summary,
      status: statusMeta.value,
      statusLabel: statusMeta.label,
      statusDescription: statusMeta.description,
      countryLabel: record.country?.name ?? "全球",
      topicLabel: record.topic?.name ?? "未分类",
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
      return {
        id: answer.id,
        authorLabel: answer.author?.name ?? answer.author?.email ?? "匿名用户",
        body: answer.body,
        evidenceLabel: evidenceMeta.value,
        evidenceLabelText: evidenceMeta.label,
        createdAtLabel: formatRelativeTime(answer.createdAt),
        isAccepted: answer.isAccepted,
      };
    }),
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
    slug,
    question: {
      title: "当前还没有正式收录这个问题",
      summary: "可以先创建讨论条目，再逐步补充结论、证据和回复。",
      status: "OPEN",
      statusLabel: "待讨论",
      statusDescription: "问题已提出，仍在收集官方原文和背景信息。",
      countryLabel: "全球",
      topicLabel: "未分类",
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
  };
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

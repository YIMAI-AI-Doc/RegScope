export const discussionStatusValues = [
  "OPEN",
  "IN_REVIEW",
  "PROVISIONAL_CONCLUSION",
  "CONTROVERSIAL",
  "CLOSED",
] as const;

export type DiscussionStatusValue = (typeof discussionStatusValues)[number];

export const evidenceLabelValues = ["OFFICIAL", "ANALYSIS", "EXPERIENCE", "UNVERIFIED"] as const;

export type EvidenceLabelValue = (typeof evidenceLabelValues)[number];

const discussionStatusMetaMap: Record<
  DiscussionStatusValue,
  {
    label: string;
    description: string;
    tone: "blue" | "amber" | "violet" | "green" | "slate";
  }
> = {
  OPEN: {
    label: "待讨论",
    description: "问题已提出，仍在收集官方原文和背景信息。",
    tone: "blue",
  },
  IN_REVIEW: {
    label: "整理中",
    description: "证据和回复正在收拢，适合继续补充材料。",
    tone: "slate",
  },
  PROVISIONAL_CONCLUSION: {
    label: "阶段性结论",
    description: "已经形成当前判断，但仍可能随着新证据更新。",
    tone: "green",
  },
  CONTROVERSIAL: {
    label: "高争议",
    description: "观点分歧较大，建议先看证据再下结论。",
    tone: "amber",
  },
  CLOSED: {
    label: "已收束",
    description: "讨论已经沉淀为可复用结论，通常仅作回看。",
    tone: "violet",
  },
};

const evidenceLabelMetaMap: Record<
  EvidenceLabelValue,
  {
    label: string;
    tone: "blue" | "amber" | "violet" | "green" | "slate";
  }
> = {
  OFFICIAL: {
    label: "官方原文",
    tone: "green",
  },
  ANALYSIS: {
    label: "权威解读",
    tone: "blue",
  },
  EXPERIENCE: {
    label: "实践经验",
    tone: "violet",
  },
  UNVERIFIED: {
    label: "待核实",
    tone: "amber",
  },
};

export function normalizeDiscussionStatus(status?: string | null): DiscussionStatusValue {
  if (!status || !(discussionStatusValues as readonly string[]).includes(status)) {
    return "OPEN";
  }

  return status as DiscussionStatusValue;
}

export function getDiscussionStatusMeta(status?: string | null) {
  const normalized = normalizeDiscussionStatus(status);

  return {
    value: normalized,
    ...discussionStatusMetaMap[normalized],
  };
}

export function getEvidenceLabelMeta(label?: string | null) {
  const normalized = label && (evidenceLabelValues as readonly string[]).includes(label) ? (label as EvidenceLabelValue) : "UNVERIFIED";

  return {
    value: normalized,
    ...evidenceLabelMetaMap[normalized],
  };
}

export function canEditCanonicalConclusion(role?: string | null) {
  return role === "ADMIN" || role === "MODERATOR";
}

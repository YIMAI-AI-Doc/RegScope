import {
  ContentType,
  DiscussionStatus,
  EvidenceLabel,
  FeedFormat,
  PrismaClient,
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

const representativeSubtopics = [
  { slug: "decentralized-trials", name: "去中心化临床", parentSlug: "clinical-trials" },
  { slug: "stability-strategy", name: "稳定性策略", parentSlug: "cmc-and-manufacturing" },
  { slug: "ectd-operations", name: "eCTD 运营", parentSlug: "registration-submission" },
  { slug: "label-structure", name: "说明书结构", parentSlug: "labeling-and-insert" },
  { slug: "post-approval-change-control", name: "上市后变更控制", parentSlug: "post-marketing" },
  { slug: "signal-detection", name: "信号识别", parentSlug: "pharmacovigilance" },
  { slug: "ai-validation", name: "AI 验证", parentSlug: "digital-ai-regulation" },
  { slug: "ich-harmonisation", name: "ICH 协调", parentSlug: "international-guidance" },
] as const;

const countrySeeds = [
  { slug: "us", name: "美国", region: "北美" },
  { slug: "eu", name: "欧盟", region: "欧洲" },
  { slug: "cn", name: "中国", region: "亚太" },
  { slug: "uk", name: "英国", region: "欧洲" },
  { slug: "jp", name: "日本", region: "亚太" },
  { slug: "ca", name: "加拿大", region: "北美" },
] as const;

const sourceSeeds = [
  {
    slug: "fda",
    name: "美国 FDA",
    description: "美国食品药品监督管理局官方信息源",
    websiteUrl: "https://www.fda.gov/",
    feedUrl: "https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds",
    feedFormat: FeedFormat.RSS,
    countrySlug: "us",
  },
  {
    slug: "ema",
    name: "欧盟 EMA",
    description: "欧洲药品管理局官方信息源",
    websiteUrl: "https://www.ema.europa.eu/",
    feedUrl: "https://www.ema.europa.eu/en/rss.xml",
    feedFormat: FeedFormat.RSS,
    countrySlug: "eu",
  },
  {
    slug: "nmpa",
    name: "中国 NMPA",
    description: "国家药监局官方信息源",
    websiteUrl: "https://www.nmpa.gov.cn/",
    feedUrl: "https://www.nmpa.gov.cn/yaowen/index.html",
    feedFormat: FeedFormat.RSS,
    countrySlug: "cn",
  },
  {
    slug: "mhra",
    name: "英国 MHRA",
    description: "英国药品和健康产品管理局官方信息源",
    websiteUrl: "https://www.gov.uk/government/organisations/medicines-and-healthcare-products-regulatory-agency",
    feedUrl: "https://www.gov.uk/government/organisations/medicines-and-healthcare-products-regulatory-agency.atom",
    feedFormat: FeedFormat.ATOM,
    countrySlug: "uk",
  },
  {
    slug: "pmda",
    name: "日本 PMDA",
    description: "日本医药品医疗器械综合机构官方信息源",
    websiteUrl: "https://www.pmda.go.jp/",
    feedUrl: "https://www.pmda.go.jp/english/rss/index.html",
    feedFormat: FeedFormat.RSS,
    countrySlug: "jp",
  },
  {
    slug: "health-canada",
    name: "加拿大 Health Canada",
    description: "加拿大卫生部药品监管信息源",
    websiteUrl: "https://www.canada.ca/en/health-canada.html",
    feedUrl: "https://www.canada.ca/en/news/advanced-news-search/news-results.html?dprtmnt=healthcanada.atom",
    feedFormat: FeedFormat.ATOM,
    countrySlug: "ca",
  },
] as const;

const userSeeds = [
  { email: "demo@regscope.local", name: "RegScope 编辑部" },
  { email: "analyst@regscope.local", name: "Demo Analyst" },
  { email: "cmc@regscope.local", name: "CMC Reviewer" },
  { email: "pv@regscope.local", name: "PV Lead" },
  { email: "label@regscope.local", name: "Labeling Lead" },
] as const;

const followSeeds = [
  {
    userEmail: "demo@regscope.local",
    targetType: "TOPIC" as const,
    topicSlug: "digital-ai-regulation",
  },
  {
    userEmail: "demo@regscope.local",
    targetType: "TOPIC" as const,
    topicSlug: "cmc-and-manufacturing",
  },
  {
    userEmail: "demo@regscope.local",
    targetType: "COUNTRY" as const,
    countrySlug: "us",
  },
  {
    userEmail: "demo@regscope.local",
    targetType: "COUNTRY" as const,
    countrySlug: "eu",
  },
] as const;

type DiscussionSeed = {
  slug: string;
  title: string;
  summary: string;
  status: DiscussionStatus;
  countrySlug: string;
  topicSlug: string;
  createdByEmail: string;
  conclusion: {
    summary: string;
    evidenceNote: string;
    updatedByEmail: string;
  };
  evidence: Array<{
    title: string;
    url?: string;
    sourceLabel: EvidenceLabel;
    note?: string;
  }>;
  answers: Array<{
    authorEmail: string;
    body: string;
    evidenceLabel: EvidenceLabel;
    isAccepted: boolean;
    votes?: Array<{
      userEmail: string;
      value: -1 | 1;
    }>;
  }>;
  views?: Array<{
    userEmail: string;
    viewCount: number;
  }>;
};

const contentSeeds = [
  {
    slug: "fda-ai-lifecycle-guidance",
    title: "FDA 更新 AI 生命周期治理指引，强调可追溯性与变更留痕",
    summary: "围绕模型训练、验证、变更控制和文档留痕给出更明确的审评关注点。",
    body: "FDA 在示例指引中把数据治理、验证证据和模型变更留痕放到同一套审评语言里。",
    canonicalUrl: "https://www.fda.gov/demo/ai-lifecycle-guidance",
    hoursAgo: 6,
    contentType: ContentType.GUIDANCE,
    sourceSlug: "fda",
    countrySlug: "us",
    topicSlug: "digital-ai-regulation",
  },
  {
    slug: "ema-cmc-change-evidence",
    title: "EMA 提醒 CMC 变更管理需先界定关键质量属性影响",
    summary: "针对工艺、杂质和稳定性证据的提交方式做出更细的说明。",
    body: "EMA 的更新把变更分层、稳定性补充和支持性证据逻辑串联得更清楚。",
    canonicalUrl: "https://www.ema.europa.eu/demo/cmc-change-evidence",
    hoursAgo: 10,
    contentType: ContentType.POLICY,
    sourceSlug: "ema",
    countrySlug: "eu",
    topicSlug: "cmc-and-manufacturing",
  },
  {
    slug: "nmpa-labeling-template-consultation",
    title: "NMPA 说明书模板调整进入征求意见阶段",
    summary: "标签与说明书的结构化表达、风险提示和适应症描述成为重点。",
    body: "新版模板更强调风险提示位置、结构化字段和一致性校验。",
    canonicalUrl: "https://www.nmpa.gov.cn/demo/labeling-template-consultation",
    hoursAgo: 18,
    contentType: ContentType.POLICY,
    sourceSlug: "nmpa",
    countrySlug: "cn",
    topicSlug: "labeling-and-insert",
  },
  {
    slug: "mhra-decentralized-trial-expectations",
    title: "MHRA 更新去中心化临床执行预期",
    summary: "远程访视、电子知情和受试者支持材料被列为重点检查项。",
    body: "MHRA 把去中心化临床的文件化要求和受试者保护义务表达得更直接。",
    canonicalUrl: "https://www.gov.uk/demo/decentralized-trial-expectations",
    hoursAgo: 26,
    contentType: ContentType.GUIDANCE,
    sourceSlug: "mhra",
    countrySlug: "uk",
    topicSlug: "clinical-trials",
  },
  {
    slug: "pmda-rwe-early-consultation",
    title: "PMDA 鼓励真实世界证据项目在早期咨询阶段提交框架说明",
    summary: "日本监管口径更强调数据适用性、外部对照和偏倚控制。",
    body: "PMDA 提示企业在咨询阶段先说清数据来源、终点定义和方法学边界。",
    canonicalUrl: "https://www.pmda.go.jp/demo/rwe-early-consultation",
    hoursAgo: 34,
    contentType: ContentType.NEWS,
    sourceSlug: "pmda",
    countrySlug: "jp",
    topicSlug: "clinical-trials",
  },
  {
    slug: "health-canada-pv-deadline-alert",
    title: "Health Canada 重申严重不良反应时限要求",
    summary: "安全性报告时限、升级路径和补充材料要求被重新强调。",
    body: "加拿大监管更新把严重个例、随访补报和责任分工放到同一提醒中。",
    canonicalUrl: "https://www.canada.ca/demo/pv-deadline-alert",
    hoursAgo: 42,
    contentType: ContentType.ALERT,
    sourceSlug: "health-canada",
    countrySlug: "ca",
    topicSlug: "pharmacovigilance",
  },
  {
    slug: "fda-ectd-validation-rule",
    title: "FDA 调整 eCTD 技术验证提示，强调递交前一致性检查",
    summary: "模块映射、文件命名和生命周期操作错误被列为高频问题。",
    body: "该提示更适合放到注册运营团队的预提交清单里。",
    canonicalUrl: "https://www.fda.gov/demo/ectd-validation-rule",
    hoursAgo: 50,
    contentType: ContentType.POLICY,
    sourceSlug: "fda",
    countrySlug: "us",
    topicSlug: "registration-submission",
  },
  {
    slug: "ema-rmp-template-refresh",
    title: "EMA 更新风险管理计划模板的实施说明",
    summary: "上市后管理与风险最小化措施的对应关系要求更清晰。",
    body: "EMA 把 RMP 模板更新和提交说明合并，减少企业二次解释成本。",
    canonicalUrl: "https://www.ema.europa.eu/demo/rmp-template-refresh",
    hoursAgo: 58,
    contentType: ContentType.GUIDANCE,
    sourceSlug: "ema",
    countrySlug: "eu",
    topicSlug: "post-marketing",
  },
  {
    slug: "nmpa-signal-workflow-update",
    title: "NMPA 更新药物警戒信号研判流程说明",
    summary: "信号识别、内部升级和监管沟通节奏成为重点。",
    body: "新的说明把信号初筛、医学评估和跨部门闭环表达得更直接。",
    canonicalUrl: "https://www.nmpa.gov.cn/demo/signal-workflow-update",
    hoursAgo: 64,
    contentType: ContentType.POLICY,
    sourceSlug: "nmpa",
    countrySlug: "cn",
    topicSlug: "pharmacovigilance",
  },
  {
    slug: "mhra-ai-software-watch",
    title: "MHRA 发布 AI 驱动软件监管观察要点",
    summary: "软件生命周期、临床使用边界和变更控制要求同步升温。",
    body: "这份观察更像给数字化团队的风险清单，而不是完整实施细则。",
    canonicalUrl: "https://www.gov.uk/demo/ai-software-watch",
    hoursAgo: 72,
    contentType: ContentType.NEWS,
    sourceSlug: "mhra",
    countrySlug: "uk",
    topicSlug: "digital-ai-regulation",
  },
  {
    slug: "pmda-continuous-manufacturing-note",
    title: "PMDA 说明连续制造项目需提供过程控制与放行逻辑",
    summary: "CMC 团队需要同步准备控制策略、模型校验和偏差处理说明。",
    body: "连续制造项目的说明重点落在过程监控、控制限和放行逻辑的闭环上。",
    canonicalUrl: "https://www.pmda.go.jp/demo/continuous-manufacturing-note",
    hoursAgo: 78,
    contentType: ContentType.GUIDANCE,
    sourceSlug: "pmda",
    countrySlug: "jp",
    topicSlug: "cmc-and-manufacturing",
  },
  {
    slug: "health-canada-digital-labeling-policy",
    title: "Health Canada 探索数字化标签信息补充路径",
    summary: "二维码、补充材料链接和风险更新同步被纳入讨论。",
    body: "这类数字化标签路径更适合与说明书主文件治理一起看。",
    canonicalUrl: "https://www.canada.ca/demo/digital-labeling-policy",
    hoursAgo: 86,
    contentType: ContentType.POLICY,
    sourceSlug: "health-canada",
    countrySlug: "ca",
    topicSlug: "labeling-and-insert",
  },
  {
    slug: "fda-risk-based-inspection-brief",
    title: "FDA 更新风险导向检查重点，上市后制造变更被重点关注",
    summary: "工厂检查与上市后变更、偏差处理和年度回顾逻辑被重新连接。",
    body: "对上市后团队而言，这份更新更像是变更治理与检查联动提醒。",
    canonicalUrl: "https://www.fda.gov/demo/risk-based-inspection-brief",
    hoursAgo: 94,
    contentType: ContentType.NEWS,
    sourceSlug: "fda",
    countrySlug: "us",
    topicSlug: "post-marketing",
  },
  {
    slug: "ema-ich-alignment-briefing",
    title: "EMA 汇总近期 ICH 协调议题与区域落实差异",
    summary: "对齐指南与本地执行口径之间的差异仍需要逐条识别。",
    body: "国际协调议题看似统一，真正影响实施的是各区域的落地解释。",
    canonicalUrl: "https://www.ema.europa.eu/demo/ich-alignment-briefing",
    hoursAgo: 102,
    contentType: ContentType.ARTICLE,
    sourceSlug: "ema",
    countrySlug: "eu",
    topicSlug: "international-guidance",
  },
  {
    slug: "nmpa-eclinical-tool-consultation",
    title: "NMPA 征求电子化临床工具监管边界意见",
    summary: "系统验证、审计追踪和数据迁移成为问题焦点。",
    body: "电子化临床工具的监管讨论正从系统功能转向数据可审计性。",
    canonicalUrl: "https://www.nmpa.gov.cn/demo/eclinical-tool-consultation",
    hoursAgo: 110,
    contentType: ContentType.POLICY,
    sourceSlug: "nmpa",
    countrySlug: "cn",
    topicSlug: "digital-ai-regulation",
  },
  {
    slug: "pmda-priority-review-dossier-note",
    title: "PMDA 说明优先审评资料包需更早补齐关键模块",
    summary: "资料结构、差距说明和沟通节奏需要提前规划。",
    body: "该提醒更像注册项目经理的排期约束，而不只是格式要求。",
    canonicalUrl: "https://www.pmda.go.jp/demo/priority-review-dossier-note",
    hoursAgo: 118,
    contentType: ContentType.GUIDANCE,
    sourceSlug: "pmda",
    countrySlug: "jp",
    topicSlug: "registration-submission",
  },
] as const;

const discussionSeeds: DiscussionSeed[] = [
  {
    slug: "ai-guidance-impact",
    title: "AI 指南对现有申报路径的影响是什么？",
    summary: "需要优先判断它是立即改变流程，还是主要强化数据治理与验证留痕。",
    status: DiscussionStatus.PROVISIONAL_CONCLUSION,
    countrySlug: "us",
    topicSlug: "digital-ai-regulation",
    createdByEmail: "demo@regscope.local",
    conclusion: {
      summary: "当前更像是对数据治理、验证和可追溯性的要求升级，而不是路径重构。",
      evidenceNote: "优先参考官方原文，再结合行业解读和内部验证框架。",
      updatedByEmail: "analyst@regscope.local",
    },
    evidence: [
      {
        title: "FDA AI lifecycle guidance",
        url: "https://www.fda.gov/demo/ai-lifecycle-guidance",
        sourceLabel: EvidenceLabel.OFFICIAL,
        note: "用于确认官方措辞是否落在治理强化而非路径改写。",
      },
      {
        title: "MHRA AI software watch",
        url: "https://www.gov.uk/demo/ai-software-watch",
        sourceLabel: EvidenceLabel.ANALYSIS,
        note: "用于交叉比较不同监管口径对软件生命周期的强调。",
      },
      {
        title: "Internal validation checklist",
        sourceLabel: EvidenceLabel.EXPERIENCE,
        note: "用于展示企业内部通常先补哪类验证材料。",
      },
    ],
    answers: [
      {
        authorEmail: "analyst@regscope.local",
        body: "更偏向文档、验证和可追溯性的要求升级，暂时不建议理解成申报路径完全重构。",
        evidenceLabel: EvidenceLabel.OFFICIAL,
        isAccepted: true,
        votes: [
          { userEmail: "demo@regscope.local", value: 1 },
          { userEmail: "cmc@regscope.local", value: 1 },
          { userEmail: "pv@regscope.local", value: 1 },
        ],
      },
      {
        authorEmail: "demo@regscope.local",
        body: "如果团队已经有模型验证与变更控制框架，当前更应该补治理证据而不是大改提交路径。",
        evidenceLabel: EvidenceLabel.EXPERIENCE,
        isAccepted: false,
        votes: [
          { userEmail: "analyst@regscope.local", value: 1 },
          { userEmail: "label@regscope.local", value: 1 },
        ],
      },
    ],
    views: [
      { userEmail: "demo@regscope.local", viewCount: 6 },
      { userEmail: "analyst@regscope.local", viewCount: 4 },
    ],
  },
  {
    slug: "cmc-change-control",
    title: "CMC 变更控制怎样判断是否需要补充稳定性数据？",
    summary: "不同地区对同类变更的证据要求不完全一致，关键在于先界定影响范围。",
    status: DiscussionStatus.CONTROVERSIAL,
    countrySlug: "eu",
    topicSlug: "cmc-and-manufacturing",
    createdByEmail: "demo@regscope.local",
    conclusion: {
      summary: "多数回复倾向于先看变更是否影响关键质量属性，再决定是否补充稳定性数据。",
      evidenceNote: "如果触及工艺、杂质或包装关键环节，通常需要更谨慎的评估。",
      updatedByEmail: "cmc@regscope.local",
    },
    evidence: [
      {
        title: "EMA CMC change evidence",
        url: "https://www.ema.europa.eu/demo/cmc-change-evidence",
        sourceLabel: EvidenceLabel.OFFICIAL,
        note: "用于确认官方对变更分层和支持性证据的表达。",
      },
      {
        title: "PMDA continuous manufacturing note",
        url: "https://www.pmda.go.jp/demo/continuous-manufacturing-note",
        sourceLabel: EvidenceLabel.ANALYSIS,
        note: "用于补充过程控制与放行逻辑的区域经验。",
      },
      {
        title: "Manufacturer stability memo",
        sourceLabel: EvidenceLabel.EXPERIENCE,
        note: "展示内部判断是否触发稳定性补充时常见的证据框架。",
      },
    ],
    answers: [
      {
        authorEmail: "cmc@regscope.local",
        body: "先看变更是否影响关键质量属性，如果影响边界清晰，再决定是否补充稳定性数据。",
        evidenceLabel: EvidenceLabel.ANALYSIS,
        isAccepted: true,
        votes: [
          { userEmail: "demo@regscope.local", value: 1 },
          { userEmail: "analyst@regscope.local", value: 1 },
          { userEmail: "pv@regscope.local", value: 1 },
        ],
      },
      {
        authorEmail: "demo@regscope.local",
        body: "如果只看单一区域经验，很容易把补充稳定性数据做成默认动作，反而增加不必要负担。",
        evidenceLabel: EvidenceLabel.EXPERIENCE,
        isAccepted: false,
        votes: [{ userEmail: "cmc@regscope.local", value: 1 }],
      },
    ],
    views: [
      { userEmail: "demo@regscope.local", viewCount: 5 },
      { userEmail: "cmc@regscope.local", viewCount: 3 },
    ],
  },
  {
    slug: "decentralized-trial-remote-consent",
    title: "去中心化临床中的远程知情同意材料需要补哪些证据？",
    summary: "问题核心不是能不能远程，而是企业如何证明流程可理解、可追溯、可复核。",
    status: DiscussionStatus.IN_REVIEW,
    countrySlug: "uk",
    topicSlug: "clinical-trials",
    createdByEmail: "demo@regscope.local",
    conclusion: {
      summary: "当前共识偏向于同步补足受试者理解证明、系统审计追踪和替代路径说明。",
      evidenceNote: "最好把远程流程图和异常场景处理说明一并准备。",
      updatedByEmail: "analyst@regscope.local",
    },
    evidence: [
      {
        title: "MHRA decentralized trial expectations",
        url: "https://www.gov.uk/demo/decentralized-trial-expectations",
        sourceLabel: EvidenceLabel.OFFICIAL,
        note: "用于确认远程知情同意、电子化材料和支持流程的底线要求。",
      },
      {
        title: "PMDA RWE early consultation",
        url: "https://www.pmda.go.jp/demo/rwe-early-consultation",
        sourceLabel: EvidenceLabel.ANALYSIS,
        note: "用于交叉比较真实世界与去中心化试验中的方法学说明要求。",
      },
    ],
    answers: [
      {
        authorEmail: "analyst@regscope.local",
        body: "建议把受试者理解确认方式和异常升级路径写得比传统中心化试验更细。",
        evidenceLabel: EvidenceLabel.OFFICIAL,
        isAccepted: true,
        votes: [
          { userEmail: "demo@regscope.local", value: 1 },
          { userEmail: "label@regscope.local", value: 1 },
        ],
      },
      {
        authorEmail: "label@regscope.local",
        body: "如果知情材料在不同终端呈现不一致，后续审计追踪很容易变成争议点。",
        evidenceLabel: EvidenceLabel.EXPERIENCE,
        isAccepted: false,
        votes: [{ userEmail: "analyst@regscope.local", value: 1 }],
      },
    ],
    views: [{ userEmail: "demo@regscope.local", viewCount: 2 }],
  },
  {
    slug: "signal-detection-ai-triage",
    title: "药物警戒里用 AI 做信号初筛，监管最看重哪些控制点？",
    summary: "企业普遍希望提速，但监管更关注筛选逻辑、人工复核和偏差控制。",
    status: DiscussionStatus.OPEN,
    countrySlug: "ca",
    topicSlug: "pharmacovigilance",
    createdByEmail: "demo@regscope.local",
    conclusion: {
      summary: "目前最稳妥的做法是把 AI 放在初筛层，并保留人工复核、阈值管理和审计追踪。",
      evidenceNote: "在没有更明确区域性细则前，不宜把 AI 结果直接视为最终医学判断。",
      updatedByEmail: "pv@regscope.local",
    },
    evidence: [
      {
        title: "Health Canada PV deadline alert",
        url: "https://www.canada.ca/demo/pv-deadline-alert",
        sourceLabel: EvidenceLabel.OFFICIAL,
        note: "用于确认安全性报告时限和责任分工的最低要求。",
      },
      {
        title: "NMPA signal workflow update",
        url: "https://www.nmpa.gov.cn/demo/signal-workflow-update",
        sourceLabel: EvidenceLabel.OFFICIAL,
        note: "用于观察信号初筛到升级的流程边界。",
      },
      {
        title: "Vendor algorithm brief",
        sourceLabel: EvidenceLabel.UNVERIFIED,
        note: "展示尚未被官方明确认可的外部工具论点。",
      },
    ],
    answers: [
      {
        authorEmail: "pv@regscope.local",
        body: "AI 更适合帮助缩小信号池，而不是替代人工医学判断与最终上报决策。",
        evidenceLabel: EvidenceLabel.OFFICIAL,
        isAccepted: true,
        votes: [
          { userEmail: "demo@regscope.local", value: 1 },
          { userEmail: "analyst@regscope.local", value: 1 },
        ],
      },
      {
        authorEmail: "analyst@regscope.local",
        body: "如果没有阈值管理和误报复盘机制，AI 初筛很难在审计里站住脚。",
        evidenceLabel: EvidenceLabel.ANALYSIS,
        isAccepted: false,
        votes: [{ userEmail: "pv@regscope.local", value: 1 }],
      },
    ],
    views: [{ userEmail: "demo@regscope.local", viewCount: 1 }],
  },
  {
    slug: "labeling-digital-supplement",
    title: "数字化标签补充信息可以替代纸面说明书更新吗？",
    summary: "监管方普遍接受补充路径，但对主文件与数字补充信息的边界仍较谨慎。",
    status: DiscussionStatus.PROVISIONAL_CONCLUSION,
    countrySlug: "cn",
    topicSlug: "labeling-and-insert",
    createdByEmail: "demo@regscope.local",
    conclusion: {
      summary: "更现实的方向是让数字化内容承担补充说明，而不是替代主说明书的法定更新职责。",
      evidenceNote: "需要把版本控制、访问可得性和风险提示优先级讲清楚。",
      updatedByEmail: "label@regscope.local",
    },
    evidence: [
      {
        title: "NMPA labeling template consultation",
        url: "https://www.nmpa.gov.cn/demo/labeling-template-consultation",
        sourceLabel: EvidenceLabel.OFFICIAL,
        note: "用于确认说明书主文件的结构和法定边界。",
      },
      {
        title: "Health Canada digital labeling policy",
        url: "https://www.canada.ca/demo/digital-labeling-policy",
        sourceLabel: EvidenceLabel.ANALYSIS,
        note: "用于观察数字化补充信息在标签治理中的可接受边界。",
      },
    ],
    answers: [
      {
        authorEmail: "label@regscope.local",
        body: "二维码和数字化补充信息更适合承载解释性材料，但主说明书的法定义务短期内仍不会消失。",
        evidenceLabel: EvidenceLabel.OFFICIAL,
        isAccepted: true,
        votes: [
          { userEmail: "demo@regscope.local", value: 1 },
          { userEmail: "analyst@regscope.local", value: 1 },
        ],
      },
      {
        authorEmail: "demo@regscope.local",
        body: "如果数字化内容版本控制做不好，反而会放大标签更新后的合规风险。",
        evidenceLabel: EvidenceLabel.EXPERIENCE,
        isAccepted: false,
        votes: [{ userEmail: "label@regscope.local", value: 1 }],
      },
    ],
    views: [{ userEmail: "demo@regscope.local", viewCount: 3 }],
  },
];

async function main() {
  const topTopicRecords = await Promise.all(
    topTopics.map((topic) =>
      prisma.topic.upsert({
        where: { slug: topic.slug },
        update: { name: topic.name, level: 1, parentId: null },
        create: { slug: topic.slug, name: topic.name, level: 1 },
      }),
    ),
  );

  const topTopicMap = new Map(topTopicRecords.map((topic) => [topic.slug, topic]));

  await Promise.all(
    representativeSubtopics.map((topic) =>
      prisma.topic.upsert({
        where: { slug: topic.slug },
        update: {
          name: topic.name,
          level: 2,
          parentId: topTopicMap.get(topic.parentSlug)?.id,
        },
        create: {
          slug: topic.slug,
          name: topic.name,
          level: 2,
          parentId: topTopicMap.get(topic.parentSlug)?.id,
        },
      }),
    ),
  );

  const topicRecords = await prisma.topic.findMany({
    where: {
      slug: {
        in: [...topTopics.map((topic) => topic.slug), ...representativeSubtopics.map((topic) => topic.slug)],
      },
    },
  });
  const topicMap = new Map(topicRecords.map((topic) => [topic.slug, topic]));

  const countryRecords = await Promise.all(
    countrySeeds.map((country) =>
      prisma.country.upsert({
        where: { slug: country.slug },
        update: { name: country.name, region: country.region },
        create: { slug: country.slug, name: country.name, region: country.region },
      }),
    ),
  );
  const countryMap = new Map(countryRecords.map((country) => [country.slug, country]));

  const sourceRecords = await Promise.all(
    sourceSeeds.map((source) =>
      prisma.source.upsert({
        where: { slug: source.slug },
        update: {
          name: source.name,
          description: source.description,
          websiteUrl: source.websiteUrl,
          feedUrl: source.feedUrl,
          feedFormat: source.feedFormat,
          countryId: countryMap.get(source.countrySlug)?.id,
          isOfficial: true,
          isActive: true,
        },
        create: {
          slug: source.slug,
          name: source.name,
          description: source.description,
          websiteUrl: source.websiteUrl,
          feedUrl: source.feedUrl,
          feedFormat: source.feedFormat,
          countryId: countryMap.get(source.countrySlug)?.id,
          isOfficial: true,
          isActive: true,
        },
      }),
    ),
  );
  const sourceMap = new Map(sourceRecords.map((source) => [source.slug, source]));

  const userRecords = await Promise.all(
    userSeeds.map((user) =>
      prisma.user.upsert({
        where: { email: user.email },
        update: { name: user.name },
        create: { email: user.email, name: user.name },
      }),
    ),
  );
  const userMap = new Map(userRecords.map((user) => [user.email, user]));

  for (const follow of followSeeds) {
    const userId = userMap.get(follow.userEmail)?.id ?? "";
    const countryId = "countrySlug" in follow ? countryMap.get(follow.countrySlug)?.id ?? null : null;
    const topicId = "topicSlug" in follow ? topicMap.get(follow.topicSlug)?.id ?? null : null;
    const existingFollow = await prisma.follow.findFirst({
      where: {
        userId,
        targetType: follow.targetType,
        countryId,
        sourceId: null,
        topicId,
      },
      select: { id: true },
    });

    if (!existingFollow) {
      await prisma.follow.create({
        data: {
          userId,
          targetType: follow.targetType,
          countryId,
          topicId,
        },
      });
    }
  }

  for (const item of contentSeeds) {
    await prisma.contentItem.upsert({
      where: { canonicalUrl: item.canonicalUrl },
      update: {
        slug: item.slug,
        title: item.title,
        summary: item.summary,
        body: item.body,
        publishedAt: hoursAgo(item.hoursAgo),
        contentType: item.contentType,
        sourceId: sourceMap.get(item.sourceSlug)?.id,
        countryId: countryMap.get(item.countrySlug)?.id,
        primaryTopicId: topicMap.get(item.topicSlug)?.id,
      },
      create: {
        slug: item.slug,
        title: item.title,
        summary: item.summary,
        body: item.body,
        canonicalUrl: item.canonicalUrl,
        publishedAt: hoursAgo(item.hoursAgo),
        contentType: item.contentType,
        sourceId: sourceMap.get(item.sourceSlug)?.id ?? "",
        countryId: countryMap.get(item.countrySlug)?.id,
        primaryTopicId: topicMap.get(item.topicSlug)?.id,
      },
    });
  }

  for (const discussion of discussionSeeds) {
    const discussionRecord = await prisma.discussion.upsert({
      where: { slug: discussion.slug },
      update: {
        title: discussion.title,
        summary: discussion.summary,
        status: discussion.status,
        countryId: countryMap.get(discussion.countrySlug)?.id,
        topicId: topicMap.get(discussion.topicSlug)?.id,
        createdById: userMap.get(discussion.createdByEmail)?.id ?? "",
      },
      create: {
        slug: discussion.slug,
        title: discussion.title,
        summary: discussion.summary,
        status: discussion.status,
        countryId: countryMap.get(discussion.countrySlug)?.id,
        topicId: topicMap.get(discussion.topicSlug)?.id,
        createdById: userMap.get(discussion.createdByEmail)?.id ?? "",
      },
    });

    await prisma.discussionConclusion.upsert({
      where: { discussionId: discussionRecord.id },
      update: {
        summary: discussion.conclusion.summary,
        evidenceNote: discussion.conclusion.evidenceNote,
        updatedById: userMap.get(discussion.conclusion.updatedByEmail)?.id,
      },
      create: {
        discussionId: discussionRecord.id,
        summary: discussion.conclusion.summary,
        evidenceNote: discussion.conclusion.evidenceNote,
        updatedById: userMap.get(discussion.conclusion.updatedByEmail)?.id,
      },
    });

    for (const evidence of discussion.evidence) {
      await prisma.discussionEvidence.upsert({
        where: {
          discussionId_title: {
            discussionId: discussionRecord.id,
            title: evidence.title,
          },
        },
        update: {
          url: evidence.url ?? null,
          sourceLabel: evidence.sourceLabel,
          note: evidence.note ?? null,
        },
        create: {
          discussionId: discussionRecord.id,
          title: evidence.title,
          url: evidence.url ?? null,
          sourceLabel: evidence.sourceLabel,
          note: evidence.note ?? null,
        },
      });
    }

    for (const answer of discussion.answers) {
      const authorId = userMap.get(answer.authorEmail)?.id;

      const answerRecord = await prisma.answer.upsert({
        where: {
          discussionId_authorId_body: {
            discussionId: discussionRecord.id,
            authorId: authorId ?? "",
            body: answer.body,
          },
        },
        update: {
          evidenceLabel: answer.evidenceLabel,
          isAccepted: answer.isAccepted,
        },
        create: {
          discussionId: discussionRecord.id,
          authorId: authorId ?? "",
          body: answer.body,
          evidenceLabel: answer.evidenceLabel,
          isAccepted: answer.isAccepted,
        },
      });

      for (const vote of answer.votes ?? []) {
        await prisma.answerVote.upsert({
          where: {
            answerId_userId: {
              answerId: answerRecord.id,
              userId: userMap.get(vote.userEmail)?.id ?? "",
            },
          },
          update: {
            value: vote.value,
          },
          create: {
            answerId: answerRecord.id,
            userId: userMap.get(vote.userEmail)?.id ?? "",
            value: vote.value,
          },
        });
      }
    }

    for (const view of discussion.views ?? []) {
      await prisma.discussionView.upsert({
        where: {
          userId_discussionId: {
            userId: userMap.get(view.userEmail)?.id ?? "",
            discussionId: discussionRecord.id,
          },
        },
        update: {
          viewCount: view.viewCount,
        },
        create: {
          userId: userMap.get(view.userEmail)?.id ?? "",
          discussionId: discussionRecord.id,
          viewCount: view.viewCount,
        },
      });
    }
  }
}

function hoursAgo(hours: number) {
  return new Date(Date.now() - hours * 60 * 60 * 1000);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export type PetTierSlug = "FANZAI" | "MENGLING" | "ZHENCHONG" | "LINGZUN" | "SHENSHOU";
export type PetGrowthStage = "BABY" | "GROWING" | "MATURE";
export type PetEventType = "DAILY_QUESTION" | "COMMENT" | "ARTICLE" | "DISCUSSION_POST";
export type PetMotionPreset =
  | "wag"
  | "pounce"
  | "nibble"
  | "hop"
  | "swim"
  | "glide"
  | "perch"
  | "curl"
  | "stalk"
  | "soar"
  | "ripple"
  | "orbit"
  | "stride"
  | "wingbeat"
  | "guard";
export type PetFamily =
  | "feline"
  | "canine"
  | "rodent"
  | "rabbit"
  | "fish"
  | "bird"
  | "primate"
  | "fox"
  | "bigcat"
  | "cetacean"
  | "dragon"
  | "qilin"
  | "guardian";

export type PetStageVisual = {
  scale: number;
  ornamentLevel: number;
  aura: "none" | "soft" | "radiant";
};

export type PetTierDefinition = {
  slug: PetTierSlug;
  name: string;
  sortOrder: number;
  flavor: string;
};

export type PetSpeciesDefinition = {
  slug: string;
  name: string;
  title: string;
  tierSlug: PetTierSlug;
  family: PetFamily;
  motionPreset: PetMotionPreset;
  visualStyle: string;
  traitKeywords: string[];
  colors: {
    body: string;
    accent: string;
    aura: string;
  };
  growthStageConfig: Record<PetGrowthStage, PetStageVisual>;
};

const defaultGrowthStages: Record<PetGrowthStage, PetStageVisual> = {
  BABY: { scale: 0.82, ornamentLevel: 1, aura: "none" },
  GROWING: { scale: 0.94, ornamentLevel: 2, aura: "soft" },
  MATURE: { scale: 1.06, ornamentLevel: 3, aura: "radiant" },
};

function species(
  data: Omit<PetSpeciesDefinition, "growthStageConfig"> & {
    growthStageConfig?: Record<PetGrowthStage, PetStageVisual>;
  },
): PetSpeciesDefinition {
  return {
    ...data,
    growthStageConfig: data.growthStageConfig ?? defaultGrowthStages,
  };
}

export const petTiers: readonly PetTierDefinition[] = [
  { slug: "FANZAI", name: "凡崽", sortOrder: 1, flavor: "凡间萌崽，亲近、圆润、新手友好。" },
  { slug: "MENGLING", name: "萌灵", sortOrder: 2, flavor: "灵动治愈，开始展现互动感与灵气。" },
  { slug: "ZHENCHONG", name: "珍宠", sortOrder: 3, flavor: "珍稀高颜值，兼具展示感与收藏欲。" },
  { slug: "LINGZUN", name: "灵尊", sortOrder: 4, flavor: "半神性灵物，气场、灵性与稀有度兼备。" },
  { slug: "SHENSHOU", name: "神兽", sortOrder: 5, flavor: "顶级传说瑞兽，具备图腾感与仪式感。" },
] as const;

export const petSpecies: readonly PetSpeciesDefinition[] = [
  species({
    slug: "garden-cat",
    name: "中华田园猫",
    title: "本土守护喵",
    tierSlug: "FANZAI",
    family: "feline",
    motionPreset: "pounce",
    visualStyle: "圆脸奶猫，暖色毛流和大眼睛。",
    traitKeywords: ["奶猫", "圆脸", "暖棕色", "踩奶"],
    colors: { body: "#f0b778", accent: "#9f5324", aura: "#f6e4cc" },
  }),
  species({
    slug: "garden-dog",
    name: "中华田园犬",
    title: "忠诚小守卫",
    tierSlug: "FANZAI",
    family: "canine",
    motionPreset: "wag",
    visualStyle: "短鼻幼犬，温顺亲近，耳朵略翘。",
    traitKeywords: ["幼犬", "摇尾", "暖棕", "忠诚"],
    colors: { body: "#d5a06b", accent: "#7b4d24", aura: "#f3ddc2" },
  }),
  species({
    slug: "triple-stripe-hamster",
    name: "三线仓鼠",
    title: "掌心团子",
    tierSlug: "FANZAI",
    family: "rodent",
    motionPreset: "nibble",
    visualStyle: "鼓脸小团子，体型极圆，背线清晰。",
    traitKeywords: ["团子", "搓手", "背线", "软萌"],
    colors: { body: "#d8c3a2", accent: "#7f6853", aura: "#efe3d2" },
  }),
  species({
    slug: "lop-rabbit",
    name: "垂耳兔",
    title: "绒耳小跳崽",
    tierSlug: "FANZAI",
    family: "rabbit",
    motionPreset: "hop",
    visualStyle: "垂耳幼兔，绵软圆润，奶油白毛。",
    traitKeywords: ["垂耳", "轻跳", "奶白", "绒毛"],
    colors: { body: "#f6f0ea", accent: "#c9a988", aura: "#f9f2e8" },
  }),
  species({
    slug: "goldfish",
    name: "草金鱼",
    title: "水泡小金灵",
    tierSlug: "FANZAI",
    family: "fish",
    motionPreset: "swim",
    visualStyle: "Q 弹小金鱼，尾鳍轻薄，颜色鲜亮。",
    traitKeywords: ["摆尾", "泡泡", "亮橙", "水纹"],
    colors: { body: "#f49c33", accent: "#d45517", aura: "#dff4fb" },
  }),

  species({
    slug: "ragdoll-cat",
    name: "布偶猫",
    title: "云绒布偶",
    tierSlug: "MENGLING",
    family: "feline",
    motionPreset: "curl",
    visualStyle: "蓝眼长毛，软云般大尾巴与仙气脸盘。",
    traitKeywords: ["蓝眼", "长毛", "治愈", "抬爪"],
    colors: { body: "#efe7df", accent: "#7e97b7", aura: "#ebf2fd" },
  }),
  species({
    slug: "samoyed",
    name: "萨摩耶",
    title: "微笑云犬",
    tierSlug: "MENGLING",
    family: "canine",
    motionPreset: "wag",
    visualStyle: "雪白蓬松，笑脸明显，云团般尾巴。",
    traitKeywords: ["微笑", "雪白", "蓬松", "扑跳"],
    colors: { body: "#f5f8fc", accent: "#7aa5d8", aura: "#eef7ff" },
  }),
  species({
    slug: "chinchilla",
    name: "龙猫（毛丝鼠）",
    title: "静谧毛团",
    tierSlug: "MENGLING",
    family: "rodent",
    motionPreset: "nibble",
    visualStyle: "灰白毛团，圆耳厚毛，安静且治愈。",
    traitKeywords: ["圆耳", "抱爪", "柔软", "静谧"],
    colors: { body: "#d8d6dd", accent: "#7b6f88", aura: "#f0eef7" },
  }),
  species({
    slug: "sugar-glider",
    name: "蜜袋鼯",
    title: "滑翔口袋灵",
    tierSlug: "MENGLING",
    family: "rodent",
    motionPreset: "glide",
    visualStyle: "大眼滑翔宠，薄膜翅翼感明显。",
    traitKeywords: ["滑翔", "大眼", "灵动", "夜行"],
    colors: { body: "#c7c0b7", accent: "#6b5d58", aura: "#e8ebff" },
  }),
  species({
    slug: "cockatiel",
    name: "玄凤鹦鹉",
    title: "鸣羽小灵鸟",
    tierSlug: "MENGLING",
    family: "bird",
    motionPreset: "perch",
    visualStyle: "冠羽鲜明，脸颊橙斑，爱歪头。",
    traitKeywords: ["冠羽", "歪头", "吹口哨", "互动"],
    colors: { body: "#e6dfc8", accent: "#ef8d3d", aura: "#f7f1d9" },
  }),

  species({
    slug: "red-panda",
    name: "小熊猫",
    title: "抱尾红团",
    tierSlug: "ZHENCHONG",
    family: "feline",
    motionPreset: "curl",
    visualStyle: "红棕蓬尾，面罩纹明显，转身时极有记忆点。",
    traitKeywords: ["大尾巴", "攀爬", "面罩纹", "红棕"],
    colors: { body: "#cc6e3a", accent: "#5f2e1e", aura: "#ffe5d6" },
  }),
  species({
    slug: "golden-snub-nosed-monkey",
    name: "川金丝猴",
    title: "金面山灵",
    tierSlug: "ZHENCHONG",
    family: "primate",
    motionPreset: "stride",
    visualStyle: "蓝面金毛，长肢轻盈，山林精灵感明显。",
    traitKeywords: ["蓝面", "金毛", "抓藤", "山岚"],
    colors: { body: "#f0bf57", accent: "#4f6b90", aura: "#f8edd0" },
  }),
  species({
    slug: "red-crowned-crane",
    name: "丹顶鹤",
    title: "云水仙禽",
    tierSlug: "ZHENCHONG",
    family: "bird",
    motionPreset: "wingbeat",
    visualStyle: "长颈长腿，白羽红顶，仙气强。",
    traitKeywords: ["展翅", "踏水", "红顶", "长尾羽"],
    colors: { body: "#f5f5f3", accent: "#d34b4b", aura: "#e8f2fb" },
  }),
  species({
    slug: "serval",
    name: "薮猫",
    title: "斑点疾影",
    tierSlug: "ZHENCHONG",
    family: "bigcat",
    motionPreset: "stalk",
    visualStyle: "高腿斑点猫，耳尖毛明显，动作利落。",
    traitKeywords: ["修长", "豹纹", "耳尖", "轻跃"],
    colors: { body: "#d3b06c", accent: "#5a4726", aura: "#f7ead0" },
  }),
  species({
    slug: "fennec-fox",
    name: "耳廓狐",
    title: "沙海大耳灵",
    tierSlug: "ZHENCHONG",
    family: "fox",
    motionPreset: "pounce",
    visualStyle: "夸张大耳朵，沙色轻盈，机敏灵巧。",
    traitKeywords: ["大耳朵", "沙色", "轻跳", "侦测"],
    colors: { body: "#f2d0a0", accent: "#8a5f34", aura: "#fff1de" },
  }),

  species({
    slug: "nine-tail-fox",
    name: "九尾灵狐",
    title: "流焰九尾",
    tierSlug: "LINGZUN",
    family: "fox",
    motionPreset: "orbit",
    visualStyle: "灵狐姿态优雅，多尾层叠，尾尖灵火。",
    traitKeywords: ["九尾", "灵火", "回眸", "魅惑"],
    colors: { body: "#f7f1fb", accent: "#c77aff", aura: "#f0e1ff" },
  }),
  species({
    slug: "snow-leopard",
    name: "雪豹",
    title: "踏雪灵王",
    tierSlug: "LINGZUN",
    family: "bigcat",
    motionPreset: "stalk",
    visualStyle: "银灰雪纹，步态轻而强，寒雾随行。",
    traitKeywords: ["雪纹", "踏雪", "伏行", "冷峻"],
    colors: { body: "#d9e3ec", accent: "#60748c", aura: "#edf7ff" },
  }),
  species({
    slug: "south-china-tiger",
    name: "华南虎",
    title: "赤纹山君",
    tierSlug: "LINGZUN",
    family: "bigcat",
    motionPreset: "stride",
    visualStyle: "虎纹更图腾化，肩背厚重，王者气足。",
    traitKeywords: ["虎纹", "王者", "低吼", "厚重"],
    colors: { body: "#d47838", accent: "#3b2615", aura: "#ffe3d0" },
  }),
  species({
    slug: "golden-eagle",
    name: "金雕",
    title: "天穹猎翼",
    tierSlug: "LINGZUN",
    family: "bird",
    motionPreset: "soar",
    visualStyle: "金棕羽翼，目光锐利，风痕明显。",
    traitKeywords: ["展翼", "盘旋", "俯冲", "天空霸主"],
    colors: { body: "#8c5b2d", accent: "#e3a34d", aura: "#fbe6be" },
  }),
  species({
    slug: "baiji",
    name: "白鱀豚",
    title: "江灵水使",
    tierSlug: "LINGZUN",
    family: "cetacean",
    motionPreset: "ripple",
    visualStyle: "纯净白豚，流线优雅，周身水纹环绕。",
    traitKeywords: ["水纹", "跃游", "空灵", "长江女神"],
    colors: { body: "#e7f1f6", accent: "#67b6c8", aura: "#e0fbff" },
  }),

  species({
    slug: "qilin",
    name: "麒麟",
    title: "踏云瑞主",
    tierSlug: "SHENSHOU",
    family: "qilin",
    motionPreset: "guard",
    visualStyle: "鹿角鳞身，火蹄云鬃，瑞气明显。",
    traitKeywords: ["鹿角", "鳞纹", "瑞云", "火蹄"],
    colors: { body: "#eabf63", accent: "#b4512d", aura: "#ffe9b8" },
    growthStageConfig: {
      BABY: { scale: 0.78, ornamentLevel: 1, aura: "soft" },
      GROWING: { scale: 0.94, ornamentLevel: 2, aura: "soft" },
      MATURE: { scale: 1.08, ornamentLevel: 4, aura: "radiant" },
    },
  }),
  species({
    slug: "azure-dragon",
    name: "青龙",
    title: "东极苍龙",
    tierSlug: "SHENSHOU",
    family: "dragon",
    motionPreset: "orbit",
    visualStyle: "长身盘旋，龙须与云水相随，东方木水灵性极强。",
    traitKeywords: ["盘旋", "龙须", "云雷", "长身"],
    colors: { body: "#3f9f87", accent: "#17564f", aura: "#d8fff4" },
    growthStageConfig: {
      BABY: { scale: 0.8, ornamentLevel: 1, aura: "soft" },
      GROWING: { scale: 0.98, ornamentLevel: 3, aura: "radiant" },
      MATURE: { scale: 1.12, ornamentLevel: 4, aura: "radiant" },
    },
  }),
  species({
    slug: "white-tiger",
    name: "白虎",
    title: "霜纹虎神",
    tierSlug: "SHENSHOU",
    family: "guardian",
    motionPreset: "stride",
    visualStyle: "银白虎躯配神纹，肩背锋利，肃杀威严。",
    traitKeywords: ["银白", "神纹", "锋爪", "低吼"],
    colors: { body: "#edf1f7", accent: "#7f8aa1", aura: "#f5fbff" },
    growthStageConfig: {
      BABY: { scale: 0.8, ornamentLevel: 1, aura: "soft" },
      GROWING: { scale: 0.97, ornamentLevel: 3, aura: "radiant" },
      MATURE: { scale: 1.1, ornamentLevel: 4, aura: "radiant" },
    },
  }),
  species({
    slug: "vermilion-bird",
    name: "朱雀",
    title: "焰羽天华",
    tierSlug: "SHENSHOU",
    family: "bird",
    motionPreset: "wingbeat",
    visualStyle: "赤羽火鸟，长尾焰羽，升腾感极强。",
    traitKeywords: ["赤羽", "火焰", "升空", "焰尾"],
    colors: { body: "#ea664f", accent: "#ffb067", aura: "#ffe2d6" },
    growthStageConfig: {
      BABY: { scale: 0.8, ornamentLevel: 1, aura: "soft" },
      GROWING: { scale: 0.97, ornamentLevel: 3, aura: "radiant" },
      MATURE: { scale: 1.1, ornamentLevel: 4, aura: "radiant" },
    },
  }),
  species({
    slug: "xuanwu",
    name: "玄武",
    title: "玄甲镇渊",
    tierSlug: "SHENSHOU",
    family: "guardian",
    motionPreset: "guard",
    visualStyle: "龟蛇双体，甲纹发光，厚重守护感明显。",
    traitKeywords: ["龟甲", "蛇灵", "守护", "北水"],
    colors: { body: "#5a6678", accent: "#92c6c6", aura: "#deeff5" },
    growthStageConfig: {
      BABY: { scale: 0.82, ornamentLevel: 1, aura: "soft" },
      GROWING: { scale: 0.98, ornamentLevel: 3, aura: "radiant" },
      MATURE: { scale: 1.08, ornamentLevel: 4, aura: "radiant" },
    },
  }),
] as const;

export const petTierBySlug = Object.fromEntries(petTiers.map((tier) => [tier.slug, tier])) as Record<PetTierSlug, PetTierDefinition>;
export const petSpeciesBySlug = Object.fromEntries(petSpecies.map((item) => [item.slug, item])) as Record<string, PetSpeciesDefinition>;

export function getSpeciesForTier(tierSlug: PetTierSlug) {
  return petSpecies.filter((item) => item.tierSlug === tierSlug);
}

export function getTierByOrder(order: number) {
  return petTiers.find((item) => item.sortOrder === order) ?? null;
}

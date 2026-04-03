import path from "node:path";

export type QuizQuestionImportRecord = {
  sourceNumber: number;
  sequence: number;
  typeLabel: string;
  difficultyLabel: string | null;
  prompt: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  legalBasis: string;
  explanation: string;
};

const QUESTION_HEADER_REGEX = /^##\s+(.+?)\s+(\d+)\s*$/gm;

function cleanText(value: string) {
  return value.replace(/\r/g, "").replace(/\n+/g, " ").replace(/\s{2,}/g, " ").trim();
}

function matchField(block: string, regex: RegExp, label: string) {
  const match = block.match(regex);
  if (!match?.[1]) {
    throw new Error(`Missing field: ${label}`);
  }

  return cleanText(match[1]);
}

function parseOptions(block: string, typeLabel: string) {
  if (!block.includes("**选项**：")) {
    if (typeLabel.includes("判断题")) {
      return {
        optionA: "正确",
        optionB: "错误",
        optionC: "",
        optionD: "",
      };
    }

    throw new Error("Missing options section.");
  }

  const optionsMatch = block.match(/\*\*选项\*\*：([\s\S]*?)\n\n\*\*标准答案\*\*：/);
  if (!optionsMatch?.[1]) {
    throw new Error("Missing options section.");
  }
  const optionsSection = optionsMatch[1].trim();
  const options = Array.from(optionsSection.matchAll(/^([A-D])\.\s+(.+)$/gm));

  if (options.length < 2 || options.length > 4) {
    throw new Error("Each quiz question must contain between two and four options.");
  }

  const map = Object.fromEntries(options.map((match) => [match[1], cleanText(match[2])])) as Record<string, string>;

  return {
    optionA: map.A ?? "",
    optionB: map.B ?? "",
    optionC: map.C ?? "",
    optionD: map.D ?? "",
  };
}

function parseCorrectOption(block: string, typeLabel: string) {
  const match = block.match(/\*\*标准答案\*\*：([^\n]+)/);
  if (!match) {
    throw new Error("Missing or invalid correct option.");
  }

  const normalized = cleanText(match[1]);
  if (/^[A-D]{1,4}$/.test(normalized)) {
    return normalized;
  }
  if (typeLabel.includes("判断题")) {
    if (normalized === "正确") {
      return "A";
    }
    if (normalized === "错误") {
      return "B";
    }
  }

  throw new Error(`Unsupported correct option "${normalized}".`);
}

export function parseQuizQuestionBankMarkdown(markdown: string) {
  const normalized = markdown.replace(/\r/g, "");
  const matches = Array.from(normalized.matchAll(QUESTION_HEADER_REGEX));

  return matches.map((match, index) => {
    const blockStart = match.index ?? 0;
    const blockEnd = matches[index + 1]?.index ?? normalized.length;
    const block = normalized.slice(blockStart, blockEnd).trim();
    const typeLabel = cleanText(match[1]);
    const sourceNumber = Number.parseInt(match[2], 10);
    const difficultyLabel = matchField(block, /\*\*难度\*\*：([^\n]+)/, "**难度**：");
    const prompt = matchField(block, /\*\*题干\*\*：([\s\S]*?)(?:\n\n\*\*选项\*\*：|\n\n\*\*标准答案\*\*：)/, "**题干**：");
    const correctOption = parseCorrectOption(block, typeLabel);
    const legalBasis = matchField(block, /\*\*法规依据\/条款来源\*\*：([^\n]+)/, "**法规依据/条款来源**：");
    const explanation = matchField(block, /\*\*简要解析\*\*：([\s\S]*?)$/, "**简要解析**：");
    const options = parseOptions(block, typeLabel);

    return {
      sourceNumber,
      sequence: index + 1,
      typeLabel,
      difficultyLabel,
      prompt,
      ...options,
      correctOption,
      legalBasis,
      explanation,
    } satisfies QuizQuestionImportRecord;
  });
}

export function getDefaultQuizQuestionBankPath() {
  return path.join(process.cwd(), "医药注册法规与考题库", "医药注册法规与模拟考题库（200题）.md");
}

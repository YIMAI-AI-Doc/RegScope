import { readFile } from "node:fs/promises";
import { prisma } from "@/lib/db";
import { formatQuizDateLabel, getQuizDateKey, getQuizDayOffset } from "@/lib/quiz/date";
import { getDefaultQuizQuestionBankPath, parseQuizQuestionBankMarkdown } from "@/lib/quiz/parser";

export type DailyQuizOptionKey = "A" | "B" | "C" | "D";

export type DailyQuizPanelData = {
  dateKey: string;
  dateLabel: string;
  sequence: number;
  typeLabel: string;
  difficultyLabel: string | null;
  prompt: string;
  options: Array<{ key: DailyQuizOptionKey; text: string }>;
  allowsMultiple: boolean;
  canAnswer: boolean;
  loginRequired: boolean;
  hasAnswered: boolean;
  selectedOption: string | null;
  isCorrect: boolean | null;
  correctOption: string | null;
  legalBasis: string | null;
  explanation: string | null;
  statusNote?: string | null;
  stats: {
    correctCount: number;
    incorrectCount: number;
    totalCount: number;
    correctRatio: number;
    incorrectRatio: number;
  } | null;
};

const FALLBACK_START_DATE_KEY = "2026-04-04";

type AssignmentWithQuestion = NonNullable<Awaited<ReturnType<typeof ensureDailyQuizAssignment>>>;

function buildOptions(question: AssignmentWithQuestion["question"]) {
  return [
    { key: "A" as const, text: question.optionA },
    { key: "B" as const, text: question.optionB },
    { key: "C" as const, text: question.optionC },
    { key: "D" as const, text: question.optionD },
  ].filter((option) => option.text.trim().length > 0);
}

async function ensureDailyQuizAssignment(dateKey = getQuizDateKey()) {
  const existing = await prisma.dailyQuizAssignment.findUnique({
    where: { dateKey },
    include: { question: true },
  });

  if (existing) {
    return existing;
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const current = await tx.dailyQuizAssignment.findUnique({
        where: { dateKey },
        include: { question: true },
      });
      if (current) {
        return current;
      }

      const lastAssignment = await tx.dailyQuizAssignment.findFirst({
        orderBy: [{ dateKey: "desc" }, { createdAt: "desc" }],
      });

      const nextQuestion =
        (lastAssignment
          ? await tx.quizQuestion.findFirst({
              where: {
                isActive: true,
                sequence: { gt: lastAssignment.sequence },
              },
              orderBy: { sequence: "asc" },
            })
          : null) ??
        (await tx.quizQuestion.findFirst({
          where: { isActive: true },
          orderBy: { sequence: "asc" },
        }));

      if (!nextQuestion) {
        return null;
      }

      return tx.dailyQuizAssignment.create({
        data: {
          dateKey,
          questionId: nextQuestion.id,
          sequence: nextQuestion.sequence,
        },
        include: { question: true },
      });
    });
  } catch {
    return prisma.dailyQuizAssignment.findUnique({
      where: { dateKey },
      include: { question: true },
    });
  }
}

async function getDailyQuizStats(assignmentId: string) {
  const [correctCount, incorrectCount] = await Promise.all([
    prisma.dailyQuizResponse.count({ where: { assignmentId, isCorrect: true } }),
    prisma.dailyQuizResponse.count({ where: { assignmentId, isCorrect: false } }),
  ]);

  const totalCount = correctCount + incorrectCount;
  const correctRatio = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  return {
    correctCount,
    incorrectCount,
    totalCount,
    correctRatio,
    incorrectRatio: totalCount > 0 ? 100 - correctRatio : 0,
  };
}

function toPanelData(args: {
  assignment: AssignmentWithQuestion;
  canAnswer: boolean;
  response: { selectedOption: string; isCorrect: boolean } | null;
  stats: Awaited<ReturnType<typeof getDailyQuizStats>> | null;
}) {
  const { assignment, canAnswer, response, stats } = args;

  return {
    dateKey: assignment.dateKey,
    dateLabel: formatQuizDateLabel(assignment.dateKey),
    sequence: assignment.question.sequence,
    typeLabel: assignment.question.typeLabel,
    difficultyLabel: assignment.question.difficultyLabel,
    prompt: assignment.question.prompt,
    options: buildOptions(assignment.question),
    allowsMultiple: assignment.question.typeLabel.includes("多选题") || assignment.question.correctOption.length > 1,
    canAnswer,
    loginRequired: !canAnswer,
    hasAnswered: Boolean(response),
    selectedOption: response?.selectedOption ?? null,
    isCorrect: response?.isCorrect ?? null,
    correctOption: response ? assignment.question.correctOption : null,
    legalBasis: response ? assignment.question.legalBasis : null,
    explanation: response ? assignment.question.explanation : null,
    statusNote: null,
    stats: response ? stats : null,
  } satisfies DailyQuizPanelData;
}

async function getFallbackDailyQuizPanelData(dateKey = getQuizDateKey()) {
  const markdown = await readFile(getDefaultQuizQuestionBankPath(), "utf8");
  const questions = parseQuizQuestionBankMarkdown(markdown);
  if (questions.length === 0) {
    return null;
  }

  const offset = Math.max(0, getQuizDayOffset(FALLBACK_START_DATE_KEY, dateKey));
  const question = questions[offset % questions.length];

  return {
    dateKey,
    dateLabel: formatQuizDateLabel(dateKey),
    sequence: question.sequence,
    typeLabel: question.typeLabel,
    difficultyLabel: question.difficultyLabel,
    prompt: question.prompt,
    options: [
      { key: "A" as const, text: question.optionA },
      { key: "B" as const, text: question.optionB },
      { key: "C" as const, text: question.optionC },
      { key: "D" as const, text: question.optionD },
    ].filter((option) => option.text.trim().length > 0),
    allowsMultiple: question.correctOption.length > 1 || question.typeLabel.includes("多选题"),
    canAnswer: false,
    loginRequired: false,
    hasAnswered: false,
    selectedOption: null,
    isCorrect: null,
    correctOption: null,
    legalBasis: null,
    explanation: null,
    statusNote: "数据库未连接，当前先展示今日题目，恢复数据库后可登录作答。",
    stats: null,
  } satisfies DailyQuizPanelData;
}

export async function getDailyQuizPanelData(userId: string | null) {
  try {
    const assignment = await ensureDailyQuizAssignment();
    if (!assignment) {
      return await getFallbackDailyQuizPanelData();
    }

    const response = userId
      ? await prisma.dailyQuizResponse.findUnique({
          where: {
            assignmentId_userId: {
              assignmentId: assignment.id,
              userId,
            },
          },
          select: {
            selectedOption: true,
            isCorrect: true,
          },
        })
      : null;

    const stats = response ? await getDailyQuizStats(assignment.id) : null;

    return toPanelData({
      assignment,
      canAnswer: Boolean(userId),
      response,
      stats,
    });
  } catch {
    return getFallbackDailyQuizPanelData();
  }
}

function normalizeSelection(selection: string[]) {
  const unique = Array.from(
    new Set(selection.map((option) => option.trim().toUpperCase()).filter((option) => ["A", "B", "C", "D"].includes(option))),
  ).sort();

  return unique.join("");
}

export async function submitDailyQuizAnswer(userId: string, selection: string[]) {
  const normalizedOption = normalizeSelection(selection);
  if (!normalizedOption) {
    throw new Error("INVALID_OPTION");
  }

  const assignment = await ensureDailyQuizAssignment();
  if (!assignment) {
    throw new Error("NO_QUESTION");
  }

  const existing = await prisma.dailyQuizResponse.findUnique({
    where: {
      assignmentId_userId: {
        assignmentId: assignment.id,
        userId,
      },
    },
    select: {
      selectedOption: true,
      isCorrect: true,
    },
  });

  if (existing) {
    throw new Error("ALREADY_ANSWERED");
  }

  const isCorrect = normalizeSelection(normalizedOption.split("")) === normalizeSelection(assignment.question.correctOption.split(""));

  await prisma.dailyQuizResponse.create({
    data: {
      assignmentId: assignment.id,
      userId,
      selectedOption: normalizedOption,
      isCorrect,
    },
  });

  const stats = await getDailyQuizStats(assignment.id);

  return toPanelData({
    assignment,
    canAnswer: true,
    response: {
      selectedOption: normalizedOption,
      isCorrect,
    },
    stats,
  });
}

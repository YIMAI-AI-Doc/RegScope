import { readFile } from "node:fs/promises";
import { prisma } from "@/lib/db";
import { getDefaultQuizQuestionBankPath, parseQuizQuestionBankMarkdown } from "@/lib/quiz/parser";

async function main() {
  const filePath = getDefaultQuizQuestionBankPath();
  const markdown = await readFile(filePath, "utf8");
  const questions = parseQuizQuestionBankMarkdown(markdown);

  for (const question of questions) {
    await prisma.quizQuestion.upsert({
      where: { sourceNumber: question.sourceNumber },
      update: {
        sequence: question.sequence,
        typeLabel: question.typeLabel,
        difficultyLabel: question.difficultyLabel,
        prompt: question.prompt,
        optionA: question.optionA,
        optionB: question.optionB,
        optionC: question.optionC,
        optionD: question.optionD,
        correctOption: question.correctOption,
        legalBasis: question.legalBasis,
        explanation: question.explanation,
        isActive: true,
      },
      create: {
        sourceNumber: question.sourceNumber,
        sequence: question.sequence,
        typeLabel: question.typeLabel,
        difficultyLabel: question.difficultyLabel,
        prompt: question.prompt,
        optionA: question.optionA,
        optionB: question.optionB,
        optionC: question.optionC,
        optionD: question.optionD,
        correctOption: question.correctOption,
        legalBasis: question.legalBasis,
        explanation: question.explanation,
        isActive: true,
      },
    });
  }

  console.log(`Imported ${questions.length} quiz questions from ${filePath}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

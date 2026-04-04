import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  authOptions: {},
}));

vi.mock("@/lib/quiz/queries", () => ({
  submitDailyQuizAnswer: vi.fn(),
}));

vi.mock("@/lib/pets/grant-points", () => ({
  grantPetPoints: vi.fn(),
}));

import { getServerSession } from "next-auth";
import { grantPetPoints } from "@/lib/pets/grant-points";
import { submitDailyQuizAnswer } from "@/lib/quiz/queries";
import { POST } from "./route";

const mockedGetServerSession = vi.mocked(getServerSession);
const mockedSubmitDailyQuizAnswer = vi.mocked(submitDailyQuizAnswer);
const mockedGrantPetPoints = vi.mocked(grantPetPoints);

afterEach(() => {
  vi.clearAllMocks();
});

describe("daily question answer route", () => {
  it("rejects anonymous answers", async () => {
    mockedGetServerSession.mockResolvedValue(null);

    const response = await POST(
      new NextRequest("http://localhost/api/daily-question/answer", {
        method: "POST",
        body: JSON.stringify({ option: "A" }),
      }),
    );

    expect(response.status).toBe(401);
  });

  it("returns answer result for an authenticated user", async () => {
    mockedGetServerSession.mockResolvedValue({
      user: { id: "user-1" },
    } as never);
    mockedSubmitDailyQuizAnswer.mockResolvedValue({
      dateKey: "2026-04-04",
      dateLabel: "2026 年 4 月 4 日",
      sequence: 1,
      typeLabel: "单选题",
      difficultyLabel: "简单",
      prompt: "测试题干",
      options: [
        { key: "A", text: "选项 A" },
        { key: "B", text: "选项 B" },
        { key: "C", text: "选项 C" },
        { key: "D", text: "选项 D" },
      ],
      canAnswer: true,
      loginRequired: false,
      hasAnswered: true,
      allowsMultiple: false,
      selectedOption: "B",
      isCorrect: true,
      correctOption: "B",
      legalBasis: "测试依据",
      explanation: "测试解析",
      stats: {
        correctCount: 1,
        incorrectCount: 0,
        totalCount: 1,
        correctRatio: 100,
        incorrectRatio: 0,
      },
    });

    const response = await POST(
      new NextRequest("http://localhost/api/daily-question/answer", {
        method: "POST",
        body: JSON.stringify({ selection: ["B"] }),
      }),
    );

    expect(response.status).toBe(200);
    expect(mockedSubmitDailyQuizAnswer).toHaveBeenCalledWith("user-1", ["B"]);
    expect(mockedGrantPetPoints).toHaveBeenCalledWith({
      userId: "user-1",
      eventType: "DAILY_QUESTION",
      sourceId: "2026-04-04",
      sourceType: "DAILY_QUESTION",
    });
  });
});

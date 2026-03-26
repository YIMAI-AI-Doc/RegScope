import { expect, test } from "@playwright/test";

test("discussion browsing flow keeps question, conclusion, evidence, controversy, and answers visible", async ({ page }) => {
  await page.goto("/discussions");

  await expect(page.getByRole("heading", { name: "讨论问答" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "问题列表" })).toBeVisible();
  await expect(page.getByText("AI 指南对现有申报路径的影响是什么？")).toBeVisible();

  await page.goto("/discussions/ai-guidance-impact");

  await expect(page.getByRole("heading", { name: "AI 指南对现有申报路径的影响是什么？" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "阶段性判断会随着新证据更新" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "按来源强度拆开看" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "把分歧和缺口单独挑出来" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "按证据标签优先看回复" })).toBeVisible();
  await expect(page.getByText("FDA demo guidance note")).toBeVisible();
  await expect(page.getByText("如果你们内部已经有模型验证和变更控制框架，可以先按增强版治理要求准备，而不是立刻改流程。")).toBeVisible();
});

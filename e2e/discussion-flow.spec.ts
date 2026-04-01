import { expect, test } from "@playwright/test";

test("discussion browsing flow keeps question, conclusion, evidence, controversy, and answers visible", async ({ page }) => {
  await page.goto("/discussions");

  await expect(page.getByRole("heading", { name: "讨论问答" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "为你推荐" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "问题列表" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /AI 指南对现有申报路径的影响是什么/ }).first(),
  ).toBeVisible();

  await page.goto("/discussions/ai-guidance-impact");

  await expect(page.getByRole("heading", { name: "AI 指南对现有申报路径的影响是什么？" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "阶段性判断会随着新证据更新" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "按来源强度拆开看" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "把分歧和缺口单独挑出来" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "按证据标签优先看回复" })).toBeVisible();
  await expect(page.getByText("FDA AI lifecycle guidance")).toBeVisible();
  await expect(
    page.getByText("如果团队已经有模型验证与变更控制框架，当前更应该补治理证据而不是大改提交路径。"),
  ).toBeVisible();
});

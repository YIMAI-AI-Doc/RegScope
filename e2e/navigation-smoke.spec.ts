import { expect, test } from "@playwright/test";

test("header and footer navigation links remain clickable", async ({ page }) => {
  await page.goto("/");
  const headerNav = page.getByRole("navigation", { name: "主导航" });

  await headerNav.getByRole("link", { name: "情报搜索" }).click();
  await expect(page).toHaveURL(/\/feed/);

  await headerNav.getByRole("link", { name: "领域订阅" }).click();
  await expect(page).toHaveURL(/\/topics/);

  await headerNav.getByRole("link", { name: "讨论问答" }).click();
  await expect(page).toHaveURL(/\/discussions/);

  await page.locator(".brand").click();
  await expect(page).toHaveURL(/\/$/);

  const footer = page.getByRole("contentinfo");

  await footer.getByRole("link", { name: "官方来源" }).click();
  await expect(page).toHaveURL(/\/sources/);

  await footer.getByRole("link", { name: "隐私政策" }).click();
  await expect(page).toHaveURL(/\/legal\/privacy/);
});

import { expect, test } from "@playwright/test";

test("card grids use 24px vertical spacing", async ({ page }) => {
  await page.goto("/feed");

  const fiveGrid = page.locator(".regscope-grid-five").first();
  const threeGrid = page.locator(".regscope-grid-three").first();

  await expect(fiveGrid).toBeVisible();
  await expect(threeGrid).toBeVisible();

  const fiveRowGap = await fiveGrid.evaluate((el) => getComputedStyle(el).rowGap);
  const threeRowGap = await threeGrid.evaluate((el) => getComputedStyle(el).rowGap);

  expect(fiveRowGap).toBe("24px");
  expect(threeRowGap).toBe("24px");
});

test("homepage mixed grid uses 24px spacing", async ({ page }) => {
  await page.goto("/");

  const mixedGrid = page.locator(".homepage-mixed-grid").first();

  await expect(mixedGrid).toBeVisible();

  const rowGap = await mixedGrid.evaluate((el) => getComputedStyle(el).rowGap);

  expect(rowGap).toBe("24px");
});

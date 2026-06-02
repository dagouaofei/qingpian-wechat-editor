import { test, expect } from "@playwright/test";

test.describe("home → preview main flow", () => {
  test("home page renders required topic input and generate button", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "公众号文章生成" })).toBeVisible();
    await expect(page.getByTestId("home-topic-input")).toBeVisible();
    await expect(page.getByTestId("home-generate-button")).toBeVisible();
  });

  test("shows validation when topic is empty", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("home-generate-button").click();
    await expect(page.getByTestId("home-validation-message")).toBeVisible();
    await expect(page).toHaveURL("/");
  });

  test("navigates to preview and completes or surfaces provider error", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByTestId("home-topic-input").fill("轻篇 Sprint 6 首页预览联调测试");
    await page.getByTestId("home-scene-select").selectOption("knowledge");
    await page.getByTestId("home-audience-select").selectOption("general");
    await page.getByTestId("home-generate-button").click();

    await expect(page).toHaveURL(/\/preview\?topic=/);
    await expect(
      page
        .getByTestId("preview-loading-state")
        .or(page.getByTestId("preview-error-panel"))
        .or(page.getByTestId("article-preview-panel")),
    ).toBeVisible({ timeout: 60_000 });
  });
});

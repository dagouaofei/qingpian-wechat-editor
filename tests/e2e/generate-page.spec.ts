import { test, expect } from "@playwright/test";

test.describe("/generate main flow page", () => {
  test("renders generate page with provider badge and inputs", async ({ page }) => {
    await page.goto("/generate");
    await expect(page.getByRole("heading", { name: "轻篇生成" })).toBeVisible();
    await expect(page.getByTestId("provider-mode-badge")).toBeVisible();
    await expect(page.getByTestId("generate-topic-input")).toBeVisible();
    await expect(page.getByTestId("generate-submit-button")).toBeVisible();
  });

  test("can submit topic and receive preview via unified generate flow", async ({ page }) => {
    await page.goto("/generate");
    await page.getByTestId("generate-topic-input").fill("轻篇 Release 1 主流程 UI 测试");
    await page.getByTestId("generate-submit-button").click();
    await expect(page.getByTestId("article-preview-panel")).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByTestId("generate-phase-list")).toContainText("就绪");
  });

  test("copy button exposes clipboard payload without DOM scraping", async ({ page }) => {
    await page.goto("/generate");
    await page.getByTestId("generate-topic-input").fill("Clipboard payload 测试");
    await page.getByTestId("generate-submit-button").click();
    await expect(page.getByTestId("article-preview-panel")).toBeVisible({
      timeout: 30_000,
    });
    await page.getByTestId("generate-copy-button").click();
    await expect(page.getByTestId("clipboard-plain-preview")).not.toBeEmpty();
  });
});

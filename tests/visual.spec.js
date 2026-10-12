import { test, expect } from "@playwright/test";

// Visual tests run only locally — screenshots depend on OS fonts/rendering,
// so they'd fail in CI (Linux) when the reference was captured on Windows.
test.skip(
  ({ browserName }) => process.env.CI === "true",
  "Visual tests run only locally (OS-dependent)",
);

test("example page — visual snapshot", async ({ page }) => {
  await page.goto("https://example.com");
  await expect(page).toHaveScreenshot("example-homepage.png", {
    maxDiffPixels: 100,
  });
});

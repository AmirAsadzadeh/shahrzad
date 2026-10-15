import { expect, test } from "./testFixtures";
import { authenticateUser } from "./helpers/authenticateUser";

test.describe("home page responsive behavior", () => {
  test("supports carousel navigation and mobile header compaction", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await authenticateUser(page);

    const carousel = page.getByRole("region", { name: "بنرهای شهرزاد" });
    await expect(carousel).toBeVisible();

    const secondSlide = carousel.getByRole("button", { name: "نمایش اسلاید 2" });
    await secondSlide.click();
    await expect(secondSlide).toHaveAttribute("aria-current", "true");

    const scrollRegion = page.getByRole("region", { name: "محتوای صفحه اصلی" });
    const mobileLogo = page.locator('header a[aria-label="صفحه اصلی شهرزاد"].shahrzad-header-transition');

    await scrollRegion.evaluate((element) => element.scrollTo({ top: 180, behavior: "instant" }));
    await expect(mobileLogo).toHaveAttribute("aria-hidden", "true");

    await scrollRegion.evaluate((element) => element.scrollTo({ top: 0, behavior: "instant" }));
    await expect(mobileLogo).toHaveAttribute("aria-hidden", "false");
  });

  test("rebinds the mobile scroll listener after returning with browser back", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await authenticateUser(page);

    await page.getByRole("button", { name: "مشاهده همه" }).click();
    await expect(page).toHaveURL(/\/services$/);

    await page.goBack();
    await expect(page).toHaveURL(/\/home$/);

    const scrollRegion = page.getByRole("region", { name: "محتوای صفحه اصلی" });
    const mobileLogo = page.locator('header a[aria-label="صفحه اصلی شهرزاد"].shahrzad-header-transition');

    await expect(scrollRegion).toBeVisible();
    await scrollRegion.evaluate((element) => element.scrollTo({ top: 180, behavior: "instant" }));
    await expect(mobileLogo).toHaveAttribute("aria-hidden", "true");

    await scrollRegion.evaluate((element) => element.scrollTo({ top: 0, behavior: "instant" }));
    await expect(mobileLogo).toHaveAttribute("aria-hidden", "false");
  });

  test("scrolls the mobile content region back to the top", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await authenticateUser(page);

    const scrollRegion = page.getByRole("region", { name: "محتوای صفحه اصلی" });

    await scrollRegion.evaluate((element) =>
      element.scrollTo({ top: element.scrollHeight, behavior: "instant" })
    );
    await expect.poll(() => scrollRegion.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);

    await page.getByRole("button", { name: "بازگشت به بالا" }).click();
    await expect.poll(() => scrollRegion.evaluate((element) => element.scrollTop)).toBeLessThan(2);
  });

  test("keeps desktop footer behavior stable across a desktop-to-mobile resize", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await authenticateUser(page);

    await expect(page.getByRole("heading", { name: "خدمات شهرزاد" })).toBeVisible();
    const desktopNavigation = page.getByRole("navigation").first();
    const footer = page.locator("footer");
    await expect(desktopNavigation).toBeVisible();

    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
    await expect(footer).toHaveAttribute("aria-hidden", "false");

    await page.setViewportSize({ width: 390, height: 844 });
    const scrollRegion = page.getByRole("region", { name: "محتوای صفحه اصلی" });
    const mobileLogo = page.locator('header a[aria-label="صفحه اصلی شهرزاد"].shahrzad-header-transition');
    await expect(scrollRegion).toBeVisible();

    await scrollRegion.evaluate((element) => element.scrollTo({ top: 180, behavior: "instant" }));
    await expect(mobileLogo).toHaveAttribute("aria-hidden", "true");

    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(desktopNavigation).toBeVisible();
    await expect(footer).toHaveAttribute("aria-hidden", "true");
  });

  test("scrolls the desktop document back to the top", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await authenticateUser(page);
    await expect(page.getByRole("heading", { name: "خدمات شهرزاد" })).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollHeight > window.innerHeight
        )
      )
      .toBe(true);

    await page.evaluate(() =>
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" })
    );
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

    await page.getByRole("button", { name: "بازگشت به بالا" }).click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(2);
  });

  test("logs out through the shared account menu", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await authenticateUser(page);

    await page.getByRole("button", { name: "حساب کاربری" }).click();
    await page.getByRole("menuitem", { name: "خروج" }).click();

    await expect(page).toHaveURL(/\/login-register\?redirectTo=(?:%2F|\/)home/);
  });
});

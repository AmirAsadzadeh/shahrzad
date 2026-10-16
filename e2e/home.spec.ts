import { expect, test } from "./testFixtures";
import { authenticateUser } from "./helpers/authenticateUser";
import { APP_ROUTES } from "@/shared/constants/routes";

test.describe("home page responsive behavior", () => {
  test("fits narrow screens and switches navigation at the desktop breakpoint", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await authenticateUser(page);

    await expect(page.getByRole("heading", { name: "خدمات شهرزاد" })).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBe(320);

    const desktopNavigation = page.locator("header nav");
    const mobileLogo = page.locator('header a[aria-label="صفحه اصلی شهرزاد"].shahrzad-header-transition');

    await page.setViewportSize({ width: 767, height: 800 });
    await expect(desktopNavigation).toBeHidden();
    await expect(mobileLogo).toBeVisible();

    await page.setViewportSize({ width: 768, height: 800 });
    await expect(desktopNavigation).toBeVisible();
    await expect(mobileLogo).toBeHidden();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
      .toBe(768);
  });

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

  test("keeps fixed floating-bar actions in their intended positions", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await authenticateUser(page);

    const floatingBar = page.getByRole("navigation", { name: "دسترسی سریع" });
    const walletAction = floatingBar.getByRole("link", { name: "کیف پول" });
    const servicesAction = floatingBar.getByRole("link", { name: "خدمات" });

    await expect(walletAction).toHaveAttribute("href", APP_ROUTES.wallet);
    await expect(servicesAction).toHaveAttribute("href", APP_ROUTES.services);

    const walletBox = await walletAction.boundingBox();
    const servicesBox = await servicesAction.boundingBox();

    expect(walletBox).not.toBeNull();
    expect(servicesBox).not.toBeNull();
    expect(walletBox?.x).toBeGreaterThan(servicesBox?.x ?? Number.POSITIVE_INFINITY);
  });

  test("rebinds the mobile scroll listener after returning with browser back", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await authenticateUser(page);

    await page.getByRole("button", { name: "مشاهده همه" }).click();
    await expect(page).toHaveURL((url) => url.pathname === APP_ROUTES.services);

    await page.goBack();
    await expect(page).toHaveURL((url) => url.pathname === APP_ROUTES.home);

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

    const desktopScrollRegion = page.getByRole("region", { name: "محتوای صفحه اصلی" });
    await desktopScrollRegion.evaluate((element) =>
      element.scrollTo({ top: element.scrollHeight, behavior: "instant" })
    );
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

  test("scrolls the desktop content region back to the top", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await authenticateUser(page);
    await expect(page.getByRole("heading", { name: "خدمات شهرزاد" })).toBeVisible();
    const scrollRegion = page.getByRole("region", { name: "محتوای صفحه اصلی" });
    await expect.poll(() => scrollRegion.evaluate(
      (element) => element.scrollHeight > element.clientHeight
    )).toBe(true);

    await scrollRegion.evaluate((element) =>
      element.scrollTo({ top: element.scrollHeight, behavior: "instant" })
    );
    await expect.poll(() => scrollRegion.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

    await page.getByRole("button", { name: "بازگشت به بالا" }).click();
    await expect.poll(() => scrollRegion.evaluate((element) => element.scrollTop)).toBeLessThan(2);
  });

  test("logs out through the shared account menu", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await authenticateUser(page);

    await page.getByRole("button", { name: "حساب کاربری" }).click();
    await page.getByRole("menuitem", { name: "خروج" }).click();

    await expect(page).toHaveURL((url) =>
      url.pathname === APP_ROUTES.loginRegister &&
      url.searchParams.get("redirectTo") === APP_ROUTES.home
    );
  });
});

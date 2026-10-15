import { expect, test } from "./testFixtures";
import { authenticateUser } from "./helpers/authenticateUser";

test("services page uses the mobile nested-page header", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await authenticateUser(page);

  const homeHeader = page.locator("header");
  await expect
    .poll(() => homeHeader.evaluate((element) => element.getBoundingClientRect().height))
    .toBeGreaterThan(150);
  const expandedHeaderHeight = await homeHeader.evaluate(
    (element) => element.getBoundingClientRect().height
  );

  await page.getByRole("button", { name: "مشاهده همه" }).click();
  await expect(page).toHaveURL(/\/services$/);

  const scrollRegion = page.getByRole("region", { name: "محتوای خدمات شهرزاد" });

  await expect(scrollRegion).toBeVisible();
  await expect(page.getByText("میوه و تره‌بار")).toBeVisible();
  await expect(page.getByRole("heading", { name: "خدمات شهرزاد" })).toBeVisible();
  await expect(page.getByRole("link", { name: "صفحه اصلی", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "بازگشت" })).toBeVisible();
  await expect(page.locator('header a[href="/wallet"]')).toBeHidden();
  await expect(page.locator("footer")).toHaveCount(0);
  await expect
    .poll(() => page.locator("header").evaluate((element) => element.getBoundingClientRect().height))
    .toBeLessThan(expandedHeaderHeight);

  await expect.poll(() => scrollRegion.evaluate((element) => getComputedStyle(element).overflowY)).toBe("auto");

  await page.getByRole("textbox", { name: "جستجو در خدمات" }).fill("خدمت ناموجود");
  await expect(page.getByText("خدمتی برای نمایش وجود ندارد")).toBeVisible();
});

test("services page keeps the full desktop header and container back action", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await authenticateUser(page);

  await page.getByRole("button", { name: "مشاهده همه" }).click();
  await expect(page).toHaveURL(/\/services$/);

  await expect(page.getByRole("link", { name: "صفحه اصلی شهرزاد" })).toBeVisible();
  await expect(page.getByRole("link", { name: "خدمات شهرزاد" })).toBeVisible();
  await expect(page.getByRole("link", { name: "کیف پول" })).toBeVisible();
  await expect(page.getByRole("button", { name: "باز کردن منوی حساب کاربری" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "خدمات شهرزاد" })).toBeVisible();

  await page.getByRole("button", { name: "بازگشت" }).click();
  await expect(page).toHaveURL(/\/home$/);
});

test("announces the services loading state", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await authenticateUser(page);

  await page.goto("/services", { waitUntil: "commit" });

  const servicesGrid = page.locator('[aria-busy="true"]').filter({
    hasText: "در حال بارگذاری خدمات"
  });
  await expect(servicesGrid).toBeVisible();
  await expect(page.getByText("میوه و تره‌بار")).toBeVisible();
});

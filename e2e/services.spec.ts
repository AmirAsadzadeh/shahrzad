import { expect, test } from "./testFixtures";
import { authenticateUser } from "./helpers/authenticateUser";

test("services page uses the shared shell without wallet or footer", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await authenticateUser(page);

  const expandedHeaderHeight = await page.locator("header").evaluate((element) =>
    element.getBoundingClientRect().height
  );

  await page.getByRole("button", { name: "مشاهده همه" }).click();
  await expect(page).toHaveURL(/\/services$/);

  const scrollRegion = page.getByRole("region", { name: "محتوای خدمات شهرزاد" });

  await expect(scrollRegion).toBeVisible();
  await expect(page.getByText("میوه و تره‌بار")).toBeVisible();
  await expect(page.locator('header a.shahrzad-header-transition[aria-label="صفحه اصلی شهرزاد"]')).toHaveAttribute(
    "aria-hidden",
    "true"
  );
  await expect(page.locator('header a[href="/wallet"]')).toHaveCount(0);
  await expect(page.locator("footer")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "حساب کاربری" })).toBeVisible();
  await expect
    .poll(() => page.locator("header").evaluate((element) => element.getBoundingClientRect().height))
    .toBeLessThan(expandedHeaderHeight);

  await expect.poll(() => scrollRegion.evaluate((element) => getComputedStyle(element).overflowY)).toBe("auto");

  await page.getByRole("textbox", { name: "جستجو در خدمات" }).fill("خدمت ناموجود");
  await expect(page.getByText("خدمتی برای نمایش وجود ندارد")).toBeVisible();
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

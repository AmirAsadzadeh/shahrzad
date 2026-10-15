import { expect, type Page } from "@playwright/test";
import { APP_ROUTES } from "@/shared/constants/routes";

const TEST_PHONE_NUMBER = "09129998877";
const TEST_OTP = "123456";

export async function authenticateUser(page: Page): Promise<void> {
  await page.goto(APP_ROUTES.home);
  await expect(page).toHaveURL((url) =>
    url.pathname === APP_ROUTES.loginRegister &&
    url.searchParams.get("redirectTo") === APP_ROUTES.home
  );

  await page.getByLabel("شماره موبایل").fill(TEST_PHONE_NUMBER);
  await page.getByRole("button", { name: "مرحله بعد" }).click();
  await expect(page.getByText(/یک پیامک حاوی کد اعتبارسنجی/)).toBeVisible();

  await page.getByLabel("کد اعتبارسنجی").locator("input").first().pressSequentially(TEST_OTP);
  await page.getByRole("button", { name: "تایید" }).click();
  await expect(page).toHaveURL((url) => url.pathname === APP_ROUTES.home);
}

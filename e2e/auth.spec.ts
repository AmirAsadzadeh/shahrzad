import { expect, test } from "./testFixtures";
import { authenticateUser } from "./helpers/authenticateUser";

test("redirects unauthenticated visitors and completes mock OTP sign-in", async ({ page }) => {
  await authenticateUser(page);

  await expect(page.getByRole("heading", { name: "خدمات شهرزاد" })).toBeVisible();
  await expect(page.getByText("میوه و تره‌بار")).toBeVisible();
});

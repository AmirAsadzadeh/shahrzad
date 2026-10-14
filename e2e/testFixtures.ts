import { test as base, expect } from "@playwright/test";

export const test = base.extend({
  page: async ({ page }, continueWithPage) => {
    await page.route("**/_next/image**", (route) => route.abort());
    await continueWithPage(page);
  }
});

export { expect };

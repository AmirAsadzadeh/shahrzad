import { defineConfig, devices } from "@playwright/test";

const useExistingServer = Boolean(process.env.PW_TEST_USE_EXISTING_SERVER);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.PW_TEST_BASE_URL ?? "http://127.0.0.1:4173",
    locale: "fa-IR",
    colorScheme: "light",
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        channel: process.env.PW_TEST_USE_SYSTEM_CHROME ? "chrome" : undefined
      }
    }
  ],
  ...(useExistingServer
    ? {}
    : {
        webServer: {
          command: "npm run dev -- --hostname 127.0.0.1 --port 4173",
          url: "http://127.0.0.1:4173/login-register?redirectTo=%2Fhome",
          reuseExistingServer: !process.env.CI,
          timeout: 120_000
        }
      })
});

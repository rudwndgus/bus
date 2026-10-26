import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  workers: 2,
  use: {
    reducedMotion: "reduce",
    baseURL: "http://127.0.0.1:5173",
    viewport: { width: 592, height: 1280 },
    screenshot: "only-on-failure",
  },
  webServer: [
    {
      command: "npm run dev -- --port 5173",
      url: "http://127.0.0.1:5173",
      reuseExistingServer: true,
    },
    {
      command: "npm run preview -- --port 5174",
      url: "http://127.0.0.1:5174",
      reuseExistingServer: true,
    },
  ],
  reporter: [["list"], ["html", { open: "never" }]],
});

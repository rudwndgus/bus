import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/pages",
  workers: 1,
  use: {
    baseURL: process.env.PAGES_URL ?? "http://127.0.0.1:5175/bus/",
    viewport: { width: 393, height: 852 },
    reducedMotion: "reduce",
  },
  webServer: process.env.PAGES_URL
    ? undefined
    : {
        command: "npm run preview -- --port 5175 --base=/bus/",
        url: "http://127.0.0.1:5175/bus/",
        reuseExistingServer: true,
      },
  reporter: "list",
});

import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.setItem("nj-opened", "1");
  });
});
async function home(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "OK", exact: true }).click();
}
test("initial notice and all three tabs", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("dialog")).toContainText(
    "IMPORTANT RAIL SERVICE NOTICE",
  );
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Good Morning!" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Rider Tools" }).click();
  await expect(
    page.getByRole("heading", { name: "System Status" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "My Tickets" }).click();
  await expect(
    page.getByRole("heading", { name: "Non-Active Tickets" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Home", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Good Morning!" }),
  ).toBeVisible();
});
test("verified quick buy quantity and back navigation", async ({ page }) => {
  await home(page);
  await page.getByRole("button", { name: "Buy a Ticket Buy" }).click();
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await page
    .getByRole("button", {
      name: "3 Zones (INTRASTATE) One Way Adult; Route Number: 1",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("button", { name: "Proceed to Checkout" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Add One Way Adult" }).click();
  await expect(page.getByText("TOTAL $3.80")).toBeVisible();
  await page.getByRole("button", { name: "Proceed to Checkout" }).click();
  await expect(page.getByRole("dialog")).toContainText("could not be verified");
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Buy Tickets" }),
  ).toBeVisible();
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "Select Tickets" }),
  ).toBeVisible();
});
test("preview confirmation, cancellation, persistence, enlargement, instructions and history", async ({
  page,
}) => {
  await page.goto("/tickets");
  await page
    .getByRole("button", { name: "2 INTRASTATE ticket", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Activate Ticket(s)", exact: true })
    .click();
  await page.getByRole("button", { name: "No, Cancel" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page
    .getByRole("button", { name: "Activate Ticket(s)", exact: true })
    .click();
  await page.getByRole("button", { name: "Open Ticket Preview" }).click();
  await page.reload();
  await page
    .getByRole("button", { name: "2 INTRASTATE preview ticket" })
    .click();
  await expect(page.getByText("NOT VALID")).toBeVisible();
  await page.getByRole("button", { name: "Enlarge ticket preview" }).click();
  await page.getByRole("button", { name: "Back to ticket" }).click();
  await page
    .getByRole("button", { name: "View Onboard Validator Instructions" })
    .click();
  await expect(page.getByRole("dialog")).toContainText("contains no barcode");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await page.getByRole("tab", { name: "All Tickets", exact: true }).click();
  await expect(page.getByText("Used Ticket")).toHaveCount(3);
  await page
    .getByRole("button", { name: "Dismiss ticket information" })
    .click();
  await page
    .getByRole("tab", { name: "Active/Non-Active", exact: true })
    .click();
  await page.getByRole("button", { name: "Refresh tickets" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Local ticket list refreshed" }),
  ).toBeVisible();
});
test("unknown routes and unavailable controls are explicit", async ({
  page,
}) => {
  await page.goto("/missing");
  await expect(
    page.getByRole("heading", { name: "Page not found" }),
  ).toBeVisible();
  await page.goto("/tickets/no-ticket");
  await expect(
    page.getByRole("heading", { name: "Ticket not found" }),
  ).toBeVisible();
  await home(page);
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "not shown in the recording",
  );
  await page.getByRole("button", { name: "About this project" }).click();
  await expect(page.getByText(/not affiliated with/)).toBeVisible();
});
for (const size of [
  { width: 393, height: 852 },
  { width: 320, height: 568 },
  { width: 1440, height: 1000 },
])
  test(`responsive layout ${size.width}`, async ({ page }) => {
    await page.setViewportSize(size);
    await home(page);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(
      page.getByRole("link", { name: "My Tickets" }),
    ).toBeInViewport();
    await page.goto("/buy");
    await page.getByRole("button", { name: "OK", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Train", exact: true }),
    ).toBeInViewport();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
test("capture verified screens", async ({ page }) => {
  await home(page);
  await page.screenshot({ path: "analysis/implementation/home.png" });
  await page.getByRole("link", { name: "Rider Tools" }).click();
  await expect(
    page.getByRole("heading", { name: "Rider Tools", exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: "analysis/implementation/rider.png" });
  await page.goto("/buy");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.screenshot({ path: "analysis/implementation/portal.png" });
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Buy Tickets", exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: "analysis/implementation/buy.png" });
  await page
    .getByRole("button", {
      name: "3 Zones (INTRASTATE) One Way Adult; Route Number: 1",
      exact: true,
    })
    .click();
  await expect(
    page.getByRole("heading", { name: "Select Tickets" }),
  ).toBeVisible();
  await page.screenshot({ path: "analysis/implementation/fares.png" });
  await page.getByRole("button", { name: "Add One Way Adult" }).click();
  await page.screenshot({ path: "analysis/implementation/fares-selected.png" });
  await page.goto("/tickets");
  await expect(
    page.getByRole("heading", { name: "My Tickets", exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: "analysis/implementation/tickets.png" });
  await page
    .getByRole("button", { name: "2 INTRASTATE ticket", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Activate Ticket(s)", exact: true })
    .click();
  await page.screenshot({ path: "analysis/implementation/activate.png" });
  await page.getByRole("button", { name: "Open Ticket Preview" }).click();
  await page
    .getByRole("button", { name: "2 INTRASTATE preview ticket" })
    .click();
  await expect(
    page.getByRole("heading", { name: "One Way Ticket", exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: "analysis/implementation/detail.png" });
  await page.getByRole("button", { name: "Enlarge ticket preview" }).click();
  await page.screenshot({ path: "analysis/implementation/enlarged.png" });
});
test("ticket theme survives reload and drives CSS variables", async ({
  page,
}) => {
  await page.goto("/tickets/two");
  await page.evaluate(() => {
    const saved = JSON.parse(
      localStorage.getItem("nj-ui-study-v1") ??
        JSON.stringify({
          state: {
            appearance: {
              borderColor: "#2563eb",
              accentColor: "#2563eb",
              backgroundColor: "#ffffff",
              textColor: "#111827",
            },
          },
          version: 0,
        }),
    );
    saved.state.appearance.borderColor = "#a855f7";
    localStorage.setItem("nj-ui-study-v1", JSON.stringify(saved));
  });
  await page.reload();
  await expect(page.locator(".preview-panel")).toHaveCSS(
    "border-top-color",
    "rgb(168, 85, 247)",
  );
  await expect(page.locator(".preview-panel")).toContainText("NOT VALID");
});
test("production PWA caches the shell for an offline revisit", async ({
  page,
  context,
}) => {
  await page.goto("http://127.0.0.1:5174/about");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await expect
    .poll(() => page.evaluate(() => !!navigator.serviceWorker.controller))
    .toBe(true);
  const manifest = await page.request.get(
    "http://127.0.0.1:5174/manifest.webmanifest",
  );
  expect(manifest.ok()).toBe(true);
  expect((await manifest.json()).display).toBe("standalone");
  await page.reload();
  await expect(page.getByText("About this project")).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText("About this project")).toBeVisible();
  await context.setOffline(false);
});

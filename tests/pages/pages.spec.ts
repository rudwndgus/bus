import { test, expect } from "@playwright/test";
test("Pages base, hash navigation, assets and reload", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => sessionStorage.setItem("nj-opened", "1"));
  await page.goto("./");
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Good Morning!" }),
  ).toBeVisible();
  expect(
    await page
      .locator(".news-banner")
      .evaluate((im: HTMLImageElement) => im.complete && im.naturalWidth > 0),
  ).toBe(true);
  await page.getByRole("link", { name: "My Tickets" }).click();
  await expect(page).toHaveURL(/\/bus\/#\/tickets$/);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "My Tickets", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Home", exact: true }).click();
  await page.getByRole("button", { name: "Buy a Ticket Buy" }).click();
  await page.getByRole("button", { name: "OK", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Buy Tickets" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("Pages service worker remains scoped to bus and supports offline revisit", async ({
  page,
  context,
}) => {
  await page.goto("./#/about");
  const scope = await page.evaluate(
    async () => (await navigator.serviceWorker.ready).scope,
  );
  expect(scope).toMatch(/\/bus\/$/);
  await expect
    .poll(() => page.evaluate(() => !!navigator.serviceWorker.controller))
    .toBe(true);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "About this project" }),
  ).toBeVisible();
  await context.setOffline(true);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "About this project" }),
  ).toBeVisible();
  await context.setOffline(false);
});

import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should display the homepage with title", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("h1")).toContainText("Weesha");
    await expect(page.getByText("Create time-bound celebration pages")).toBeVisible();
  });

  test("should show login and get started buttons when not authenticated", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Get Started" })).toBeVisible();
  });

  test("should navigate to login page", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Login" }).click();

    await expect(page).toHaveURL("/auth?mode=login");
    await expect(page.getByRole("heading", { name: "Welcome Back!" })).toBeVisible();
  });

  test("should navigate to register page", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Get Started" }).click();

    await expect(page).toHaveURL("/auth?mode=register");
    await expect(page.getByRole("heading", { name: "Create Account" })).toBeVisible();
  });
});

test.describe("Authentication", () => {
  test("should register a new user", async ({ page }) => {
    await page.goto("/auth?mode=register");

    const testEmail = `test${Date.now()}@example.com`;

    await page.getByLabel("Email").fill(testEmail);
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Create Account" }).click();

    await expect(page).toHaveURL("/dashboard");
    await expect(page.getByText("My Celebrations")).toBeVisible();
  });

  test("should login with existing user", async ({ page }) => {
    await page.goto("/auth?mode=register");

    const testEmail = `logintest${Date.now()}@example.com`;

    await page.getByLabel("Email").fill(testEmail);
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Create Account" }).click();

    await page.getByRole("button", { name: "Logout" }).click();

    await page.goto("/auth?mode=login");
    await page.getByLabel("Email").fill(testEmail);
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL("/dashboard");
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.goto("/auth?mode=login");

    await page.getByLabel("Email").fill("nonexistent@example.com");
    await page.getByLabel("Password").fill("wrongpassword");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Invalid credentials")).toBeVisible();
  });

  test("should toggle between login and register", async ({ page }) => {
    await page.goto("/auth?mode=login");

    await expect(page.getByRole("heading", { name: "Welcome Back!" })).toBeVisible();

    await page.getByText("Sign up").click();

    await expect(page).toHaveURL("/auth?mode=register");
    await expect(page.getByRole("heading", { name: "Create Account" })).toBeVisible();
  });
});

test.describe("Dashboard", () => {
  let testEmail: string;

  test.beforeEach(async ({ page }) => {
    testEmail = `dashboardtest${Date.now()}@example.com`;

    await page.goto("/auth?mode=register");
    await page.getByLabel("Email").fill(testEmail);
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Create Account" }).click();

    await expect(page).toHaveURL("/dashboard");
  });

  test("should display empty state when no celebrations", async ({ page }) => {
    await expect(page.getByText("No celebrations yet")).toBeVisible();
    await expect(page.getByText("Create Celebration")).toBeVisible();
  });

  test("should navigate to create celebration page", async ({ page }) => {
    await page.getByRole("button", { name: "Create New" }).click();

    await expect(page).toHaveURL("/create");
    await expect(page.getByRole("heading", { name: "Create Celebration" })).toBeVisible();
  });

  test("should logout and redirect to login", async ({ page }) => {
    await page.getByRole("button", { name: "Logout" }).click();

    await expect(page).toHaveURL("/auth?mode=login");
  });
});

test.describe("Create Celebration", () => {
  let testEmail: string;

  test.beforeEach(async ({ page }) => {
    testEmail = `createtest${Date.now()}@example.com`;

    await page.goto("/auth?mode=register");
    await page.getByLabel("Email").fill(testEmail);
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Create Account" }).click();

    await page.goto("/create");
  });

  test("should display event type options", async ({ page }) => {
    await expect(page.getByText("Birthday")).toBeVisible();
    await expect(page.getByText("Wedding")).toBeVisible();
    await expect(page.getByText("Baby Shower")).toBeVisible();
  });

  test("should create a celebration", async ({ page }) => {
    await page.getByPlaceholder("e.g., John's 30th Birthday").fill("Test Birthday Party");

    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + 7);
    const formattedDate = eventDate.toISOString().slice(0, 16);

    await page.locator('input[type="datetime-local"]').first().fill(formattedDate);
    await page.locator('input[type="datetime-local"]').last().fill(formattedDate);

    await page.getByRole("button", { name: "Create Celebration" }).click();

    await expect(page.getByText("Celebration Created!")).toBeVisible();
    await expect(page.getByText("Share this link")).toBeVisible();
  });

  test("should validate required fields", async ({ page }) => {
    await page.getByRole("button", { name: "Create Celebration" }).click();

    await expect(page.getByPlaceholder("e.g., John's 30th Birthday")).toBeRequired();
  });
});

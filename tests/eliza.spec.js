import { test, expect } from "@playwright/test";

/**
 * Test Suite: Eliza Chatbot (Local AI)
 * tests the basic chat functionality with Eliza
 */
test.describe("Eliza Chatbot", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");
    });

    test("should load the chat interface", async ({ page }) => {
        await expect(page.locator("h1")).toContainText("Eliza");
        await expect(page.locator("#message-input")).toBeVisible();
        await expect(page.locator("#ai-provider")).toBeVisible();
    });

    test("should have Eliza selected by default", async ({ page }) => {
        const providerSelect = page.locator("#ai-provider");
        await expect(providerSelect).toHaveValue("eliza");
    });

    test("should send a message and receive Eliza response", async ({ page }) => {
        const input = page.locator("#message-input");
        await input.fill("Hello there!");

        await page.locator('button[type="submit"]').click();

        await expect(page.locator(".message-user")).toBeVisible();
        await expect(page.locator(".message-user .message-text")).toContainText("Hello there!");

        await expect(page.locator(".message-bot")).toBeVisible({ timeout: 2000 });

        const botMessage = page.locator(".message-bot .message-text").first();
        await expect(botMessage).not.toBeEmpty();

        await expect(page.locator("#message-count")).toContainText("2"); // 1 user + 1 bot
    });

    test("should handle multiple messages", async ({ page }) => {
        const input = page.locator("#message-input");

        await input.fill("How are you?");
        await page.locator('button[type="submit"]').click();

        await page.waitForTimeout(1000);

        await input.fill("Tell me about yourself");
        await page.locator('button[type="submit"]').click();

        await page.waitForTimeout(1000);

        await expect(page.locator("#message-count")).toContainText("4");
    });

    test("should match Eliza patterns correctly", async ({ page }) => {
        const input = page.locator("#message-input");

        await input.fill("hello");
        await page.locator('button[type="submit"]').click();
        await page.waitForTimeout(1000);

        const botMessage = page.locator(".message-bot .message-text").first();
        const text = await botMessage.textContent();

        const hasGreeting = /hello|hi|hey|howdy/i.test(text);
        expect(hasGreeting).toBeTruthy();
    });

    test("should clear all messages", async ({ page }) => {
        await page.locator("#message-input").fill("Test message");
        await page.locator('button[type="submit"]').click();
        await page.waitForTimeout(1000);

        page.on("dialog", dialog => dialog.accept());
        await page.locator("#clear-button").click();

        await expect(page.locator("#message-count")).toContainText("0");
        await expect(page.locator(".empty-state")).toBeVisible();
    });

    test("should preserve messages after page reload", async ({ page }) => {
        await page.locator("#message-input").fill("Persistent message");
        await page.locator('button[type="submit"]').click();
        await page.waitForTimeout(1000);

        await page.reload();
        await page.waitForLoadState("networkidle");

        await expect(page.locator(".message-user")).toBeVisible();
        await expect(page.locator(".message-user .message-text")).toContainText("Persistent message");
    });
});



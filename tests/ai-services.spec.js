import { test, expect } from "@playwright/test";

/**
 * Test Suite: AI Service Switching and Cloud AI (with mocks)
 * tests provider switching and mocked API responses
 */
test.describe("AI Service Switching", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle");
    });

    test("should be able to switch between providers", async ({ page }) => {
        const providerSelect = page.locator("#ai-provider");

        await expect(providerSelect).toHaveValue("eliza");

        page.on("dialog", dialog => dialog.dismiss()); // Auto-dismiss the API key prompt
        await providerSelect.selectOption("gemini");

        await page.waitForTimeout(500);
        await expect(providerSelect).toHaveValue("eliza");

        await expect(page.locator(".message-bot").last()).toContainText("Eliza");
    });

    test("should show error message when cloud service is selected without key", async ({ page }) => {
        page.on("dialog", dialog => {
            expect(dialog.message()).toContain("API key");
            dialog.dismiss();
        });

        await page.locator("#ai-provider").selectOption("groq");
        await page.waitForTimeout(500);

        await expect(page.locator("#ai-provider")).toHaveValue("eliza");
    });
});

/**
 * Test Suite: Mocked Cloud AI Responses
 * tests cloud AI services by intercepting and mocking network requests
 */
test.describe("Cloud AI Services (Mocked)", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test("should handle Gemini API with mocked response", async ({ page }) => {
        await page.route("**/generativelanguage.googleapis.com/**", async route => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    candidates: [{
                        content: {
                            parts: [{
                                text: "This is a mocked Gemini response for testing purposes."
                            }]
                        }
                    }]
                })
            });
        });

        page.on("dialog", async dialog => {
            if (dialog.type() === "prompt") {
                await dialog.accept("fake-gemini-api-key-for-testing");
            }
        });

        //switch to gemini
        await page.locator("#ai-provider").selectOption("gemini");
        await page.waitForTimeout(500);

        await page.locator("#message-input").fill("Test message to Gemini");
        await page.locator('button[type="submit"]').click();

        await page.waitForTimeout(1500);

        //verify mocked response appears
        const botMessage = page.locator(".message-bot").last();
        await expect(botMessage).toContainText("mocked Gemini response");
    });

    test("should handle Groq API with mocked response", async ({ page }) => {
        //mock the Groq API endpoint
        await page.route("**/api.groq.com/**", async route => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    choices: [{
                        message: {
                            content: "This is a mocked Groq response for testing purposes."
                        }
                    }]
                })
            });
        });

        //auto-provide API key when prompted
        page.on("dialog", async dialog => {
            if (dialog.type() === "prompt") {
                await dialog.accept("fake-groq-api-key-for-testing");
            }
        });

        //switch to groq
        await page.locator("#ai-provider").selectOption("groq");
        await page.waitForTimeout(500);

        await page.locator("#message-input").fill("Test message to Groq");
        await page.locator('button[type="submit"]').click();

        await page.waitForTimeout(1500);

        //verify mocked response appears
        const botMessage = page.locator(".message-bot").last();
        await expect(botMessage).toContainText("mocked Groq response");
    });

    test("should handle API errors gracefully", async ({ page }) => {
        //mock an API error response
        await page.route("**/api.groq.com/**", async route => {
            await route.fulfill({
                status: 401,
                contentType: "application/json",
                body: JSON.stringify({
                    error: {
                        message: "Invalid API key"
                    }
                })
            });
        });

        //auto-provide fake API key
        page.on("dialog", async dialog => {
            if (dialog.type() === "prompt") {
                await dialog.accept("invalid-api-key");
            } else if (dialog.type() === "alert") {
                await dialog.accept();
            }
        });

        await page.locator("#ai-provider").selectOption("groq");
        await page.waitForTimeout(500);

        await page.locator("#message-input").fill("This should fail");
        await page.locator('button[type="submit"]').click();

        await page.waitForTimeout(1500);

        const botMessage = page.locator(".message-bot").last();
        await expect(botMessage).toContainText("Error");
    });
});



import { test as base, expect } from '@playwright/test'
import { setupChat } from "../helpers/setupChat.js";

export const test = base.extend({
    chatSetup: async ({browser, request}, use) => {
        const user1Context = await browser.newContext();
        const user2Context = await browser.newContext();

        const page1 = await user1Context.newPage();
        const page2 = await user2Context.newPage();
        const requestContext = await request;

        const {user1,user2,conversationId} = await setupChat(requestContext)
        const email1 = user1.user.email
        const email2 = user2.user.email
        const password = "test123"

        await page1.goto('http://localhost:5173/login');
        await page1.fill('input[data-testid="email-input"]',email1);
        await page1.fill('input[data-testid="password"]',password);
        await page1.click('button[data-testid="login-btn"]');

        await page2.goto('http://localhost:5173/login');
        await page2.fill('input[data-testid="email-input"]',email2);
        await page2.fill('input[data-testid="password"]',password);
        await page2.click('button[data-testid="login-btn"]');

        await page1.waitForSelector('[data-testid="chat"]');
        await page2.waitForSelector('[data-testid="chat"]');

        // eslint-disable-next-line react-hooks/rules-of-hooks
        await use({
            page1,
            page2,
            user1,
            user2,
            conversationId,
        });

        await user1Context.close();
        await user2Context.close();
    },
});

export {expect};
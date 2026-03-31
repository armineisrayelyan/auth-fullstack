import {test,expect} from '../fixtures/chat.fixture.js'
import {loginTwoUsers} from "../helpers/loginTwoUsers.js";
test("chat between two users", async ({chatSetup}) => {
    const { page1,page2,conversationId } = chatSetup;

    await page1.click('[data-testid="chat"]');
    await page2.click('[data-testid="chat"]');
    await page1.click(`[data-testid="conversation-${conversationId}"]`)
    await page2.click(`[data-testid="conversation-${conversationId}"]`)
    await page1.fill('[data-testid="message-input"]','Hello from User1');
    await page1.click('[data-testid="send-btn"]');
    await expect(page1.locator('[data-testid="chat-layout"]'))
        .toContainText('Hello from User1');
    await expect(page2.locator('[data-testid="chat-layout"]'))
        .toContainText('Hello from User1');
    await expect(page2.locator('[data-testid="messages"]').last())
        .toContainText('Hello from User1');
})
test("message not received if user did not join conversation", async ({chatSetup}) => {
    const { page1,page2,conversationId } = chatSetup;

    await page1.click('[data-testid="chat"]');
    await page2.click('[data-testid="chat"]');
    await page1.click(`[data-testid="conversation-${conversationId}"]`)
    await page1.fill('[data-testid="message-input"]','Hello from User1');
    await page1.click('[data-testid="send-btn"]');
    await expect(page2.locator('[data-testid="chat-layout"]'))
        .not.toContainText('Hello from User1');
})
test("last message shows,if unread count is 1", async ({chatSetup}) => {
    const { page1,page2,conversationId } = chatSetup;

    await page1.click('[data-testid="chat"]');
    await page1.click(`[data-testid="conversation-${conversationId}"]`)
    await page2.click('[data-testid="chat"]');
    await page1.fill('[data-testid="message-input"]','Hello from User1');
    await page1.click('[data-testid="send-btn"]');
    await expect(page2.locator(`[data-testid="${conversationId}-unread-count"]`))
        .toHaveText('Hello from User1');
})
test("unread count increases when user not in chat", async ({chatSetup}) => {
    const { page1,page2,conversationId } = chatSetup;

    await page1.click('[data-testid="chat"]');
    await page2.click('[data-testid="chat"]');
    await page1.click(`[data-testid="conversation-${conversationId}"]`);
    await page1.fill('[data-testid="message-input"]','Hello from User1');
    await page1.click('[data-testid="send-btn"]');
    await page1.fill('[data-testid="message-input"]','Second message from User1');
    await page1.click('[data-testid="send-btn"]');
    await expect(page2.locator(`[data-testid="${conversationId}-unread-count"]`))
        .toHaveText('2 unread messages');
})
test("unread count resets, and last message shows after opening chat", async ({chatSetup}) => {
    const { page1,page2,conversationId } = chatSetup;

    await page1.click('[data-testid="chat"]');
    await page2.click('[data-testid="chat"]');
    await page1.click(`[data-testid="conversation-${conversationId}"]`);
    await page1.fill('[data-testid="message-input"]','Hello from User1');
    await page1.click('[data-testid="send-btn"]');
    await page1.fill('[data-testid="message-input"]','Second message from User1');
    await page1.click('[data-testid="send-btn"]');
    await page1.fill('[data-testid="message-input"]','New message from User1');
    await page1.click('[data-testid="send-btn"]');
    await page2.click(`[data-testid="conversation-${conversationId}"]`);
    await expect(page2.locator(`[data-testid="${conversationId}-unread-count"]`))
        .toHaveText('New message from User1');
})
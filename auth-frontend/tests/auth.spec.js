import {test, expect} from '@playwright/test';
import {createUser} from "./helpers/auth.js";
test('user can login', async ({page,request}) => {
    const { email} = await createUser(request)
    const { password } = await createUser(request)
    await page.goto('http://localhost:5173/login');
    await page.fill('input[data-testid="email-input"]',email);
    await page.fill('input[data-testid="password"]', password);
    await page.click('button[data-testid="login-btn"]');
    await expect(page.getByText('Test User')).toBeVisible();
});

test('user fails with wrong password', async ({page,request}) => {
    const { email } = await createUser(request)
    await page.goto('http://localhost:5173/login');
    await page.fill('input[data-testid="email-input"]',email);
    await page.fill('input[data-testid="password"]', 'wrongpassword');
    await page.click('button[data-testid="login-btn"]');
    await expect(page.getByText('Invalid credentials')).toBeVisible();
})
test('login fails with non-existing user', async ({page}) => {
    await page.goto('http://localhost:5173/login');
    await page.fill('input[data-testid="email-input"]','nouser@gmail.com');
    await page.fill('input[data-testid="password"]', 'wrongpassword');
    await page.click('button[data-testid="login-btn"]');
    await expect(page.getByText('Invalid credentials')).toBeVisible();
})
test('login fails with empty fields', async ({page}) => {
    await page.goto('http://localhost:5173/login');
    await page.click('button[data-testid="login-btn"]');
    const emailInput = page.locator('input[data-testid="email-input"]');
    const isValid = await emailInput.evaluate(el => el.checkValidity());
    const message = await emailInput .evaluate(el=> el.validationMessage);
    expect(isValid).toBe(false);
    expect(message).toContain('fill out this field');
})
test('login fails with invalid email format', async ({page}) => {
    await page.goto('http://localhost:5173/login');
    const emailInput = page.locator('input[data-testid="email-input"]');
    await emailInput.fill('invalid-emailgmail.com');
    await page.fill('input[data-testid="password"]', 'test123');
    await page.click('button[data-testid="login-btn"]');
    const isValid = await emailInput.evaluate(el=> el.checkValidity());
    expect(isValid).toBe(false);
})
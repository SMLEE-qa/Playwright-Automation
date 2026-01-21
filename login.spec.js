const { test, expect } = require('@playwright/test');

test.describe('로그인 기능 테스트', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
  });

  test('TC-001: 정상 로그인', async ({ page }) => {
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.title')).toContainText('Products');
  });

  test('TC-002: 잘못된 비밀번호', async ({ page }) => {
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'wrong_password');
    await page.click('#login-button');
    
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Username and password do not match');
  });

  test('TC-003: 빈 이메일', async ({ page }) => {
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Username is required');
  });

  test('TC-004: 빈 비밀번호', async ({ page }) => {
    await page.fill('#user-name', 'standard_user');
    await page.click('#login-button');
    
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Password is required');
  });

  test('TC-005: 로그아웃', async ({ page }) => {
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    
    await expect(page.locator('#login-button')).toBeVisible();
  });
});

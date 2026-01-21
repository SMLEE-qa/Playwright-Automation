const { test, expect } = require('@playwright/test');

test.describe('결제 프로세스 테스트', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    await page.click('.inventory_item:first-child button');
    await page.click('.shopping_cart_link');
    await page.click('#checkout');
  });

  test('TC-011: 정상 결제 완료', async ({ page }) => {
    await page.fill('#first-name', '승미');
    await page.fill('#last-name', '이');
    await page.fill('#postal-code', '12345');
    
    await page.click('#continue');
    
    await expect(page.locator('.summary_info')).toBeVisible();
    
    await page.click('#finish');
    
    await expect(page.locator('.complete-header')).toContainText('Thank you for your order');
  });

  test('TC-012: 필수 정보 누락 - First Name', async ({ page }) => {
    await page.fill('#last-name', '이');
    await page.fill('#postal-code', '12345');
    
    await page.click('#continue');
    
    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();
    await expect(error).toContainText('First Name is required');
  });

  test('TC-013: 필수 정보 누락 - Postal Code', async ({ page }) => {
    await page.fill('#first-name', '승미');
    await page.fill('#last-name', '이');
    
    await page.click('#continue');
    
    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();
    await expect(error).toContainText('Postal Code is required');
  });

  test('TC-014: 결제 취소', async ({ page }) => {
    await page.fill('#first-name', '승미');
    await page.fill('#last-name', '이');
    await page.fill('#postal-code', '12345');
    
    await page.click('#continue');
    await page.click('#cancel');
    
    await expect(page).toHaveURL(/inventory/);
  });

  test('TC-015: 주문 요약 정보 확인', async ({ page }) => {
    await page.fill('#first-name', '승미');
    await page.fill('#last-name', '이');
    await page.fill('#postal-code', '12345');
    
    await page.click('#continue');
    
    await expect(page.locator('.cart_item')).toHaveCount(1);
    
    await expect(page.locator('.summary_subtotal_label')).toBeVisible();
    await expect(page.locator('.summary_tax_label')).toBeVisible();
    await expect(page.locator('.summary_total_label')).toBeVisible();
  });
});

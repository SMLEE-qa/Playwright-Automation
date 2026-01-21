const { test, expect } = require('@playwright/test');

test.describe('쇼핑 플로우 테스트', () => {
  
  // 각 테스트 전에 로그인
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
  });

  test('TC-006: 상품을 장바구니에 추가', async ({ page }) => {
    // 첫 번째 상품 장바구니에 추가
    await page.click('.inventory_item:first-child button');
    
    // 장바구니 배지에 1 표시 확인
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');
    
    // 장바구니로 이동
    await page.click('.shopping_cart_link');
    
    // 장바구니에 1개 상품 확인
    await expect(page.locator('.cart_item')).toHaveCount(1);
  });

  test('TC-007: 여러 상품을 장바구니에 추가', async ({ page }) => {
    // 3개 상품 추가
    const addButtons = await page.locator('.inventory_item button').all();
    for (let i = 0; i < 3; i++) {
      await addButtons[i].click();
    }
    
    // 장바구니 배지 확인
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('3');
    
    // 장바구니로 이동
    await page.click('.shopping_cart_link');
    
    // 3개 상품 확인
    await expect(page.locator('.cart_item')).toHaveCount(3);
  });

  test('TC-008: 장바구니에서 상품 제거', async ({ page }) => {
    // 상품 추가
    await page.click('.inventory_item:first-child button');
    
    // 장바구니로 이동
    await page.click('.shopping_cart_link');
    
    // Remove 버튼 클릭
    await page.click('.cart_button');
    
    // 장바구니가 비었는지 확인
    await expect(page.locator('.cart_item')).toHaveCount(0);
  });

  test('TC-009: 장바구니 페이지로 이동 및 확인', async ({ page }) => {
    // 상품 추가
    await page.click('.inventory_item:first-child button');
    
    // 장바구니로 이동
    await page.click('.shopping_cart_link');
    
    // Continue Shopping 클릭
    await page.click('#continue-shopping');
    
    // 상품 목록 페이지로 돌아왔는지 확인
    await expect(page).toHaveURL(/inventory/);
  });

  test('TC-010: 전체 구매 프로세스 (End-to-End)', async ({ page }) => {
    // 상품 추가
    await page.click('.inventory_item:first-child button');
    
    // 장바구니로 이동
    await page.click('.shopping_cart_link');
    
    // Checkout 클릭
    await page.click('#checkout');
    
    // 배송 정보 입력
    await page.fill('#first-name', '승미');
    await page.fill('#last-name', '이');
    await page.fill('#postal-code', '12345');
    
    // Continue 클릭
    await page.click('#continue');
    
    // Finish 클릭
    await page.click('#finish');
    
    // 주문 완료 확인
    await expect(page.locator('.complete-header')).toContainText('Thank you');
  });
});

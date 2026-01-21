import { test, expect } from '@playwright/test';

test.describe('쇼핑 플로우 테스트', () => {
  
  // 각 테스트 전에 로그인
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL(/.*inventory/);
  });

  test('TC-006: 상품을 장바구니에 추가', async ({ page }) => {
    // 첫 번째 상품을 장바구니에 추가
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    
    // 장바구니 배지에 1이 표시되는지 확인
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('1');
    
    // 버튼이 'Remove'로 변경되었는지 확인
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
  });

  test('TC-007: 여러 상품을 장바구니에 추가', async ({ page }) => {
    // 3개의 상품을 장바구니에 추가
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
    await page.click('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
    
    // 장바구니 배지에 3이 표시되는지 확인
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText('3');
  });

  test('TC-008: 장바구니에서 상품 제거', async ({ page }) => {
    // 상품 추가
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
    
    // 장바구니 배지 확인
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    
    // 하나의 상품 제거
    await page.click('[data-test="remove-sauce-labs-backpack"]');
    
    // 장바구니 배지가 1로 변경되었는지 확인
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('TC-009: 장바구니 페이지로 이동 및 확인', async ({ page }) => {
    // 상품 추가
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    
    // 장바구니 아이콘 클릭
    await page.click('.shopping_cart_link');
    
    // 장바구니 페이지로 이동 확인
    await expect(page).toHaveURL(/.*cart/);
    
    // 페이지 제목 확인
    await expect(page.locator('.title')).toHaveText('Your Cart');
    
    // 추가한 상품이 표시되는지 확인
    await expect(page.locator('.cart_item')).toBeVisible();
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
  });

  test('TC-010: 전체 구매 프로세스 (End-to-End)', async ({ page }) => {
    // 1. 상품을 장바구니에 추가
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    
    // 2. 장바구니로 이동
    await page.click('.shopping_cart_link');
    await expect(page).toHaveURL(/.*cart/);
    
    // 3. Checkout 버튼 클릭
    await page.click('[data-test="checkout"]');
    await expect(page).toHaveURL(/.*checkout-step-one/);
    
    // 4. 배송 정보 입력
    await page.fill('[data-test="firstName"]', '승미');
    await page.fill('[data-test="lastName"]', '이');
    await page.fill('[data-test="postalCode"]', '12345');
    
    // 5. Continue 버튼 클릭
    await page.click('[data-test="continue"]');
    await expect(page).toHaveURL(/.*checkout-step-two/);
    
    // 6. 주문 정보 확인
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('.summary_info')).toBeVisible();
    
    // 7. Finish 버튼 클릭
    await page.click('[data-test="finish"]');
    
    // 8. 주문 완료 확인
    await expect(page).toHaveURL(/.*checkout-complete/);
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    await expect(page.locator('.complete-text')).toContainText('Your order has been dispatched');
  });
});

import { test, expect } from '@playwright/test';

test.describe('체크아웃 검증 테스트', () => {
  
  test.beforeEach(async ({ page }) => {
    // 로그인
    await page.goto('/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    // 상품 추가 및 체크아웃 페이지로 이동
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('.shopping_cart_link');
    await page.click('[data-test="checkout"]');
  });

  test('TC-011: 필수 입력란 누락 - 이름', async ({ page }) => {
    // 성과 우편번호만 입력
    await page.fill('[data-test="lastName"]', '이');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    
    // 에러 메시지 확인
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('First Name is required');
  });

  test('TC-012: 필수 입력란 누락 - 성', async ({ page }) => {
    // 이름과 우편번호만 입력
    await page.fill('[data-test="firstName"]', '승미');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    
    // 에러 메시지 확인
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Last Name is required');
  });

  test('TC-013: 필수 입력란 누락 - 우편번호', async ({ page }) => {
    // 이름과 성만 입력
    await page.fill('[data-test="firstName"]', '승미');
    await page.fill('[data-test="lastName"]', '이');
    await page.click('[data-test="continue"]');
    
    // 에러 메시지 확인
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Postal Code is required');
  });

  test('TC-014: 체크아웃 취소 기능', async ({ page }) => {
    // Cancel 버튼 클릭
    await page.click('[data-test="cancel"]');
    
    // 장바구니 페이지로 돌아왔는지 확인
    await expect(page).toHaveURL(/.*cart/);
    
    // 장바구니에 상품이 여전히 있는지 확인
    await expect(page.locator('.cart_item')).toBeVisible();
  });

  test('TC-015: 주문 요약 정보 정확성 검증', async ({ page }) => {
    // 배송 정보 입력 및 다음 단계로 이동
    await page.fill('[data-test="firstName"]', '승미');
    await page.fill('[data-test="lastName"]', '이');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    
    // 주문 요약 페이지 확인
    await expect(page).toHaveURL(/.*checkout-step-two/);
    
    // 상품 정보 확인
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
    
    // 가격 정보 확인
    const itemTotal = page.locator('.summary_subtotal_label');
    await expect(itemTotal).toBeVisible();
    await expect(itemTotal).toContainText('Item total:');
    
    // 세금 정보 확인
    const tax = page.locator('.summary_tax_label');
    await expect(tax).toBeVisible();
    await expect(tax).toContainText('Tax:');
    
    // 총액 정보 확인
    const total = page.locator('.summary_total_label');
    await expect(total).toBeVisible();
    await expect(total).toContainText('Total:');
    
    // 결제 정보 확인
    await expect(page.locator('.summary_info')).toBeVisible();
  });
});

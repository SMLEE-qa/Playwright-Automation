import { test, expect } from '@playwright/test';

test.describe('로그인 기능 테스트', () => {
  
  test('TC-001: 정상적인 사용자 로그인', async ({ page }) => {
    // 로그인 페이지로 이동
    await page.goto('/');
    
    // 페이지 제목 확인
    await expect(page).toHaveTitle(/Swag Labs/);
    
    // 사용자 이름 입력
    await page.fill('#user-name', 'standard_user');
    
    // 비밀번호 입력
    await page.fill('#password', 'secret_sauce');
    
    // 로그인 버튼 클릭
    await page.click('#login-button');
    
    // 로그인 성공 확인 - 상품 페이지로 이동
    await expect(page).toHaveURL(/.*inventory/);
    
    // 상품 목록 제목 확인
    await expect(page.locator('.title')).toHaveText('Products');
    
    // 로고 표시 확인
    await expect(page.locator('.app_logo')).toBeVisible();
  });

  test('TC-002: 잘못된 사용자명으로 로그인 시도', async ({ page }) => {
    await page.goto('/');
    
    // 존재하지 않는 사용자명 입력
    await page.fill('#user-name', 'invalid_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    // 에러 메시지 확인
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Username and password do not match');
    
    // 여전히 로그인 페이지에 있는지 확인
    await expect(page).toHaveURL('/');
  });

  test('TC-003: 잘못된 비밀번호로 로그인 시도', async ({ page }) => {
    await page.goto('/');
    
    // 올바른 사용자명, 틀린 비밀번호 입력
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'wrong_password');
    await page.click('#login-button');
    
    // 에러 메시지 확인
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Username and password do not match');
  });

  test('TC-004: 빈 입력란으로 로그인 시도', async ({ page }) => {
    await page.goto('/');
    
    // 아무것도 입력하지 않고 로그인 버튼 클릭
    await page.click('#login-button');
    
    // 사용자명 필수 입력 에러 메시지 확인
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Username is required');
  });

  test('TC-005: 사용자명만 입력하고 로그인 시도', async ({ page }) => {
    await page.goto('/');
    
    // 사용자명만 입력
    await page.fill('#user-name', 'standard_user');
    await page.click('#login-button');
    
    // 비밀번호 필수 입력 에러 메시지 확인
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Password is required');
  });
});

import { test, expect } from '@playwright/test';

test.describe('Desafio Extra - UI Externa (SauceDemo)', () => {
  
  test('Deve realizar login com sucesso em sistema externo de mercado', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.locator('[data-testid="username"]').fill('standard_user');
    await page.locator('[data-testid="password"]').fill('secret_sauce');
    await page.locator('[data-testid="login-button"]').click();

    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.title')).toHaveText('Products');
  });
});
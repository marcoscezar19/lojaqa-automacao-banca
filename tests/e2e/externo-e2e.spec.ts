/* import { test, expect } from '@playwright/test';

test.describe('Desafio Extra - UI Externa (SauceDemo)', () => {
  
  test('Deve realizar login com sucesso em sistema externo de mercado', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.locator('[data-testid="username"]').fill('standard_user');
    await page.locator('[data-testid="password"]').fill('secret_sauce');
    await page.locator('[data-testid="login-button"]').click();

    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.title')).toHaveText('Products');
  });
}); */


import { test, expect } from '@playwright/test';
import { SauceDemoPage } from '../../pages/SauceDemoPage';

test.describe('Desafio Extra de Portfólio: Automação E2E Externa (UI)', () => {
  test('Fluxo de login e adição de produto ao carrinho no SauceDemo', async ({ page }) => {
    const saucePage = new SauceDemoPage(page);

    // 1. Arrange & Act: Acessa e loga no sistema externo
    await saucePage.goto();
    await saucePage.login('standard_user', 'secret_sauce');

    // Asserção de redirecionamento para o inventário
    await expect(page).toHaveURL(/inventory\.html/);

    // 2. Act: Adiciona produto ao carrinho
    await saucePage.adicionarProdutoAoCarrinho();

    // 3. Assert: Valida se o badge do carrinho foi atualizado para "1"
    await expect(saucePage.cartBadge).toHaveText('1');
    console.log('✅ [E2E Externo] Produto adicionado com sucesso no SauceDemo!');
  });
});
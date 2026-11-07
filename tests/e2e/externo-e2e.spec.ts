// Este teste usa a fixture padrão do Playwright, independente da sessão e da API da LojaQA.
import { test, expect } from '@playwright/test';
import { SauceDemoPage } from '../../pages/SauceDemoPage';

// Caso de mercado exigido pela atividade: demonstra login e uma ação de compra em outro sistema público.
test('Externo: login e adição de produto ao carrinho no SauceDemo', async ({ page }) => {
  // ARRANGE: cria o Page Object com a aba isolada fornecida pelo Playwright e abre o site.
  const saucePage = new SauceDemoPage(page);
  await saucePage.goto();

  // ACT: usa o usuário público de demonstração e confirma a navegação antes de adicionar um produto.
  await saucePage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL(/inventory\.html$/);
  await saucePage.adicionarProdutoAoCarrinho();

  // ASSERT: contador igual a um comprova a atualização do carrinho; o expect fica no teste, fora do POM.
  await expect(saucePage.cartBadge).toHaveText('1');
  console.log('[E2E externo] SauceDemo: login e carrinho validados.');
});

/* import { test, expect } from '../../fixtures/auth.fixture';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { massasCheckout } from '../../data/checkout.mass';

test.describe('Módulo 07: Checkout, Pagamentos & Confirmação de Pedido (E2E)', () => {
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    checkoutPage = new CheckoutPage(authenticatedPage);
  });

  // DATA-DRIVEN LOOP PARA OS CENÁRIOS POSITIVOS E NEGATIVOS
  for (const massa of massasCheckout) {
    test(`Data-Driven E2E: ${massa.perfilCenario}`, async ({ authenticatedPage }) => {
      // 1. Arrange: Garante que há itens no carrinho e vai para o checkout
      await authenticatedPage.goto('https://alisonmelo.github.io/tioalison-pe-t4-fap26/projetos-base/01-sistema-login/painel.html');
      
      // Simula adição de produto prévio ao carrinho se necessário
      await checkoutPage.preencherEndereco(massa.endereco);

      // 2. Act: Preenche pagamento conforme a massa de dados
      if (massa.pagamento.metodo === 'PIX') {
        await checkoutPage.selecionarPagamentoPix();
      } else if (massa.pagamento.metodo === 'Cartao') {
        await checkoutPage.preencherCartao(
          massa.pagamento.bandeira!,
          massa.pagamento.numeroCartao!,
          massa.pagamento.validade!,
          massa.pagamento.cvv!
        );
      }

      await checkoutPage.clicarFinalizar();

      // 3. Assert: Valida resultado esperado (Positivo vs Triste)
      if (massa.sucessoEsperado) {
        await expect(checkoutPage.modalSucesso).toBeVisible({ timeout: 10000 });
      } else {
        await expect(checkoutPage.mensagemErroTela).toBeVisible();
        if (massa.mensagemErroEsperada) {
          await expect(checkoutPage.mensagemErroTela).toContainText(massa.mensagemErroEsperada);
        }
      }
    });
  }

  test('Cenário Exploratório Triste: Tentativa de checkout com carrinho vazio', async ({ authenticatedPage }) => {
    // Tenta finalizar o pedido sem adicionar nenhum produto ou endereço
    await checkoutPage.clicarFinalizar();
    await expect(checkoutPage.mensagemErroTela).toBeVisible();
  });
}); 
*/

/* 
import { test, expect } from '../../fixtures/auth.fixture';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { massasCheckout } from '../../data/checkout.mass';

test.describe('Módulo 07: Checkout, Pagamentos & Confirmação de Pedido (E2E)', () => {
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    checkoutPage = new CheckoutPage(authenticatedPage);
    
    // Garante que estamos na página de painel/checkout da Loja QA
    await authenticatedPage.goto('https://alisonmelo.github.io/tioalison-pe-t4-fap26/projetos-base/01-sistema-login/painel.html');
    
    // Se houver um botão ou aba para ir ao Checkout / Carrinho, clicamos nele caso exista na UI
    const irParaCheckoutBtn = authenticatedPage.locator('#navCheckout, a[href*="checkout"], button:has-text("Checkout"), button:has-text("Carrinho")');
    if (await irParaCheckoutBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await irParaCheckoutBtn.click();
    }
  });

  // DATA-DRIVEN LOOP PARA OS CENÁRIOS POSITIVOS E NEGATIVOS
  for (const massa of massasCheckout) {
    test(`Data-Driven E2E: ${massa.perfilCenario}`, async ({ authenticatedPage }) => {
      // 1. Act: Preenche endereço e pagamento conforme a massa de dados
      await checkoutPage.preencherEndereco(massa.endereco);

      if (massa.pagamento.metodo === 'PIX') {
        await checkoutPage.selecionarPagamentoPix();
      } else if (massa.pagamento.metodo === 'Cartao') {
        await checkoutPage.preencherCartao(
          massa.pagamento.bandeira!,
          massa.pagamento.numeroCartao!,
          massa.pagamento.validade!,
          massa.pagamento.cvv!
        );
      }

      await checkoutPage.clicarFinalizar();

      // 3. Assert: Valida resultado esperado (Positivo vs Triste)
      if (massa.sucessoEsperado) {
        await expect(checkoutPage.modalSucesso).toBeVisible({ timeout: 10000 });
      } else {
        await expect(checkoutPage.mensagemErroTela).toBeVisible();
        if (massa.mensagemErroEsperada) {
          await expect(checkoutPage.mensagemErroTela).toContainText(massa.mensagemErroEsperada);
        }
      }
    });
  }

  test('Cenário Exploratório Triste: Tentativa de checkout com carrinho vazio', async ({ authenticatedPage }) => {
    // Tenta finalizar o pedido diretamente sem preencher endereço ou adicionar itens
    await checkoutPage.clicarFinalizar();
    await expect(checkoutPage.mensagemErroTela).toBeVisible();
  });
}); 
*/

import { test, expect } from '../../fixtures/auth.fixture';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { massasCheckout } from '../../data/checkout.mass';

test.describe('Módulo 07: Checkout, Pagamentos & Confirmação de Pedido (E2E)', () => {
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    checkoutPage = new CheckoutPage(authenticatedPage);
    
    // 1. Acessa o painel logado do cliente
    await authenticatedPage.goto('https://alisonmelo.github.io/tioalison-pe-t4-fap26/projetos-base/01-sistema-login/painel.html');
    
    // 2. Garante que o modal/aba do Carrinho ou Checkout seja aberto antes dos testes
    // Procuramos por botões comuns que abrem o carrinho ou a área de pagamento na Loja QA
    const abrirCarrinhoOuCheckoutBtn = authenticatedPage.locator(
      '#cartBtn, #openCart, button:has-text("Carrinho"), button:has-text("Checkout"), a[href*="checkout"], .fa-shopping-cart, button:has-text("Comprar")'
    );
    
    if (await abrirCarrinhoOuCheckoutBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
      await abrirCarrinhoOuCheckoutBtn.first().click();
    }
  });

  // DATA-DRIVEN LOOP PARA OS CENÁRIOS POSITIVOS E NEGATIVOS
  for (const massa of massasCheckout) {
    test(`Data-Driven E2E: ${massa.perfilCenario}`, async ({ authenticatedPage }) => {
      // 1. Act: Preenche endereço usando o Page Object
      await checkoutPage.preencherEndereco(massa.endereco);

      // 2. Act: Seleciona o método de pagamento correspondente
      if (massa.pagamento.metodo === 'PIX') {
        await checkoutPage.selecionarPagamentoPix();
      } else if (massa.pagamento.metodo === 'Cartao') {
        await checkoutPage.preencherCartao(
          massa.pagamento.bandeira!,
          massa.pagamento.numeroCartao!,
          massa.pagamento.validade!,
          massa.pagamento.cvv!
        );
      }

      await checkoutPage.clicarFinalizar();

      // 3. Assert: Valida resultado esperado (Sucesso vs Erro)
      if (massa.sucessoEsperado) {
        await expect(checkoutPage.modalSucesso).toBeVisible({ timeout: 10000 });
      } else {
        await expect(checkoutPage.mensagemErroTela).toBeVisible();
        if (massa.mensagemErroEsperada) {
          await expect(checkoutPage.mensagemErroTela).toContainText(massa.mensagemErroEsperada);
        }
      }
    });
  }

  test('Cenário Exploratório Triste: Tentativa de checkout com carrinho vazio', async ({ authenticatedPage }) => {
    // Tenta finalizar o pedido diretamente sem adicionar produtos
    await checkoutPage.clicarFinalizar();
    await expect(checkoutPage.mensagemErroTela).toBeVisible();
  });
});

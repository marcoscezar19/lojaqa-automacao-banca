import { test, expect } from '../../fixtures/auth.fixture';
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
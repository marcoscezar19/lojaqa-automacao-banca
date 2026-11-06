import { Page, Locator } from '@playwright/test';

/**
 * @class CheckoutPage
 * @description Page Object Model para o Módulo 07: Checkout & Pagamentos.
 * REGRA DE OURO: Contém apenas seletores e ações de negócio. Nenhuma asserção (expect) deve residir aqui.
 */
export class CheckoutPage {
  readonly enderecoInput: Locator;
  readonly pixRadioButton: Locator;
  readonly cartaoRadioButton: Locator;
  readonly selectBandeira: Locator;
  readonly numeroCartaoInput: Locator;
  readonly validadeInput: Locator;
  readonly cvvInput: Locator;
  readonly finalizarPedidoBtn: Locator;
  readonly modalSucesso: Locator;
  readonly mensagemErroTela: Locator;

  constructor(private page: Page) {
    this.enderecoInput = page.locator('#shippingAddress, input[name="address"]');
    this.pixRadioButton = page.locator('input[value="pix"], #pixPayment');
    this.cartaoRadioButton = page.locator('input[value="card"], #cardPayment');
    this.selectBandeira = page.locator('#cardBrand, select[name="brand"]');
    this.numeroCartaoInput = page.locator('#cardNumber, input[name="cardNumber"]');
    this.validadeInput = page.locator('#cardExpiry, input[name="expiry"]');
    this.cvvInput = page.locator('#cardCvv, input[name="cvv"]');
    this.finalizarPedidoBtn = page.locator('#checkoutBtn, button:has-text("Finalizar Pedido")');
    this.modalSucesso = page.locator('.modal-success, #orderConfirmedModal, div:has-text("Pedido confirmado")');
    this.mensagemErroTela = page.locator('.error-message, #checkoutError, .alert-danger');
  }

  async preencherEndereco(endereco: string) {
    await this.enderecoInput.fill(endereco);
  }

  async selecionarPagamentoPix() {
    await this.pixRadioButton.click();
  }

  async preencherCartao(bandeira: string, numero: string, validade: string, cvv: string) {
    await this.cartaoRadioButton.click();
    await this.selectBandeira.selectOption({ label: bandeira });
    await this.numeroCartaoInput.fill(numero);
    await this.validadeInput.fill(validade);
    await this.cvvInput.fill(cvv);
  }

  async clicarFinalizar() {
    await this.finalizarPedidoBtn.click();
  }
}
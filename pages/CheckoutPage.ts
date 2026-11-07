/* import { Page, Locator } from '@playwright/test';

/**
 * @class CheckoutPage
 * @description Page Object Model para o Módulo 07: Checkout & Pagamentos.
 * REGRA DE OURO: Contém apenas seletores e ações de negócio. Nenhuma asserção (expect) deve residir aqui.
 
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
*/

/* 
import { Page, Locator } from '@playwright/test';

/**
 * @class CheckoutPage
 * @description Page Object Model para o Módulo 07: Checkout & Pagamentos.
 * REGRA DE OURO: Contém apenas seletores e ações de negócio. Nenhuma asserção (expect) deve residir aqui.
 
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
    // Seletores genéricos e específicos mapeados para o ecossistema Loja QA
    this.enderecoInput = page.locator('#shippingAddress, input[name="address"], #address, input[id*="endereco"]');
    this.pixRadioButton = page.locator('input[value="pix"], #pix, #paymentPix, label:has-text("PIX")');
    this.cartaoRadioButton = page.locator('input[value="card"], input[value="credit"], #card, #paymentCard');
    this.selectBandeira = page.locator('#cardBrand, select[name="brand"], select[id*="bandeira"]');
    this.numeroCartaoInput = page.locator('#cardNumber, input[name="cardNumber"], input[id*="cartao"]');
    this.validadeInput = page.locator('#cardExpiry, input[name="expiry"], input[id*="validade"]');
    this.cvvInput = page.locator('#cardCvv, input[name="cvv"], input[id*="cvv"]');
    this.finalizarPedidoBtn = page.locator('#checkoutBtn, button:has-text("Finalizar Pedido"), button:has-text("Confirmar Pedido"), #finalizarBtn');
    this.modalSucesso = page.locator('.modal-success, #orderConfirmedModal, div:has-text("Pedido confirmado"), .swal2-popup');
    this.mensagemErroTela = page.locator('.error-message, #checkoutError, .alert-danger, .invalid-feedback');
  }

  async preencherEndereco(endereco: string) {
    await this.enderecoInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.enderecoInput.fill(endereco);
  }

  async selecionarPagamentoPix() {
    await this.pixRadioButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.pixRadioButton.click();
  }

  async preencherCartao(bandeira: string, numero: string, validade: string, cvv: string) {
    await this.cartaoRadioButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.cartaoRadioButton.click();
    if (await this.selectBandeira.isVisible()) {
      await this.selectBandeira.selectOption({ label: bandeira }).catch(() => this.selectBandeira.selectOption({ index: 1 }));
    }
    await this.numeroCartaoInput.fill(numero);
    await this.validadeInput.fill(validade);
    await this.cvvInput.fill(cvv);
  }

  async clicarFinalizar() {
    await this.finalizarPedidoBtn.waitFor({ state: 'visible', timeout: 5000 });
    await this.finalizarPedidoBtn.click();
  }
}
 */


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
    // Seletores amplos e resilientes para inputs de endereço e formulários de checkout
    this.enderecoInput = page.locator('input[id*="address"], input[name*="address"], input[placeholder*="endereço" i], input[placeholder*="address" i], textarea[id*="address"], #shippingAddress').first();
    
    // Seletores para opções de pagamento (PIX e Cartão)
    this.pixRadioButton = page.locator('input[value*="pix" i], label:has-text("PIX"), #pix, input[id*="pix"]').first();
    this.cartaoRadioButton = page.locator('input[value*="card" i], input[value*="credit" i], label:has-text("Cartão"), #card, input[id*="card"]').first();
    
    // Seletores para dados do cartão
    this.selectBandeira = page.locator('select[id*="brand"], select[name*="brand"], select[id*="bandeira"], select').first();
    this.numeroCartaoInput = page.locator('input[id*="number"], input[name*="number"], input[placeholder*="número" i], input[placeholder*="card" i]').first();
    this.validadeInput = page.locator('input[id*="exp"], input[name*="exp"], input[placeholder*="mm" i], input[placeholder*="validade" i]').first();
    this.cvvInput = page.locator('input[id*="cvv"], input[name*="cvv"], input[placeholder*="cvv" i]').first();
    
    // Botão de finalizar pedido
    this.finalizarPedidoBtn = page.locator('button:has-text("Finalizar"), button:has-text("Confirmar"), button:has-text("Comprar"), button[type="submit"], #checkoutBtn').first();
    
    // Modais e mensagens de erro
    this.modalSucesso = page.locator('.modal, .swal2-popup, div:has-text("sucesso"), div:has-text("confirmado"), #orderConfirmedModal').first();
    this.mensagemErroTela = page.locator('.error, .alert-danger, .invalid-feedback, div:has-text("erro"), div:has-text("inválido")').first();
  }

  async preencherEndereco(endereco: string) {
    // Aguarda o input de endereço ficar visível na DOM e preenche
    await this.enderecoInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.enderecoInput.fill(endereco);
  }

  async selecionarPagamentoPix() {
    await this.pixRadioButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.pixRadioButton.click();
  }

  async preencherCartao(bandeira: string, numero: string, validade: string, cvv: string) {
    await this.cartaoRadioButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.cartaoRadioButton.click();
    
    if (await this.selectBandeira.isVisible().catch(() => false)) {
      await this.selectBandeira.selectOption({ label: bandeira }).catch(() => this.selectBandeira.selectOption({ index: 1 }));
    }
    
    await this.numeroCartaoInput.fill(numero);
    await this.validadeInput.fill(validade);
    await this.cvvInput.fill(cvv);
  }

  async clicarFinalizar() {
    await this.finalizarPedidoBtn.waitFor({ state: 'visible', timeout: 10000 });
    await this.finalizarPedidoBtn.click();
  }
}
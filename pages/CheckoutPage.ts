// Page dá acesso ao navegador; EnderecoCheckout define quais dados o preenchimento precisa receber.
import { Page } from '@playwright/test';
import { EnderecoCheckout } from '../data/checkout.mass';

// Page Object do módulo 07: centraliza como operar a tela, sem decidir se o resultado está correto.
export class CheckoutPage {
  // A propriedade private page guarda a aba recebida para os métodos desta classe.
  constructor(private page: Page) {}

  // Os getters expõem localizadores aos testes. O botão é identificado pelo papel e pelo texto exibido.
  get finalizarPedidoBtn() { return this.page.getByRole('button', { name: 'Confirmar e Finalizar Pedido', exact: true }); }
  // Exclui o modal com a classe hidden para não confundir sua presença no HTML com a abertura efetiva.
  get modalSucesso() { return this.page.locator('#orderDetailModal:not(.hidden)'); }
  // Seleciona o aviso somente quando a aplicação o classifica como erro.
  get mensagemErroTela() { return this.page.locator('#checkoutNotice.error'); }
  // A lista coloca a compra recente primeiro; o teste ainda compara seu ID com a resposta da API.
  get primeiroPedido() { return this.page.locator('#ordersList article.data-row').first(); }
  // Valores do resumo: produtos, frete, desconto e total serão lidos e calculados no teste.
  get subtotal() { return this.page.locator('#priceSubtotal'); }
  get frete() { return this.page.locator('#priceShipping'); }
  get desconto() { return this.page.locator('#priceDiscount'); }
  get total() { return this.page.locator('#priceTotal'); }
  // A bandeira vem da detecção feita pela aplicação a partir do número informado, não de um select.
  get bandeiraDetectada() { return this.page.locator('#detectedBrandIcon'); }

  // Abre os detalhes do primeiro pedido depois que o teste confirma que ele é o pedido recém-criado.
  async abrirDetalhesDoPrimeiroPedido() {
    await this.primeiroPedido.getByRole('button', { name: 'Ver Detalhes' }).click();
  }

  // Prepara uma compra pela interface: adiciona um produto, abre o carrinho e segue para o checkout.
  async abrirComProduto() {
    await this.page.getByRole('button', { name: 'Adicionar ao carrinho', exact: true }).first().click();
    await this.page.locator('#cartButton').click();
    await this.page.getByRole('button', { name: 'Continuar para checkout', exact: true }).click();
    // O frete aparece após a inicialização do formulário; esperar esse elemento evita preencher antes dos eventos estarem prontos.
    await this.page.locator('#shippingCardsGrid input').first().waitFor({ state: 'visible' });
  }

  // Usa comprador e CPF de demonstração, mais o endereço recebido da massa. Esses dados são pré-condições do pagamento.
  async preencherEndereco(endereco: EnderecoCheckout) {
    await this.page.getByRole('textbox', { name: 'Nome Completo', exact: true }).fill('Cliente Teste QA');
    await this.page.getByRole('textbox', { name: 'CPF do Titular' }).fill('52998224725');
    // O CEP dispara a busca automática. Nos testes do módulo 07, essa chamada é bloqueada e o endereço é preenchido manualmente.
    await this.page.locator('#deliveryCep').fill(endereco.cep);
    // Espera a consulta encerrar com sucesso ou erro antes de preencher, evitando que uma resposta tardia sobrescreva o endereço.
    await this.page.locator('#cepFeedbackBox.success, #cepFeedbackBox.error').waitFor({ state: 'visible' });
    await this.page.locator('#deliveryStreet').fill(endereco.rua);
    await this.page.locator('#deliveryNumber').fill(endereco.numero);
    await this.page.locator('#deliveryNeighborhood').fill(endereco.bairro);
    await this.page.locator('#deliveryCity').fill(endereco.cidade);
    await this.page.locator('#deliveryState').fill(endereco.uf);
  }

  // O nome do botão começa com PIX e inclui o selo de desconto; a expressão regular aceita esse complemento.
  async selecionarPagamentoPix() {
    await this.page.getByRole('button', { name: /^PIX/ }).click();
  }

  // Abre a opção cartão e preenche número, titular, validade e CVV; dados inválidos também são aceitos como entrada do teste.
  async preencherCartao(numero: string, titular: string, validade: string, cvv: string) {
    await this.page.getByRole('button', { name: 'Cartão de Crédito', exact: true }).click();
    await this.page.locator('#cardNumber').fill(numero);
    await this.page.locator('#cardHolderName').fill(titular);
    await this.page.locator('#cardExpiryDate').fill(validade);
    await this.page.locator('#cardCvvCode').fill(cvv);
  }

  // Solicita a finalização. O teste, e não este método, verifica status HTTP, mensagem ou pedido criado.
  async clicarFinalizar() {
    await this.finalizarPedidoBtn.click();
  }
}

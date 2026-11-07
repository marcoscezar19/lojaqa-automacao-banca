// Page representa a aba do navegador; Locator representa uma forma de encontrar um elemento.
import { Page, Locator } from '@playwright/test';

// Page Object do sistema externo: reúne seletores e ações. Os testes ficam responsáveis pelos expect.
export class SauceDemoPage {
  // readonly impede trocar estas referências depois da construção; os elementos ainda podem ser usados normalmente.
  readonly userInput: Locator;
  readonly passInput: Locator;
  readonly loginBtn: Locator;
  readonly productTitle: Locator;
  readonly addToCartBtn: Locator;
  readonly cartBadge: Locator;

  // Recebe a página criada pelo Playwright e prepara os localizadores, sem clicar ou preencher neste momento.
  constructor(private page: Page) {
    // Os placeholders identificam os campos; exact exige correspondência completa do texto.
    this.userInput = page.getByPlaceholder('Username', { exact: true });
    this.passInput = page.getByPlaceholder('Password', { exact: true });
    // O papel button e o nome visível aproximam o seletor da forma como o usuário identifica o botão.
    this.loginBtn = page.getByRole('button', { name: 'Login', exact: true });
    // first escolhe o primeiro produto. Este localizador fica disponível, mas o cenário atual não o valida.
    this.productTitle = page.locator('.inventory_item_name').first();
    // Como vários produtos possuem o mesmo botão, first limita a ação a um deles.
    this.addToCartBtn = page.getByRole('button', { name: 'Add to cart', exact: true }).first();
    // O contador do carrinho será usado pelo teste para conferir a quantidade adicionada.
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  // Abre o SauceDemo usando uma URL absoluta, independente de qualquer configuração da LojaQA.
  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  // Preenche as credenciais recebidas do teste e envia o formulário. await aguarda cada ação terminar.
  async login(user: string, pass: string) {
    await this.userInput.fill(user);
    await this.passInput.fill(pass);
    await this.loginBtn.click();
  }

  // Executa a ação de negócio; a confirmação do resultado permanece no arquivo de teste.
  async adicionarProdutoAoCarrinho() {
    await this.addToCartBtn.click();
  }
}

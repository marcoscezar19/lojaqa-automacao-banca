import { Page, Locator } from '@playwright/test';

export class SauceDemoPage {
  readonly userInput: Locator;
  readonly passInput: Locator;
  readonly loginBtn: Locator;
  readonly productTitle: Locator;
  readonly addToCartBtn: Locator;
  readonly cartBadge: Locator;

  constructor(private page: Page) {
    this.userInput = page.locator('#user-name');
    this.passInput = page.locator('#password');
    this.loginBtn = page.locator('#login-button');
    this.productTitle = page.locator('.inventory_item_name').first();
    this.addToCartBtn = page.locator('button[name*="add-to-cart"]').first();
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async login(user: string, pass: string) {
    await this.userInput.fill(user);
    await this.passInput.fill(pass);
    await this.loginBtn.click();
  }

  async adicionarProdutoAoCarrinho() {
    await this.addToCartBtn.click();
  }
}
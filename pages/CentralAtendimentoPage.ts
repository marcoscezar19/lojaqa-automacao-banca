import { Page, Locator } from '@playwright/test';

export class CentralAtendimentoPage {
  readonly page: Page;
  readonly faqAccordionButton: Locator;
  readonly nomeInput: Locator;
  readonly emailInput: Locator;
  readonly mensagemInput: Locator;
  readonly enviarButton: Locator;
  readonly mensagemSucesso: Locator;
  readonly numeroProtocolo: Locator;

  constructor(page: Page) {
    this.page = page;
    // Seletores semânticos recomendados pela banca
    this.faqAccordionButton = page.getByRole('button', { name: /dúvidas frequentes|faq/i }).first();
    this.nomeInput = page.getByRole('textbox', { name: /nome|seu nome/i });
    this.emailInput = page.getByRole('textbox', { name: /e-mail|email/i });
    this.mensagemInput = page.getByRole('textbox', { name: /mensagem|dúvida|chamado/i });
    this.enviarButton = page.getByRole('button', { name: /enviar|abrir chamado|enviar mensagem/i });
    this.mensagemSucesso = page.getByText(/sucesso|enviado com sucesso|protocolo gerado/i);
    this.numeroProtocolo = page.locator('[data-testid="protocolo-id"], .protocolo-number');
  }

  async navegar() {
    await this.page.goto('/central-de-atendimento');
  }

  async expandirFaq() {
    await this.faqAccordionButton.click();
  }

  async preencherFormularioChamado(nome: string, email: string, mensagem: string) {
    await this.nomeInput.fill(nome);
    await this.emailInput.fill(email);
    await this.mensagemInput.fill(mensagem);
  }

  async enviarChamado() {
    await this.enviarButton.click();
  }
}
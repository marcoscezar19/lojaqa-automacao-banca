import { test, expect } from '@playwright/test';
import { Modulo12Page } from '../../pages/Modulo12Page';

test.describe('Módulo 12 - Central de Atendimento & FAQ (E2E)', () => {
  
  test('Deve expandir o FAQ e abrir um chamado de suporte com sucesso', async ({ page }) => {
    const modulo12 = new Modulo12Page(page);

    await modulo12.navegar();

    // Interação E2E 1: Acordeão
    await modulo12.expandirFaq();
    await expect(page.locator('.faq-content, [data-testid="faq-resposta"]')).toBeVisible();

    // Interação E2E 2: Formulário
    await modulo12.preencherFormularioChamado(
      'Marcos Carneiro',
      'marcos.teste@email.com',
      'Preciso de suporte técnico.'
    );
    await modulo12.enviarChamado();

    await expect(modulo12.mensagemSucesso).toBeVisible();
  });

  test('Deve exibir erro ao tentar enviar formulário vazio', async ({ page }) => {
    const modulo12 = new Modulo12Page(page);
    await modulo12.navegar();

    await modulo12.enviarChamado();
    await expect(page.getByText(/preencha este campo|obrigatório/i)).toBeVisible();
  });
});
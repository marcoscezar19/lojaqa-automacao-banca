// Renomeia o test original para base, permitindo estendê-lo com uma preparação reutilizável.
import { test as base, expect, Page } from '@playwright/test';
import { clienteLogin } from '../data/login.data';

// Endereço comum da aplicação; os testes o reutilizam para navegação e comparação de URLs.
export const LOJA_URL = 'https://alisonmelo.github.io/tioalison-pe-t4-fap26/projetos-base/01-sistema-login';

// Declara ao TypeScript que a fixture fornece uma Page chamada authenticatedPage.
type AuthFixtures = { authenticatedPage: Page };

// Os testes que importam este test podem pedir authenticatedPage e recebem a sessão preparada automaticamente.
export const test = base.extend<AuthFixtures>({
  // page é a aba isolada do teste; request faz HTTP sem interface; use entrega a página pronta ao cenário.
  authenticatedPage: async ({ page, request }, use) => {
    // Autentica pela API para concentrar a demonstração em checkout, e não em testar o formulário de login.
    const response = await request.post('https://api-qa-fap2026.onrender.com/api/login', {
      data: { email: clienteLogin.email, password: clienteLogin.senha },
    });
    // Estas verificações são pré-condições: se o login falhar, o teste para antes de tentar comprar.
    expect(response.status(), 'Login do cliente via API').toBe(200);
    const session = await response.json();
    expect(session.token).toBeTruthy();
    expect(session.user.email).toBe(clienteLogin.email);

    // Abre o domínio correto, pois cada origem possui seu próprio localStorage.
    await page.goto(`${LOJA_URL}/login.html`);
    // evaluate roda dentro do navegador; grava os mesmos dados de sessão que a aplicação usa após autenticar.
    await page.evaluate(({ token, user }) => {
      localStorage.setItem('token', token);
      // O usuário precisa ser convertido em JSON porque o localStorage guarda valores como texto.
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');
      // Cada cenário começa sem itens anteriores; o teste positivo adicionará seu próprio produto pela interface.
      localStorage.removeItem('lojaqa_cart');
    }, session);
    await page.goto(`${LOJA_URL}/loja.html`);
    // Entrega a página ao teste e aguarda sua conclusão; o Playwright encerra o contexto isolado ao terminar.
    await use(page);
  },
});

// Reexporta expect para os cenários importarem teste e asserções do mesmo arquivo.
export { expect };

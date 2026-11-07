/* import { test as base } from '@playwright/test';

// Caso sua suíte precise de um contexto autenticado pré-definido pela banca
export const test = base.extend({
  // Exemplo de fixture personalizada de sessão, se necessário
  authenticatedPage: async ({ page }, use) => {
    // Aqui entrariam passos de login prévios se o seu módulo exigisse sessão autenticada
    await page.goto('/');
    await use(page);
  },
});

export { expect } from '@playwright/test'; */

import { test as base, expect } from '@playwright/test';

type AuthFixtures = {
  authenticatedPage: import('@playwright/test').Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page, request }, use) => {
    // ARRANGE: Realiza requisição de login para obter o Token JWT do cliente
    const loginResponse = await request.post('https://api-qa-fap2026.onrender.com/api/login', {
      data: {
        email: 'user@system.com',
        password: 'UserPassword123',
      },
    });

    expect(loginResponse.status()).toBe(200);
    const loginBody = await loginResponse.json();
    const token = loginBody.token;

    // Injeta o token no localStorage antes de navegar para o painel de compras
    await page.goto('https://alisonmelo.github.io/tioalison-pe-t4-fap26/projetos-base/01-sistema-login/login.html');
    await page.evaluate((jwtToken) => {
      localStorage.setItem('token', jwtToken);
    }, token);

    // Navega para o painel logado
    await page.goto('https://alisonmelo.github.io/tioalison-pe-t4-fap26/projetos-base/01-sistema-login/painel.html');

    await use(page);
  },
});

export { expect };
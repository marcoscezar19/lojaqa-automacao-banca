import { test as base } from '@playwright/test';

// Caso sua suíte precise de um contexto autenticado pré-definido pela banca
export const test = base.extend({
  // Exemplo de fixture personalizada de sessão, se necessário
  authenticatedPage: async ({ page }, use) => {
    // Aqui entrariam passos de login prévios se o seu módulo exigisse sessão autenticada
    await page.goto('/');
    await use(page);
  },
});

export { expect } from '@playwright/test';
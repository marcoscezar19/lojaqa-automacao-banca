import { defineConfig, devices } from '@playwright/test';

/**
 * @file playwright.config.ts
 * @description Configuração oficial do Playwright para o Projeto da Banca (Módulo 07 - FAP 2026).
 */
export default defineConfig({
  // Tempo limite por teste: 45 segundos (protege contra eventuais cold starts no servidor da Render)
  timeout: 45 * 1000,

  // Tempo limite para asserções do expect
  expect: {
    timeout: 10 * 1000,
  },

  // Diretório onde estão localizadas as suítes de teste
  testDir: './tests',

  // Execução paralela de testes
  fullyParallel: true,

  // Evita commits acidentais com test.only em ambientes de CI
  forbidOnly: !!process.env.CI,

  // Tentativas de reexecução (retries)
  retries: process.env.CI ? 2 : 0,

  // Número de workers (paralelismo)
  workers: process.env.CI ? 1 : undefined,

  // Gerador de relatórios visuais HTML
  reporter: 'html',

  // Bloco 'use' ÚNICO contendo todas as configurações globais de execução
  use: {
    // Exibe a execução em tela (--headed) exigido na banca
    headless: false,
    
    // Captura evidências visuais em caso de falha
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',

    // Desabilita a lentidão proposital da aceleração gráfica se necessário
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
  },

  // Configuração dos navegadores focados na execução da banca
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
});
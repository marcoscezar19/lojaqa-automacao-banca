// defineConfig tipa a configuração; devices fornece perfis de navegador e dispositivo.
import { defineConfig, devices } from '@playwright/test';

// Configuração compartilhada pela suíte. Não há timeouts personalizados: continuam valendo os padrões do Playwright.
export default defineConfig({
  // Somente os cenários em tests são descobertos; exemplos preservados em examples ficam fora da execução.
  testDir: './tests',

  // Desativa o paralelismo entre testes do mesmo arquivo, pois as compras usam uma conta de demonstração compartilhada.
  fullyParallel: false,

  // No CI, impede publicar acidentalmente test.only e executar apenas parte da suíte.
  forbidOnly: !!process.env.CI,

  // No CI, repete falhas até duas vezes; localmente não repete para facilitar a leitura da demonstração.
  retries: process.env.CI ? 2 : 0,

  // Um único worker também impede que arquivos diferentes disputem a primeira posição na lista de pedidos.
  workers: 1,

  // list mostra resultados no terminal; html guarda evidências sem abrir o relatório automaticamente.
  reporter: [['list'], ['html', { open: 'never' }]],

  // Opções compartilhadas de execução; dentro do projeto, use também aplica o perfil específico do navegador.
  use: {
    // Localmente o navegador aparece; no CI roda sem interface. O comando da banca força --headed.
    headless: !!process.env.CI,
    
    // Preserva captura de tela nas falhas, inclusive nas falhas esperadas documentadas.
    screenshot: 'only-on-failure',
    // Mantém o vídeo dos cenários com falha para ajudar a explicar ou investigar o comportamento.
    video: 'retain-on-failure',
    // O trace registra ações e rede para inspeção posterior, sem acrescentar pausas fixas ao teste.
    trace: 'retain-on-failure',
  },

  // A banca usa apenas Chromium; Desktop Chrome fornece o perfil e viewport fixa o tamanho da janela.
  projects: [
    {
      name: 'chromium',
      // Opções compartilhadas de execução; dentro do projeto, use também aplica o perfil específico do navegador.
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },
  ],
});

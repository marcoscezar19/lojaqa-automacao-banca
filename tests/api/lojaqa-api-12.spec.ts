import { test, expect } from '@playwright/test';

test.describe('Módulo 12 - API de Suporte / Tickets', () => {
  
  test('POST /api/support/tickets deve gerar número de protocolo', async ({ request }) => {
    const response = await request.post('/api/support/tickets', {
      data: {
        nome: 'Marcos Carneiro',
        email: 'marcos.api@email.com',
        mensagem: 'Erro ao tentar atualizar os dados.'
      }
    });

    console.log(`Status Code obtido: ${response.status()}`);
    expect([200, 201]).toContain(response.status());

    const responseBody = await response.json();
    console.log('Payload de Resposta (JSON):', JSON.stringify(responseBody, null, 2));

    expect(responseBody).toHaveProperty('protocolo');
  });

  test('POST /api/support/tickets com dados inválidos deve retornar 400', async ({ request }) => {
    const response = await request.post('/api/support/tickets', {
      data: { nome: '' }
    });

    console.log(`Status Code de Erro Tratado: ${response.status()}`);
    expect(response.status()).toBe(400);
  });
});
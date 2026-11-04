import { test, expect } from '@playwright/test';

test.describe('Desafio Extra - API REST Externa (ViaCEP)', () => {
  
  test('GET /ws/50030230/json/ deve retornar dados de endereço válidos', async ({ request }) => {
    const response = await request.get('https://viacep.com.br/ws/50030230/json/');

    console.log(`Status Code API Externa: ${response.status()}`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log('Resposta da API ViaCEP:', body);

    expect(body).toHaveProperty('cep');
    expect(body.localidade).toBe('Recife');
  });
});
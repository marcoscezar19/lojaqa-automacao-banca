/* import { test, expect } from '@playwright/test';

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
}); */


import { test, expect } from '@playwright/test';

test.describe('Desafio Extra de Portfólio: API REST Externa', () => {
  const externalApiUrl = 'https://reqres.in/api';

  test('Validar criação de usuário (POST) com asserção de Status 201 e JSON Payload', async ({ request }) => {
    const newUserPayload = {
      name: 'Fabiano Joe',
      job: 'Engenheiro de QA Sênior',
    };

    console.log('⚡ [API Externa] Enviando requisição POST para Reqres:', newUserPayload);

    const response = await request.post(`${externalApiUrl}/users`, {
      data: newUserPayload,
    });

    // Asserção de Status Code
    const status = response.status();
    console.log(`📊 [API Externa] Status Code Retornado: ${status}`);
    expect(status).toBe(201);

    // Asserção do Payload de Retorno
    const responseBody = await response.json();
    console.log('📦 [API Externa] JSON Response Recebido:', JSON.stringify(responseBody, null, 2));

    expect(responseBody.name).toBe(newUserPayload.name);
    expect(responseBody.job).toBe(newUserPayload.job);
    expect(responseBody.id).toBeDefined();
    expect(responseBody.createdAt).toBeDefined();
  });
});
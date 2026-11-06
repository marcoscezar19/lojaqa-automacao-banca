import { test, expect } from '@playwright/test';

const APIUrl = 'https://api-qa-fap2026.onrender.com/api';

test.describe('Módulo 07: Testes de API REST - Checkout e Criação de Pedidos (Padrão AAR)', () => {
  let authToken: string;
  let testProductId: string;
  const uniqueProductName = `Produto Teste Checkout ${Date.now()}`;

  // ARRANGE (SETUP): Autentica o lojista e cria um produto de massa com estoque controlado
  test.beforeAll(async ({ request }) => {
    // 1. Login como Lojista para cadastrar massa de produto
    const loginRes = await request.post(`${APIUrl}/login`, {
      data: {
        email: 'lojista@system.com',
        password: 'SellerPass123',
      },
    });
    expect(loginRes.status()).toBe(200);
    const loginBody = await loginRes.json();
    authToken = loginBody.token;

    // 2. Criação do Produto de Teste
    const productRes = await request.post(`${APIUrl}/seller/products`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: {
        name: uniqueProductName,
        description: 'Produto exclusivo para teste de pedido via API',
        category: 'Periféricos',
        price: 150.0,
        stock: 10,
        image: 'https://via.placeholder.com/150',
      },
    });
    expect(productRes.status()).toBe(201);
    const productBody = await productRes.json();
    testProductId = productBody.product._id;
  });

  test('Cenário Feliz (API): Criar pedido com sucesso (Status 201) e validar baixa atômica de estoque', async ({ request }) => {
    // ARRANGE: Login como Cliente Comum para realizar a compra
    const customerLoginRes = await request.post(`${APIUrl}/login`, {
      data: { email: 'user@system.com', password: 'UserPassword123' },
    });
    expect(customerLoginRes.status()).toBe(200);
    const customerToken = (await customerLoginRes.json()).token;

    // ACT: Envio da requisição POST /orders
    const orderPayload = {
      items: [
        {
          productId: testProductId,
          quantity: 2,
        },
      ],
      shippingAddress: 'Av. Engenheiro Domingos Ferreira, 2000 - Recife/PE',
    };

    console.log('⚡ [API] Enviando payload de pedido:', JSON.stringify(orderPayload, null, 2));

    const orderRes = await request.post(`${APIUrl}/orders`, {
      headers: { Authorization: `Bearer ${customerToken}` },
      data: orderPayload,
    });

    // ASSERT: Validação de Status Code e Schema do Response
    const status = orderRes.status();
    console.log(`📊 [API] Status Code Retornado: ${status}`);
    expect(status).toBe(201);

    const responseBody = await orderRes.json();
    console.log('📦 [API] JSON Response de Pedido Criado:', JSON.stringify(responseBody, null, 2));

    expect(responseBody.message).toBe('Pedido criado com sucesso.');
    expect(responseBody.order).toBeDefined();
    expect(responseBody.order.total).toBe(300.0); // 2 * 150.0
    expect(responseBody.order.status).toBe('pending');
  });

  test('Cenário Triste (API): Falha ao criar pedido com estoque insuficiente (Status 409 Conflict)', async ({ request }) => {
    // ARRANGE: Login como cliente
    const customerLoginRes = await request.post(`${APIUrl}/login`, {
      data: { email: 'user@system.com', password: 'UserPassword123' },
    });
    const customerToken = (await customerLoginRes.json()).token;

    // ACT: Tenta comprar uma quantidade absurda superior ao estoque cadastrado (ex: 999 unidades)
    const invalidOrderPayload = {
      items: [
        {
          productId: testProductId,
          quantity: 999,
        },
      ],
      shippingAddress: 'Rua do Sol, 100 - Recife/PE',
    };

    const errorRes = await request.post(`${APIUrl}/orders`, {
      headers: { Authorization: `Bearer ${customerToken}` },
      data: invalidOrderPayload,
    });

    // ASSERT: Validação do Erro 409
    console.log(`📊 [API Cenário Triste] Status Code Retornado: ${errorRes.status()}`);
    expect(errorRes.status()).toBe(409);

    const errorBody = await errorRes.json();
    console.log('⚠️ [API Cenário Triste] Mensagem de Erro Capturada:', errorBody);
    expect(errorBody.error).toContain('Estoque insuficiente');
  });

  // TEARDOWN (RELEASE): Garante a limpeza lógica/física do produto criado no setup
  test.afterAll(async ({ request }) => {
    if (testProductId && authToken) {
      console.log(`🧹 [Teardown API] Removendo ou desativando produto de massa ID: ${testProductId}`);
      await request.put(`${APIUrl}/seller/products/${testProductId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
        data: { active: false },
      });
    }
  });
});
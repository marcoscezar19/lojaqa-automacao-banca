// A fixture request faz chamadas HTTP reais sem precisar abrir uma página.
import { test, expect } from '@playwright/test';

// Tipagem dos campos usados no teste; as asserções abaixo verificam os dados recebidos em execução.
interface UsuarioCriado {
  name: string;
  job: string;
  id: string;
  createdAt: string;
}

// Caso de API de mercado exigido pela atividade: serviço Reqres, independente da LojaQA.
test('Externo: Reqres cria usuário com status 201 e JSON válido', async ({ request }) => {
  // ARRANGE: monta o corpo JSON com dados de demonstração.
  const payload = { name: 'Equipe LojaQA', job: 'QA' };

  // ACT: envia POST para criação de usuário; data é serializado como JSON pelo Playwright.
  const response = await request.post('https://reqres.in/api/users', { data: payload });
  // Obtém o header para demonstrar e validar o formato declarado pela resposta.
  const contentType = response.headers()['content-type'];
  console.log('[API externa]', { status: response.status(), contentType });

  // ASSERT: 201 indica criação; Content-Type deve declarar JSON antes de o conteúdo ser validado.
  expect(response.status()).toBe(201);
  expect(contentType).toContain('application/json');
  // Lê a resposta JSON e imprime o corpo para acompanhar o resultado no terminal.
  const body: UsuarioCriado = await response.json();
  console.log('[API externa] JSON:', JSON.stringify(body, null, 2));
  // Confere os dados enviados e depois exige um ID textual não vazio e uma data válida.
  expect(body).toMatchObject(payload);
  expect(body.id).toEqual(expect.any(String));
  expect(body.id).not.toBe('');
  expect(Number.isFinite(Date.parse(body.createdAt))).toBe(true);
});

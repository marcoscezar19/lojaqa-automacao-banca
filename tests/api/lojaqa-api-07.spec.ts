// APIRequestContext faz HTTP sem navegador; APIResponse permite consultar status, headers e JSON.
import { test as base, expect, APIRequestContext, APIResponse } from '@playwright/test';
import { clienteLogin } from '../../data/login.data';

// Centraliza a raiz da API; as funções abaixo acrescentam o caminho de cada recurso.
const API_URL = 'https://api-qa-fap2026.onrender.com/api';
// Tipos locais descrevem os dados necessários: identificação/estoque do produto e tokens usados no cenário.
interface Produto { _id: string; stock: number }
interface MassaPedido { produtoId: string; clienteToken: string; lojistaToken: string }

// Autenticação de preparação: devolve um token após verificar status 200 e o tipo do valor recebido.
async function login(request: APIRequestContext, email: string, password: string): Promise<string> {
  const response = await request.post(`${API_URL}/login`, { data: { email, password } });
  expect(response.status(), 'Autenticação via API').toBe(200);
  const body = await response.json();
  expect(body.token).toEqual(expect.any(String));
  return body.token;
}

// Consulta o catálogo real e procura o produto exclusivo do cenário, para medir estoque antes e depois.
async function estoque(request: APIRequestContext, produtoId: string): Promise<number> {
  const response = await request.get(`${API_URL}/products`);
  expect(response.status()).toBe(200);
  const produtos: Produto[] = await response.json();
  const produto = produtos.find(item => item._id === produtoId);
  expect(produto, 'Produto de teste presente no catálogo').toBeDefined();
  // O expect anterior verifica a existência; ! registra essa garantia para o TypeScript.
  return produto!.stock;
}

// Valida o header JSON e mostra status, Content-Type e corpo formatado no console para a explicação da banca.
async function registrarResposta(response: APIResponse) {
  expect(response.headers()['content-type']).toContain('application/json');
  const body = await response.json();
  console.log('[API]', JSON.stringify({ status: response.status(), contentType: response.headers()['content-type'], body }, null, 2));
  return body;
}

// Fixture própria da API: cada cenário recebe um produto novo, evitando que um teste consuma a massa do outro.
const test = base.extend<{ massaPedido: MassaPedido }>({
  // A preparação cria a massa; use executa o teste; finally garante a tentativa de limpeza depois dele.
  massaPedido: async ({ request }, use, testInfo) => {
    // O lojista pode cadastrar/desativar produtos; o cliente possui o papel necessário para comprar.
    const lojistaToken = await login(request, 'lojista@system.com', 'SellerPass123');
    const clienteToken = await login(request, clienteLogin.email, clienteLogin.senha);
    // Cria um produto real com dez unidades e preço 150; nome inclui ID do teste e horário para evitar colisões.
    const response = await request.post(`${API_URL}/seller/products`, {
      headers: { Authorization: `Bearer ${lojistaToken}` },
      data: {
        name: `QA Checkout ${testInfo.testId} ${Date.now()}`,
        description: 'Produto isolado para validação de estoque',
        category: 'Periféricos', price: 150, stock: 10,
        image: 'https://example.com/produto-qa.png',
      },
    });
    expect(response.status(), 'Criação da massa de produto').toBe(201);
    const { product } = await response.json();
    expect(product._id).toEqual(expect.any(String));
    try {
      // Disponibiliza ID e tokens ao teste e aguarda sua conclusão antes do teardown.
      await use({ produtoId: product._id, clienteToken, lojistaToken });
    // TEARDOWN: desativa o produto mesmo se uma asserção falhar. Os pedidos reais continuam no histórico.
    } finally {
      const cleanup = await request.put(`${API_URL}/seller/products/${product._id}`, {
        headers: { Authorization: `Bearer ${lojistaToken}` }, data: { active: false },
      });
      expect(cleanup.status(), 'Desativação do produto de teste').toBe(200);
    }
  },
});

// Envia um POST autenticado com produto, quantidade e endereço; não altera o resultado recebido do servidor.
function criarPedido(request: APIRequestContext, massa: MassaPedido, quantidade: number) {
  return request.post(`${API_URL}/orders`, {
    // Bearer apresenta o token do cliente no cabeçalho, como exige o recurso protegido.
    headers: { Authorization: `Bearer ${massa.clienteToken}` },
    data: {
      items: [{ productId: massa.produtoId, quantity: quantidade }],
      shippingAddress: 'Rua do Sol, 100 - Recife/PE',
    },
  });
}

// Agrupa os três cenários de API: compra válida, estoque insuficiente e concorrência.
test.describe('Módulo 07: Pedidos e estoque via API', () => {
  // Cenário positivo: preparar estoque, comprar duas unidades e verificar resposta e quantidade restante.
  test('Criar pedido com status 201, JSON válido e baixa de estoque', async ({ request, massaPedido }) => {
    // ARRANGE: registra a quantidade real antes da ação, em vez de presumir que o catálogo não mudou.
    const antes = await estoque(request, massaPedido.produtoId);
    // ACT: faz a compra com a quantidade definida pelo cenário.
    const response = await criarPedido(request, massaPedido, 2);
    // ASSERT: exige criação do recurso e, nas linhas seguintes, estrutura e valores do pedido.
    expect(response.status()).toBe(201);
    const body = await registrarResposta(response);
    expect(body.message).toBe('Pedido criado com sucesso.');
    expect(body.order).toMatchObject({ _id: expect.any(String), total: 300, status: 'pending' });
    // Compara o item retornado com o produto exclusivo, a quantidade dois e o preço unitário 150.
    expect(body.order.items).toEqual([
      expect.objectContaining({ productId: massaPedido.produtoId, quantity: 2, unitPrice: 150 }),
    ]);
    // Uma data só passa se Date.parse conseguir convertê-la em um instante válido.
    expect(Number.isFinite(Date.parse(body.order.createdAt)), 'Data de criação válida').toBe(true);
    // Consulta novamente o servidor. A comparação final prova a baixa simples, mas sozinha não prova atomicidade.
    const depois = await estoque(request, massaPedido.produtoId);
    console.log('[Estoque]', { antes, quantidadeComprada: 2, depois });
    expect(depois).toBe(antes - 2);
  });

  // Cenário negativo: pede uma unidade acima do disponível; exige 409 e nenhuma mudança no estoque.
  test('Estoque insuficiente retorna 409 e preserva a quantidade disponível', async ({ request, massaPedido }) => {
    // ARRANGE: registra a quantidade real antes da ação, em vez de presumir que o catálogo não mudou.
    const antes = await estoque(request, massaPedido.produtoId);
    // ACT: faz a compra com a quantidade definida pelo cenário.
    const response = await criarPedido(request, massaPedido, antes + 1);
    expect(response.status()).toBe(409);
    const body = await registrarResposta(response);
    expect(body.error).toContain('Estoque insuficiente');
    expect(await estoque(request, massaPedido.produtoId)).toBe(antes);
  });

  // Disputa controlada: duas compras de seis unidades usam o mesmo produto com estoque dez.
  test('Pedidos concorrentes não vendem além do estoque', async ({ request, massaPedido }) => {
    expect(await estoque(request, massaPedido.produtoId)).toBe(10);
    // Promise.all dispara os dois pedidos sem esperar o primeiro terminar; é a concorrência dentro deste teste.
    const respostas = await Promise.all([
      criarPedido(request, massaPedido, 6), criarPedido(request, massaPedido, 6),
    ]);
    for (const response of respostas) await registrarResposta(response);
    // Consulta novamente o servidor. A comparação final prova a baixa simples, mas sozinha não prova atomicidade.
    const depois = await estoque(request, massaPedido.produtoId);
    console.log('[Concorrência]', { estoqueInicial: 10, quantidades: [6, 6], estoqueFinal: depois });
    // Antes de aceitar a falha conhecida, descarta erros internos: as duas respostas devem ser 201 ou 409.
    for (const response of respostas) expect([201, 409], 'Respostas de negócio, sem erro interno do servidor').toContain(response.status());
    console.log('[DEFEITO CONHECIDO] A API permite estoque negativo em pedidos simultâneos.');
    // Documenta o bug reproduzido: os dois pedidos são aceitos e o estoque fica -2. A falha esperada não comprova a regra funcionando.
    test.fail(true, 'Defeito observado na API: dois pedidos de 6 unidades são aceitos para estoque 10.');
    // soft registra a divergência e continua até conferir o estoque. O correto seria uma compra 201 e outra rejeitada com 409.
    expect.soft(respostas.map(response => response.status()).sort()).toEqual([201, 409]);
    // Somente seis unidades deveriam sair: dez menos seis resulta em quatro.
    expect.soft(depois).toBe(4);
  });
});

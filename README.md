# LojaQA — módulo 07: pagamentos e criação de pedido

Programa FAP 2026, turma 4. Professor: Alison Melo.
Equipe: Fabiano Paiva, Marcos Cézar e Paulo Henrique.
Data da apresentação: **10/11/2026**.

Desenvolvemos uma suíte de testes automatizados com Playwright e TypeScript
para o módulo **07 — Checkout: Pagamentos e Criação de Pedido** da LojaQA.
Validamos pagamentos via PIX e cartão, criação de pedidos e controle de
estoque. Também incluímos testes externos no SauceDemo e na API Reqres.
O login faz parte da preparação da sessão pela fixture.

## Instalação

Use Node.js LTS e, no PowerShell:

```powershell
npm.cmd ci
npx.cmd playwright install chromium
npm.cmd run typecheck
```

O `package-lock.json` faz parte da entrega para permitir `npm ci`.

## Execução da banca

```powershell
# 1. Módulo 07 em navegador visível
npm.cmd run test:e2e

# 2. API da LojaQA: status, Content-Type e JSON no console
npm.cmd run test:api

# 3. Um E2E externo e um teste de API externa
npm.cmd run test:externos

# Os dez cenários em uma execução com navegador visível
npm.cmd run test:banca

# Relatório HTML
npm.cmd run report
```

`npm.cmd test` executa a mesma seleção completa. A execução usa um worker,
pois as compras compartilham o cliente de demonstração e conferem o primeiro
pedido da lista. Isso não impede outro usuário do ambiente público de comprar
com a mesma conta.

Utilizamos os limites padrão do Playwright e sincronizamos os testes por
elementos, respostas HTTP e asserções, sem pausas fixas. Localmente o
navegador fica visível; no CI, executa sem interface gráfica. Os scripts
de apresentação usam `--headed`.

## Matriz de testes

A suíte contém **10 cenários**: cinco de interface da LojaQA, três de API
da LojaQA e dois externos. Em `tests/e2e/lojaqa-modulo-07.spec.ts`, quatro
testes são registrados a partir das massas de checkout, e o teste de
carrinho vazio é declarado separadamente.

| ID | Tipo | Cenário | Resultado esperado |
| --- | --- | --- | --- |
| E2E-01 | UI | PIX | Desconto de 5% e total corretos; pedido criado e detalhes abertos |
| E2E-02 | UI | Cartão Mastercard | Bandeira detectada; pedido criado e detalhes abertos |
| E2E-03 | UI | Validade incompleta | Erro de preenchimento; permanece no checkout |
| E2E-04 | UI | Cartão vencido | Rejeição — defeito conhecido na aplicação |
| E2E-05 | UI | Carrinho vazio | Alerta e retorno à loja |
| API-01 | API | Compra de duas unidades | Status 201, JSON válido e estoque de 10 para 8 |
| API-02 | API | Quantidade maior que o estoque | Status 409 e estoque preservado |
| API-03 | API | Dois pedidos simultâneos de seis unidades, estoque dez | Um 201, outro 409 e estoque quatro — defeito conhecido na API |
| EXT-01 | UI externa | SauceDemo | Login e um item no carrinho |
| EXT-02 | API externa | Reqres | Status 201, Content-Type JSON e usuário retornado |

Identificamos dois cenários com defeitos reproduzidos: cartão vencido e
pedidos concorrentes. Utilizamos `test.fail` para registrar essas falhas
conhecidas. Embora o Playwright as inclua no total aceito, elas representam
regras de negócio que ainda precisam de correção. As verificações continuam
exigindo o comportamento correto; caso o cenário passe, o Playwright
sinaliza um sucesso inesperado para revisão da marcação.

## Organização

```text
data/
  checkout.mass.ts         Massas tipadas de endereço e pagamentos
  login.data.ts            Credenciais de demonstração da LojaQA
fixtures/
  auth.fixture.ts          Autenticação via API e preparação da sessão
pages/
  CheckoutPage.ts          Seletores e ações do checkout
  SauceDemoPage.ts         Seletores e ações do SauceDemo
tests/
  e2e/
    lojaqa-modulo-07.spec.ts  Cinco cenários de checkout
    externo-e2e.spec.ts      Login e carrinho no SauceDemo
  api/
    lojaqa-api-07.spec.ts    Três cenários de pedidos e estoque
    externo-api.spec.ts      Criação de usuário no Reqres
playwright.config.ts      Navegador, execução e relatórios
tsconfig.json             Configuração de tipos do TypeScript
package.json              Dependências e scripts
package-lock.json         Versões das dependências para npm ci
```

Os cenários de pagamento utilizam as massas tipadas de
`data/checkout.mass.ts`, com dados de PIX, cartão válido, validade incompleta
e cartão vencido. A fixture autentica o cliente pela API e prepara o
`localStorage` do navegador antes de entregar a página ao teste.
Cada cenário de API cria um produto exclusivo e o desativa no teardown,
mesmo se uma asserção falhar. Os pedidos reais continuam no histórico do
ambiente de demonstração. Page Objects contêm ações e seletores; as
asserções ficam nos testes e na preparação das fixtures.

## Ambientes e limitações

- UI: `https://alisonmelo.github.io/tioalison-pe-t4-fap26/projetos-base/01-sistema-login/loja.html`.
- API: `https://api-qa-fap2026.onrender.com/api`.
- SauceDemo: `https://www.saucedemo.com/`.
- Reqres: `https://reqres.in/api/users`. O serviço público pode aplicar limites.

O formulário é preenchido com endereço de teste. A consulta ViaCEP é
bloqueada somente nesses cenários; validação de CEP pertence ao módulo 05.
Nenhuma resposta de criação de pedido é simulada ou modificada. A resposta
real é lida antes do redirecionamento para obter o ID do pedido. Como a
aplicação redireciona com `orderId=undefined`, o teste abre o primeiro pedido
da lista e compara seu ID com a API antes de validar o modal.

O desconto PIX é validado no resumo da UI, não no total persistido da API.
O teste de baixa simples verifica a redução de 10 para 8 unidades. O de
concorrência exige um pedido aceito (201), outro rejeitado (409) e estoque
final quatro, com marcação de falha conhecida para o defeito de estoque
negativo. O código da aplicação e do servidor não faz parte deste repositório.

## Relatórios e evidências

O Playwright apresenta os resultados no terminal e gera o relatório HTML
em `playwright-report/`. Para abri-lo após uma execução:

```powershell
npm.cmd run report
```

Os testes anexam capturas do resumo PIX e dos detalhes dos pedidos criados.
A configuração também preserva screenshots, vídeos e traces nas falhas.
Os artefatos de execução ficam em `test-results/`.

Executamos os testes com Chromium, viewport de 1280 × 720 e um worker.
Quando `CI` está definido, a configuração utiliza navegador sem interface,
até duas novas tentativas por teste com falha e bloqueia `test.only`.
Os scripts com `--headed` forçam o navegador visível.

## Repositório e Apresentação

- [Repositório da equipe](https://github.com/marcoscezar19/lojaqa-automacao-banca).
- [Apresentação da equipe](https://github.com/marcoscezar19/lojaqa-automacao-banca/blob/main/presentation/Apresenta%C3%A7%C3%A3o.pptx).

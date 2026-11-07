# 🚀 Automação E2E & API REST - Suíte de Testes da LojaQA & Sistemas de Mercado

> **Programa FAP 2026 - Turma 4 | Formação em Avaliação e Teste de Software**  
> **Disciplina:** Automação de Testes com Playwright  
> **Orientador:** Prof. Alison Melo 
> **Alunos:** Fabiano Paiva, Marcos Cezar e Paulo Henrique. 
> **Módulo Avaliado:** Módulo 07 — *Checkout: Pagamentos & Criação de Pedido*  
> **Data de Apresentação:** 10/11/2026  

---

## 📌 1. Visão Geral do Projeto

Este repositório contém a suíte completa de automação de testes End-to-End (UI) e de API REST desenvolvida para a avaliação prática final da disciplina. O projeto simula o trabalho de engenharia de QA corporativa, aplicando boas práticas de arquitetura de software, padrão **Page Object Model (POM)**, **Data-Driven Testing (DDT)**, **Fixtures customizadas**, padrão **AAR (Arrange-Act-Assert)** e rotinas de **Teardown (limpeza de ambiente)**.

Além dos testes direcionados ao **Módulo 07** da aplicação de e-commerce **LojaQA**, a suíte contempla os testes da **Seção 03 (Desafio Extra de Portfólio em Sistemas de Mercado)**, exercitando sistemas públicos de produção (UI e API).

---

## 🛠️ 2. Tecnologias & Ferramentas Utilizadas

| Categoria | Ferramenta / Linguagem | Finalidade |
| :--- | :--- | :--- |
| **Linguagem Principal** | **TypeScript** (`v5.x`) | Tipagem estática, garantindo manutenibilidade e segurança no código |
| **Framework de Testes** | **Playwright Test** (`v1.x`) | Execução de testes E2E (UI) e requisições HTTP (`{ request }`) |
| **Arquitetura Visual** | **Page Object Model (POM)** | Encapsulamento de seletores e ações de tela (sem asserções no POM) |
| **Relatórios** | **Playwright HTML Reporter** | Geração de relatórios executivos de testes e rastreabilidade |
| **Gerenciador de Pacotes**| **npm / Node.js** (`v18+`) | Gerenciamento de dependências e scripts de execução |
| **Controle de Versão** | **Git & GitHub** | Versionamento de código e hospedagem do repositório |

---

## 📐 3. Arquitetura do Repositório

A estrutura de pastas foi idealizada para garantir separação clara de responsabilidades, alta reutilização de código e aderência estrita à rubrica de avaliação.

```text
lojaqa-automacao-banca/
├── data/
│   └── checkout.mass.ts             # Massa de dados tipada (Cenários Felizes e Tristes)
├── pages/
│   ├── CheckoutPage.ts              # Page Object do Módulo 07 (SEM expect interno)
│   └── SauceDemoPage.ts             # Page Object do Desafio Extra E2E (SauceDemo)
├── fixtures/
│   └── auth.fixture.ts              # Fixture customizada para login/sessão autenticada via API
├── tests/
│   ├── e2e/
│   │   ├── lojaqa-modulo-07.spec.ts # Testes E2E (UI) do Módulo 07 na LojaQA
│   │   └── externo-e2e.spec.ts      # Desafio Extra 1: CT E2E em site externo (SauceDemo)
│   └── api/
│       ├── lojaqa-api-07.spec.ts    # Testes de API REST ({ request }) da LojaQA com Teardown
│       └── externo-api.spec.ts      # Desafio Extra 2: CT de API REST pública (Reqres.in)
├── presentation/
│   └── apresentacao-slides.pdf      # Slides oficiais apresentados na banca (.pdf)
├── playwright.config.ts             # Configuração global do Playwright
├── package.json                     # Scripts e dependências do projeto
└── README.md                        # Documentação técnica do projeto
```

---

## 🗺️ 4. Módulo Avaliado & Especificação de Rotas

### 🛍️ Módulo 07 — LojaQA: Checkout, Pagamentos & Pedidos
* **Aplicação Web (UI):** [LojaQA Plataforma](https://alisonmelo.github.io/tioalison-pe-t4-fap26/projetos-base/01-sistema-login/login.html)
* **Base URL da API:** `https://api-qa-fap2026.onrender.com/api`

#### Rotas Consumidas na API:
| Método | Endpoint | Descrição / Objetivo | Retorno Esperado |
| :---: | :--- | :--- | :---: |
| `POST` | `/login` | Autenticação de credenciais de usuário | `200 OK` (Token JWT) |
| `POST` | `/seller/products` | Setup de produto para a massa de testes | `201 Created` |
| `POST` | `/orders` | Criação de pedido de compra e baixa atômica de estoque | `201 Created` |
| `PUT` | `/seller/products/:id` | Soft Delete / Limpeza de massa no **Teardown** | `200 OK` |

---

## 📊 5. Matriz de Cenários de Testes (E2E & API)

| ID | Tipo | Cenário / Descrição | Tipo de Fluxo | Resultado Esperado |
| :---: | :---: | :--- | :---: | :--- |
| **CT-E2E-01** | UI | Finalizar compra com forma de pagamento **PIX** (5% OFF) | Positivo | Modal de confirmação exibido com sucesso |
| **CT-E2E-02** | UI | Finalizar compra com **Cartão de Crédito** preenchido | Positivo | Exibição da tela de pedido confirmado |
| **CT-E2E-03** | UI | Tentar checkout com data de validade de cartão vencida | Triste/Negativo | Exibição de mensagem de erro de validação |
| **CT-E2E-04** | UI | Submeter formulário de checkout sem itens no carrinho | Triste/Negativo | Bloqueio de submissão e alerta na interface |
| **CT-API-01** | API | Emitir pedido via `POST /orders` com payload válido | Positivo | Status `201 Created` e confirmação do JSON |
| **CT-API-02** | API | Solicitar item com quantidade superior ao estoque | Triste/Negativo | Status `409 Conflict` (Estoque insuficiente) |
| **CT-EXT-01** | UI | Automação de Login e adição ao carrinho no *SauceDemo* | Desafio Extra | Badge do carrinho atualizado para 1 item |
| **CT-EXT-02** | API | Envio de `POST /api/users` na API pública *Reqres.in* | Desafio Extra | Status `201 Created` com validação do Schema |

---

## 🚀 6. Instalação e Configuração do Ambiente

### Pré-requisitos
* **Node.js** v18.0.0 ou superior instalada.
* **Git** instalado na máquina local.

### Passos para Clonar e Instalar:

```bash
# 1. Clonar este repositório
git clone https://github.com/marcoscezar19/lojaqa-automacao-banca.git

# 2. Acessar a pasta do projeto
cd lojaqa-automacao-banca

# 3. Instalar as dependências do Node.js
npm install

# 4. Instalar os navegadores executáveis do Playwright
npx playwright install
```

---

## 💻 7. Comandos de Execução (Banca ao Vivo)

Conforme a **Regra de Ouro** e o Roteiro da Banca, utilize os comandos abaixo durante a apresentação:

### 📺 7.1. Execução E2E em Tela Aberta (`--headed`)
Executa os testes de interface gráfica abrindo o navegador visivelmente:

```bash
# Executar suíte E2E do Módulo 07 da LojaQA em modo --headed
npx playwright test tests/e2e/lojaqa-modulo-07.spec.ts --headed

# Executar Desafio Extra E2E em site externo (SauceDemo)
npx playwright test tests/e2e/externo-e2e.spec.ts --headed
```

### 💻 7.2. Execução de API REST no Terminal (com Logs no Console)
Executa as requisições de API direto no terminal com asserções detalhadas no console:

```bash
# Executar suíte de API do Módulo 07 da LojaQA
npx playwright test tests/api/lojaqa-api-07.spec.ts

# Executar Desafio Extra de API Externa (Reqres.in)
npx playwright test tests/api/externo-api.spec.ts
```

### 📊 7.3. Execução Geral e Relatório HTML
```bash
# Rodar todos os testes do repositório
npx playwright test

# Visualizar o relatório gerado após a execução
npx playwright show-report
```

---

## 👥 8. Equipe de Desenvolvimento

* **Integrantes da Dupla/Trio:**
  * Aluno 1 — *Desenvolvimento E2E & Page Objects*
  * Aluno 2 — *Desenvolvimento API, Fixtures & README*
* **Curso:** Formação em Avaliação e Teste de Software — Turma FAP 2026
* **Professor Responsável:** Alison Melo
# 🛒 LojaQA — Automação de Testes E2E (Playwright & TypeScript)

Framework de automação de testes End-to-End (E2E) desenvolvido para o sistema de login da **LojaQA**, aplicando rigorosamente padrões avançados de engenharia de qualidade como **Page Object Model (POM)**, **Fixtures Customizadas** e **Testes Data-Driven**.

---

## 🚀 Tecnologias e Ferramentas Utilizadas

- **[Playwright Test](https://playwright.dev/)** — Motor de execução e automação E2E de alta performance.
- **TypeScript** — Linguagem de programação fortemente tipada.
- **Node.js (ESM / NodeNext)** — Runtime JavaScript moderno com suporte a módulos ECMAScript e tipagem estrita (`verbatimModuleSyntax`).
- **Git** — Controle de versão.

---

## 📂 Arquitetura e Estrutura do Projeto

O projeto foi estruturado seguindo o princípio da responsabilidade única e desacoplamento de seletores:

```text
meu-projeto-playwright/
├── pages/
│   └── LoginPage.ts          # Classe Page Object encapsulando elementos e ações (Zero expects)
├── fixtures/
│   └── auth.fixture.ts       # Fixture customizada estendida com base.extend
├── tests/
│   ├── login-pom.spec.ts     # Testes E2E consumindo o Page Object (Caminhos feliz, triste e regras)
│   ├── login-data-driven.spec.ts # Testes dinâmicos em loop for...of com múltiplos cenários
│   └── auth-fixture.spec.ts  # Testes demonstrando o uso da Fixture customizada
├── playwright.config.ts      # Configurações globais do Playwright
├── tsconfig.json             # Configurações estritas do TypeScript (NodeNext)
└── package.json              # Gerenciador de dependências e metadados
```

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
- **Node.js** (Versão 18.x ou superior recomendada)
- **npm** (Gerenciador de pacotes do Node)

---

## ⚙️ Instalação e Configuração

Siga o passo a passo abaixo para configurar o ambiente do projeto do zero:

1. **Acesse a pasta do projeto no terminal:**
   ```bash
   cd meu-projeto-playwright
   ```

2. **Instale as dependências do projeto:**
   ```bash
   npm install
   ```

3. **Instale os navegadores suportados pelo Playwright:**
   ```bash
   npx playwright install
   ```

---

## 🔬 Padrões de Projeto Implementados

### 1. Page Object Model (POM) (`pages/LoginPage.ts`)
- Encapsula todo o mapeamento de elementos (`#email`, `#password`, `#loginBtn`, `#errorMessage`, `#statusMessage`).
- Isola a lógica de interação (`goto()`, `login()`).
- **Regra de Ouro:** Nenhuma asserção (`expect`) está presente nas classes de Page Object, mantendo-as estritamente focadas em ações e mapeamento.

### 2. Fixtures Customizadas (`fixtures/auth.fixture.ts`)
- Utiliza o método `base.extend` do Playwright para injetar instâncias pré-configuradas de páginas e contextos autenticados de forma limpa e reutilizável.

### 3. Abordagem Data-Driven (`tests/login-data-driven.spec.ts`)
- Utiliza um array estruturado contendo diversos perfis e cenários (Cliente válido, Administrador, Lojista, Senha incorreta, E-mail não cadastrado e Campos em branco).
- Utiliza um loop `for...of` dinâmico para gerar os testes de forma enxuta e evitar duplicação de código.

---

## 🚀 Comandos para Executar os Testes

O framework oferece suporte a múltiplos modos de execução via terminal:

- **Executar todos os testes (Headless padrão):**
  ```bash
  npx playwright test
  ```

- **Executar com interface visual interativa (Playwright UI Mode):**
  *(Excelente para depuração visual em tempo real)*
  ```bash
  npx playwright test --ui
  ```

- **Executar com o navegador visível (Headed Mode):**
  ```bash
  npx playwright test --headed
  ```

- **Executar um arquivo de teste específico:**
  - Apenas testes POM:
    ```bash
    npx playwright test login-pom.spec.ts
    ```
  - Apenas testes Data-Driven:
    ```bash
    npx playwright test login-data-driven.spec.ts
    ```
  - Apenas testes de Fixtures:
    ```bash
    npx playwright test auth-fixture.spec.ts
    ```

---

## 📊 Relatórios de Testes

Após a execução da suíte, o Playwright gera automaticamente um relatório em HTML detalhando os resultados, capturas de tela em caso de falha (`screenshots`) e rastros de execução (`traces`).

Para visualizar o relatório no navegador, execute:
```bash
npx playwright show-report
```

---

## 🛡️ Boas Práticas Adotadas

- **Tipagem Estrita:** Configurado com TypeScript sob diretrizes de Módulos ECMAScript (`nodenext` / `verbatimModuleSyntax`).
- **Resiliência:** Tratamento inteligente de estados de botões (`isEnabled`) e diálogos nativos (`window.alert`).
- **Manutenibilidade:** Separação clara de responsabilidades entre seletores, massa de dados e asserções.

---
*Projeto desenvolvido por **Fabiano** para fins de avaliação prática em Engenharia de Software e QA.*
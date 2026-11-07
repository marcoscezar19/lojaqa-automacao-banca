# Conferência com a atividade avaliativa

Leitura integral das cinco páginas do PDF fornecido pela equipe. Módulo
confirmado pelo usuário: **07 — Checkout: Pagamentos & Criação de Pedido**.

## Requisitos e situação

| Parte do enunciado | Situação no projeto |
| --- | --- |
| Seção 01: login não deve ser o foco da LojaQA | Atendido: login é apenas setup de sessão |
| Seção 02: PIX 5% OFF | Validado numericamente no resumo da UI |
| Seção 02: cartão, bandeira e validade | Mastercard e validade incompleta validados; vencimento é defeito conhecido |
| Seção 02: modal do pedido | Aberto pela lista e ID comparado com a resposta real, devido ao redirecionamento incorreto |
| Seção 02: POST /api/orders, status 201 e baixa de estoque | Status e baixa simples validados; concorrência revela estoque negativo |
| Seção 03: um E2E de mercado | SauceDemo: login e carrinho |
| Seção 03: uma API de mercado | Reqres: status, Content-Type e JSON |
| Seção 04: apresentação de 10 a 12 minutos | Roteiro preparado; ensaio da equipe pendente |
| Seção 04 e rubrica: 5 a 7 slides | Roteiro de seis slides; PDF/link final ainda não feito |
| Seção 05: POM, fixture, E2E e API em pastas próprias | Atendido; POM sem expect |
| Seção 05: README com comandos e prints | Documentado com comandos separados e evidências da execução |
| Rubrica: E2E com --headed | Scripts de banca forçam navegador visível |
| Rubrica: API com fixture request, status, headers e JSON no console | Atendido nos testes de API |
| Rubrica: seletores semânticos, TypeScript e sem waitForTimeout | Seletores por papel/placeholder quando disponíveis; IDs específicos para elementos sem nome; verificação tsc adicionada; sem pausas fixas |
| Entrega: GitHub + slides no Moodle | Remoto GitHub identificado; publicar alterações, montar slides e enviar no Moodle continuam pendentes |

## Ajustes realizados nesta revisão

- Retirados os quatro limites globais personalizados do Playwright:
  teste, expect, ações e navegação. Isso não desativa os limites padrão.
- Removido um identificador `x` solto no teste E2E que impediria sua execução.
- Exemplos de suporte/FAQ movidos para `examples/modulo-12/`. O módulo 12
  do enunciado é Admin/RBAC; os exemplos não implementam esse requisito.
- Retirados blocos de código antigo comentado nos testes externos.
- Corrigido o README: sem slides inexistentes ou alegação de atomicidade
  comprovada; matriz completa e credenciais somente como preparação.
- Configurados logs no terminal e relatório HTML sem abertura automática.
- Um worker também na execução padrão, para não disputar a conta de compra
  entre os próprios testes; navegador sem interface apenas no CI.
- Adicionados compilador, tsconfig, comando typecheck e verificação no CI.
- Simplificado o .gitignore, mantendo o lockfile de dependências na entrega.

## Limites de conformidade

Há duas falhas de negócio esperadas (`test.fail`): validade vencida e
concorrência no estoque. Uma suíte com execução aceita não comprova que
essas regras funcionam. O redirecionamento incorreto também permanece na
aplicação, com alternativa de navegação explicitada no teste.

Não é possível declarar conformidade integral, prometer nota ou considerar
a apresentação pronta sem os slides finais, o ensaio e a avaliação ao vivo.
Os detalhes técnicos dos defeitos estão em `modulo-07-validacao.md`.

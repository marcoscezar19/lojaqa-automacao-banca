# Roteiro de seis slides — ainda não é a apresentação final

Equipe: Fabiano Paiva, Marcos Cezar e Paulo Henrique.
Módulo 07 — Checkout: Pagamentos & Criação de Pedido.
Professor Alison Melo — FAP 2026, turma 4 — 10/11/2026.

Planejamento de 10 a 12 minutos, seguido de 3 minutos para a banca.
A equipe deve combinar os responsáveis e garantir que os três falem.

## Slide 1 — Capa e equipe (30 s)

Nome do trabalho, módulo 07 e os três integrantes.

## Slide 2 — Contexto do negócio (1 min)

PIX com desconto e cartão são opções de pagamento. Pedido criado precisa
corresponder aos itens comprados e reduzir o estoque. Erros nesse fluxo
podem cobrar valores errados ou vender mais unidades do que existem.
Login é preparação; não é o módulo apresentado.

## Slide 3 — Matriz de testes (1 min)

Usar a matriz do README, destacando PIX, cartão, validação negativa,
criação por API e os dois externos. Distinguir testes aprovados de defeitos
conhecidos com falha esperada.

## Slide 4 — Arquitetura (1 min)

Mostrar data, fixtures, pages, tests/e2e e tests/api. Explicar POM sem expect,
massas tipadas, sessão por API, produtos isolados e teardown. Mostrar
sincronização por condições e a ausência de waitForTimeout.

## Demonstração ao vivo entre slides 4 e 5 (5 a 6 min)

1. `npm.cmd run test:e2e`: mostrar formulário, PIX e cartão, pedido na lista
   e modal. Explicar o redirecionamento defeituoso e a conferência do ID.
2. `npm.cmd run test:api`: explicar status 201, Content-Type, JSON e estoque
   de dez para oito. Mostrar 409 em estoque insuficiente.
3. `npm.cmd run test:externos`: SauceDemo e Reqres.

O teste de concorrência dispara dois pedidos reais pelo mesmo estoque e
registra um defeito conhecido. Não apresentar sua falha esperada como
prova de atomicidade. O tempo real depende dos serviços públicos; ensaiar
antes da banca e manter o relatório da última execução disponível.

## Slide 5 — Resultados e defeitos encontrados (1 min)

Mostrar os prints de docs/evidencias e o resumo da execução mais recente.
Explicar: orderId undefined; vencimento não validado; estoque negativo sob
concorrência. As duas falhas esperadas continuam sendo bugs da aplicação.
O desconto no resumo da UI não comprova o mesmo total persistido na API.

## Slide 6 — Conclusão e repositório (30 s)

Boas práticas: POM, fixtures, tipos, sem pausas fixas, evidências e limpeza
da massa. Próximos passos dependem de correções da aplicação/servidor.

Repositório: https://github.com/marcoscezar19/lojaqa-automacao-banca

## Finalização pendente

Montar estes conteúdos em 5 a 7 slides visuais; exportar PDF ou obter o link
da apresentação; inserir o arquivo/link nesta pasta e no README. Publicar o
código revisado e enviar o repositório e os slides no Moodle.

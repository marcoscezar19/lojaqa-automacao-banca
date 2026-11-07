# Validação do módulo 07

Execute a seleção da banca no PowerShell com `npm.cmd run test:banca`.
O comando inclui o módulo 07 (UI e API) e os dois testes externos, com
Chromium visível e um worker para evitar que as compras da própria suíte
disputem a primeira posição na lista de pedidos.

## Cobertura

- UI: desconto PIX de 5% sobre os produtos e total com frete; bandeira
  Mastercard detectada; validade incompleta; carrinho vazio; criação do
  pedido e abertura de seus detalhes pela lista, comparando o ID com a API.
- API: status 201 e 409; Content-Type JSON; estrutura e valores do pedido;
  baixa de estoque; preservação do estoque em pedido recusado; disputa de
  dois pedidos pelo mesmo estoque. Cada teste cria seu próprio produto e o
  desativa ao terminar. Status, Content-Type, JSON e estoque são registrados
  no console. A baixa simples não comprova sozinha a atomicidade.
- Externos: SauceDemo (login e carrinho) e Reqres (criação de usuário).

## Defeitos observados na aplicação hospedada

1. O checkout utiliza `orderData._id`, mas a API retorna o pedido em
   `orderData.order`. O redirecionamento fica com `orderId=undefined` e os
   metadados de pagamento são associados à chave errada. O teste abre o
   primeiro pedido real e compara seu ID com o da resposta original, sem
   alterar a resposta da aplicação. O meio de pagamento é conferido no
   envio do pedido; o rótulo de pagamento do modal não comprova esse dado.
2. A validade de cartão é validada apenas pelo tamanho. O cenário de cartão
   vencido usa `test.fail` como falha conhecida, sem criar um pedido real.
3. A API aceitou dois pedidos simultâneos de seis unidades para um produto
   com estoque dez. O teste de concorrência usa `test.fail` e mantém as
   verificações de um status 201, outro 409 e estoque final quatro.

`test.fail` significa que o defeito continua existindo: uma execução aceita
pela suíte não equivale a todas as regras de negócio funcionando. Quando o
defeito for corrigido, um sucesso inesperado fará o cenário sinalizar que
a anotação precisa ser removida. As anotações ficam depois da preparação
do cenário para não aceitar falhas de login ou configuração como defeitos
esperados.

Esses comportamentos exigem correções no código da aplicação e da API,
que não estão neste repositório. No checkout, é necessário usar o objeto
`order` retornado pela API antes de salvar metadados e redirecionar; validar
mês e ano da validade do cartão. No servidor, a reserva do estoque precisa
de uma atualização condicional atômica (estoque suficiente) e tratamento
consistente de concorrência e falhas para todos os itens do pedido.

O desconto PIX é conferido no resumo do checkout. Isso não comprova que o
total persistido no servidor inclui o mesmo desconto e o frete.

## Última execução desta revisão

Em 07/11/2026, `npm.cmd run typecheck` concluiu sem erros e
`npm.cmd run test:banca` executou os dez cenários em navegador visível,
com os limites padrão do Playwright. Duração da suíte: 44,1 segundos.

O terminal apresentou `10 passed`, incluindo dois cenários com falha
esperada. Resultado de negócio: **oito cenários aprovados e dois defeitos
reproduzidos**, sem falhas inesperadas. A concorrência produziu dois status
201 e estoque final -2; a baixa simples passou de 10 para 8.

Os prints em `evidencias/` são dessa execução. No modal do pedido PIX, o
endereço contém o pagamento enviado, mas o rótulo isolado mostra Cartão de
Crédito por causa do problema de metadados descrito acima. A evidência não
representa esse rótulo como correto.

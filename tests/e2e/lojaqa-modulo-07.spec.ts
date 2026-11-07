// Importa o test estendido pela fixture: authenticatedPage já chega com a sessão do cliente preparada.
import { test, expect, LOJA_URL } from '../../fixtures/auth.fixture';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { massasCheckout } from '../../data/checkout.mass';

// Remove símbolo e separadores do texto monetário. Ex.: R$ 289,90 vira 28990; GRÁTIS vira zero.
const valorEmCentavos = (texto: string) => Number(texto.replace(/\D/g, ''));

// Agrupa os cenários do módulo no relatório. Aqui ficam as asserções; o Page Object contém apenas ações e seletores.
test.describe('Módulo 07: Checkout, pagamentos e confirmação de pedido', () => {
  // Cada massa registra um teste separado: PIX, cartão válido, validade incompleta e cartão vencido.
  for (const massa of massasCheckout) {
    // O nome vem da massa. authenticatedPage é renomeada para page; testInfo permite guardar evidências do cenário.
    test(massa.perfilCenario, async ({ authenticatedPage: page }, testInfo) => {
      // ARRANGE: conecta o Page Object à página autenticada para preparar uma compra real pela interface.
      const checkout = new CheckoutPage(page);
      // Bloqueia somente a consulta externa de CEP: endereço é pré-condição, e ViaCEP pertence ao módulo 05.
      await page.route('https://viacep.com.br/**', route => route.abort());
      await checkout.abrirComProduto();
      await expect(page).toHaveURL(/checkout\.html$/);
      // Preenche os campos obrigatórios antes de exercitar a regra de pagamento.
      await checkout.preencherEndereco(massa.endereco);

      // ACT e ASSERT do PIX: seleciona o método e confere o desconto exibido antes de concluir a compra.
      if (massa.pagamento.metodo === 'PIX') {
        await checkout.selecionarPagamentoPix();
        await expect(checkout.desconto).toBeVisible();
        // Lê os valores visíveis em centavos para calcular o resultado esperado independentemente da aplicação.
        const subtotal = valorEmCentavos(await checkout.subtotal.innerText());
        const frete = valorEmCentavos(await checkout.frete.innerText());
        const desconto = valorEmCentavos(await checkout.desconto.innerText());
        // Compara o desconto com 5% dos produtos. Math.round representa o arredondamento para centavos.
        expect(desconto, 'Desconto de 5% sobre os produtos').toBe(Math.round(subtotal * 0.05));
        // O total é arredondado após aplicar a porcentagem sem arredondamento intermediário, como no resumo atual da loja.
        expect(valorEmCentavos(await checkout.total.innerText()), 'Total com frete e desconto PIX').toBe(Math.round(subtotal + frete - subtotal * 0.05));
        // Cria um caminho exclusivo por teste e anexa o resumo PIX ao relatório HTML.
        const evidencia = testInfo.outputPath('checkout-pix.png');
        await page.screenshot({ path: evidencia, fullPage: true });
        await testInfo.attach('Resumo PIX com desconto de 5%', { path: evidencia, contentType: 'image/png' });
      } else {
        // Na opção Cartao, a união de tipos garante a presença de número, titular, validade, CVV e bandeira.
        const pagamento = massa.pagamento;
        await checkout.preencherCartao(pagamento.numeroCartao, pagamento.titular, pagamento.validade, pagamento.cvv);
        // Confere a bandeira calculada pela interface a partir do número, em vez de presumir que o preenchimento funcionou.
        await expect(checkout.bandeiraDetectada).toHaveText(pagamento.bandeira);
      }

      // Divide a verificação final entre compra válida e validação negativa. Cada ramo exige um resultado diferente.
      if (massa.sucessoEsperado) {
        // Guarda o identificador real para não confundir a compra deste cenário com um pedido antigo da conta.
        let idPedido: string | undefined;
        // Captura a resposta antes de a página redirecionar. route.fetch chama a API real e fulfill devolve sua resposta sem modificá-la.
        await page.route('**/api/orders', async route => {
          // Requisições que não criam pedidos seguem normalmente; a observação se limita ao POST.
          if (route.request().method() !== 'POST') return route.continue();
          const response = await route.fetch();
          const corpo = await response.json();
          // Aceita o pedido dentro de order ou diretamente no corpo; a resposta atual da API usa order.
          idPedido = (corpo.order ?? corpo)._id;
          await route.fulfill({ response });
        });
        // Registra a espera ANTES do clique para não perder uma resposta rápida. A Promise será aguardada após finalizar.
        const pedido = page.waitForResponse(response => response.url().endsWith('/api/orders') && response.request().method() === 'POST');
        await checkout.clicarFinalizar();
        const resposta = await pedido;
        // ASSERT: 201 significa recurso criado; também exige um ID e o meio de pagamento enviado no endereço do pedido.
        expect(resposta.status(), 'Criação do pedido').toBe(201);
        expect(idPedido, 'ID do pedido criado pela API').toBeTruthy();
        expect(resposta.request().postDataJSON().shippingAddress).toContain(massa.pagamento.metodo === 'PIX' ? 'PIX' : 'Mastercard');
        // A loja redireciona com orderId=undefined. A compra será validada pela lista, mantendo esse defeito documentado.
        await expect(page).toHaveURL(/painel\.html\?.*#ordersSection$/);
        // Antes de abrir o primeiro pedido, compara seu ID com a API. O ! informa ao compilador que a presença já foi verificada acima.
        await expect(checkout.primeiroPedido.locator('.badge.id')).toHaveText(idPedido!);
        // Abre o modal do pedido identificado; depois confere sua visibilidade, o ID e a existência de itens.
        await checkout.abrirDetalhesDoPrimeiroPedido();
        await expect(checkout.modalSucesso).toBeVisible();
        await expect(page.locator('#modalOrderRawId')).toHaveText(idPedido!);
        await expect(page.locator('#modalOrderItemsList')).not.toBeEmpty();
        // evaluate consulta o armazenamento do navegador e confirma que a aplicação limpou o carrinho após a compra.
        expect(await page.evaluate(() => localStorage.getItem('lojaqa_cart'))).toBeNull();
        // Registra o modal real criado, permitindo mostrar a evidência da compra no relatório.
        const evidencia = testInfo.outputPath('pedido-confirmado.png');
        await checkout.modalSucesso.screenshot({ path: evidencia });
        await testInfo.attach('Detalhes do pedido criado', { path: evidencia, contentType: 'image/png' });
      } else {
        // Nos cenários negativos, impede criar um pedido se a interface deixar passar dados inválidos. Não simula uma resposta de sucesso.
        await page.route('**/api/orders', route => route.request().method() === 'POST' ? route.abort() : route.continue());
        await checkout.clicarFinalizar();
        // Só marca falha esperada quando a massa descreve um defeito conhecido; isso não significa que a regra de negócio foi aprovada.
        test.fail(!!massa.falhaConhecida, massa.falhaConhecida);
        if (massa.falhaConhecida) console.log('[DEFEITO CONHECIDO]', massa.falhaConhecida);
        // Exige o texto da validação e a permanência no checkout. Uma mensagem genérica de rede não substitui o erro esperado.
        await expect(checkout.mensagemErroTela).toContainText(massa.mensagemErroEsperada);
        await expect(page).toHaveURL(/checkout\.html$/);
      }
    });
  }

  // Cenário independente: a fixture inicia sem itens e o acesso direto ao checkout deve ser recusado.
  test('Carrinho vazio bloqueia o acesso ao checkout', async ({ authenticatedPage: page }) => {
    // Começa a esperar o alerta antes de navegar; once aceita apenas o próximo diálogo para liberar a navegação.
    const alerta = page.waitForEvent('dialog');
    page.once('dialog', dialog => dialog.accept());
    await page.goto(`${LOJA_URL}/checkout.html`);
    // Confere o motivo do bloqueio, o retorno à loja e o contador zero.
    expect((await alerta).message()).toContain('Seu carrinho está vazio');
    await expect(page).toHaveURL(`${LOJA_URL}/loja.html`);
    await expect(page.locator('#cartCount')).toHaveText('0');
  });
});

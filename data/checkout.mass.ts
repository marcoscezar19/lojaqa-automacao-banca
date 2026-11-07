// Contrato do endereço: o compilador exige os campos usados pelo Page Object.
export interface EnderecoCheckout {
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
}

// União de tipos: PIX só precisa do método; Cartao exige também todos os dados do cartão.
type Pagamento = { metodo: 'PIX' } | {
  metodo: 'Cartao';
  numeroCartao: string;
  bandeira: string;
  titular: string;
  validade: string;
  cvv: string;
};

// Dados comuns a qualquer compra. perfilCenario se torna o nome do teste no relatório.
interface CenarioCheckout {
  perfilCenario: string;
  pagamento: Pagamento;
  endereco: EnderecoCheckout;
}

// Se sucessoEsperado for false, a mensagem de erro é obrigatória. falhaConhecida documenta um defeito já observado.
export type CheckoutTestData = CenarioCheckout & (
  { sucessoEsperado: true } |
  { sucessoEsperado: false; mensagemErroEsperada: string; falhaConhecida?: string }
);

// Endereço reutilizável de demonstração; não depende da resposta do ViaCEP durante os cenários.
const endereco: EnderecoCheckout = {
  cep: '01310100', rua: 'Av. Paulista', numero: '1000',
  bairro: 'Bela Vista', cidade: 'São Paulo', uf: 'SP',
};
// Dados de cartão para simulação. A validade usa o ano atual mais dois para continuar futura nas próximas execuções.
const cartao = {
  // as const mantém o valor literal Cartao para o TypeScript reconhecer corretamente a opção da união.
  metodo: 'Cartao' as const, numeroCartao: '5555555555554444', bandeira: 'Mastercard',
  titular: 'Cliente Teste QA', validade: `12/${String(new Date().getFullYear() + 2).slice(-2)}`, cvv: '123',
};

// Data-driven testing: cada objeto desta lista gera um cenário independente, com o mesmo fluxo e entradas diferentes.
export const massasCheckout: CheckoutTestData[] = [
  // Cenário positivo: desconto de 5% e criação do pedido via PIX.
  { perfilCenario: 'Compra válida via PIX', pagamento: { metodo: 'PIX' }, endereco, sucessoEsperado: true },
  // Cenário positivo: bandeira Mastercard e criação do pedido com cartão.
  { perfilCenario: 'Compra válida com cartão', pagamento: cartao, endereco, sucessoEsperado: true },
  {
    // Cenário negativo tratado pela aplicação: deve exibir o erro, sem efetivar uma compra.
    perfilCenario: 'Cartão com validade incompleta', pagamento: { ...cartao, validade: '12' },
    endereco, sucessoEsperado: false, mensagemErroEsperada: 'Informe a validade do cartão (MM/AA).',
  },
  {
    // Regressão de defeito conhecido: a aplicação verifica o tamanho da validade, mas ainda aceita uma data vencida.
    perfilCenario: 'Cartão vencido deve ser rejeitado', pagamento: { ...cartao, validade: '01/22' },
    endereco, sucessoEsperado: false, mensagemErroEsperada: 'cartão expirado',
    falhaConhecida: 'A aplicação verifica apenas o tamanho da validade e aceita cartões vencidos.',
  },
];

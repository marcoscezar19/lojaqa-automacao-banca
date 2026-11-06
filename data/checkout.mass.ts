/**
 * @file checkout.mass.ts
 * @description Massa de dados tipada para testes de Checkout e Pagamentos (Módulo 07).
 */

export interface CheckoutTestData {
  perfilCenario: string;
  pagamento: {
    metodo: 'PIX' | 'Cartao';
    bandeira?: string;
    numeroCartao?: string;
    validade?: string;
    cvv?: string;
  };
  endereco: string;
  sucessoEsperado: boolean;
  mensagemErroEsperada?: string;
}

export const massasCheckout: CheckoutTestData[] = [
  {
    perfilCenario: 'Compra Válida com Pagamento via PIX (5% Desconto)',
    pagamento: {
      metodo: 'PIX',
    },
    endereco: 'Av. Paulista, 1000 - São Paulo/SP',
    sucessoEsperado: true,
  },
  {
    perfilCenario: 'Compra Válida com Cartão de Crédito',
    pagamento: {
      metodo: 'Cartao',
      bandeira: 'Mastercard',
      numeroCartao: '1234567812345678',
      validade: '12/28',
      cvv: '123',
    },
    endereco: 'Rua da Aurora, 500 - Recife/PE',
    sucessoEsperado: true,
  },
  {
    perfilCenario: 'Cenário Triste: Cartão com Validade Invencida/Mal Formatada',
    pagamento: {
      metodo: 'Cartao',
      bandeira: 'Visa',
      numeroCartao: '9876543298765432',
      validade: '01/22',
      cvv: '456',
    },
    endereco: 'Av. Boa Viagem, 100 - Recife/PE',
    sucessoEsperado: false,
    mensagemErroEsperada: 'Data de validade inválida ou cartão expirado',
  },
];
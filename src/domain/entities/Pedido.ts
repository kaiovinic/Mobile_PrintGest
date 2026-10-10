import { StatusPedido, TipoPedido } from '../enums/StatusPedido';

export interface PedidoResumo {
  id: number;
  numero: string;
  cliente: string;
  tipo: TipoPedido | string;
  status: StatusPedido | string;
  dataPedido: string;
  dataEntrega: string | null;
  total: number;
  valorPago: number;
  valorEstornado: number;
  saldoDevedor: number;
  criadoPor: string;
  motivoCancelamento: string | null;
}

export interface PedidoItemDetalhe {
  id: number;
  descricao: string;
  tamanho: string | null;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface PedidoPagamentoDetalhe {
  id: number;
  formaPagamento: string;
  valor: number;
  dataPagamento: string;
}

export interface PedidoDetalhe {
  id: number;
  numero: string;
  clienteId: number;
  cliente: string;
  empresa: string | null;
  cpfCnpj: string | null;
  telefone: string | null;
  endereco: string | null;
  cidade: string | null;
  usuarioId: number;
  tipo: TipoPedido | string;
  status: StatusPedido | string;
  dataPedido: string;
  dataEntrega: string | null;
  vendedor: string | null;
  formaPagamento: string | null;
  condicaoPagamento: string | null;
  frente: string | null;
  fundo: string | null;
  observacao: string | null;
  motivoCancelamento: string | null;
  valorEstornado: number;
  valorRetido: number;
  observacaoEstorno: string | null;
  outrosItens: string | null;
  total: number;
  valorPago: number;
  saldoDevedor: number;
  itens: PedidoItemDetalhe[];
  pagamentos: PedidoPagamentoDetalhe[];
}

export interface ResultadoPaginado<T> {
  itens: T[];
  total: number;
  pagina: number;
  tamanhoPagina: number;
  totalPaginas: number;
}

export interface PedidoFiltroParams {
  status?: string;
  cliente?: string;
  inicio?: string;
  fim?: string;
  pagina?: number;
  tamanhoPagina?: number;
}

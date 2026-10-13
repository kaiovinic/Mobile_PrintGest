import { apiClient, HttpClient } from '@/core/api/apiClient';
import {
  PedidoResumo,
  PedidoDetalhe,
  PedidoFiltroParams,
  ResultadoPaginado,
} from '@/domain/entities/Pedido';

const MESES_DE_HISTORICO = 12;

function paraIso(data: Date): string {
  return data.toISOString().slice(0, 10);
}

export class PedidoService {
  constructor(private client: HttpClient = apiClient) {}

  async listarPedidos(params?: PedidoFiltroParams): Promise<PedidoResumo[]> {
    // Sem inicio/fim a API assume apenas o mês corrente, o que deixa o app vazio
    // em meses sem movimento. O mobile é de acompanhamento, então olha para trás.
    const fim = new Date();
    const inicio = new Date(fim);
    inicio.setMonth(inicio.getMonth() - MESES_DE_HISTORICO);

    const query = new URLSearchParams({
      inicio: params?.inicio ?? paraIso(inicio),
      fim: params?.fim ?? paraIso(fim),
      pagina: String(params?.pagina ?? 1),
      tamanhoPagina: String(params?.tamanhoPagina ?? 50),
    });
    if (params?.status) query.append('status', params.status);
    if (params?.cliente) query.append('cliente', params.cliente);

    const response = await this.client.request<ResultadoPaginado<PedidoResumo>>(
      `/pedidos?${query.toString()}`
    );
    return response.itens;
  }

  // Traz pedidos em aberto e orçamentos, dos mais novos para os mais antigos.
  async listarRecentes(): Promise<PedidoResumo[]> {
    return this.client.request<PedidoResumo[]>('/pedidos/recentes');
  }

  // Pedidos em aberto com data de entrega definida, ordenados pela entrega mais próxima.
  async listarPendentesEntrega(atendente?: string): Promise<PedidoResumo[]> {
    const query = atendente ? `?atendente=${encodeURIComponent(atendente)}` : '';
    return this.client.request<PedidoResumo[]>(`/pedidos/pendentes-entrega${query}`);
  }

  async obterPorId(id: number): Promise<PedidoDetalhe> {
    return this.client.request<PedidoDetalhe>(`/pedidos/${id}`);
  }

  async atualizarStatus(id: number, status: string): Promise<void> {
    return this.client.request<void>(`/pedidos/${id}/status`, {
      method: 'PATCH',
      body: { status },
    });
  }
}

export const pedidoService = new PedidoService();

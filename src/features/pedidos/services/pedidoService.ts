import { apiClient, HttpClient } from '@/core/api/apiClient';
import { PedidoResumo, PedidoDetalhe, PedidoFiltroParams } from '@/domain/entities/Pedido';

export class PedidoService {
  constructor(private client: HttpClient = apiClient) {}

  async listarPedidos(params?: PedidoFiltroParams): Promise<PedidoResumo[]> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.busca) query.append('busca', params.busca);
    const queryString = query.toString() ? `?${query.toString()}` : '';

    return this.client.request<PedidoResumo[]>(`/pedidos${queryString}`);
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

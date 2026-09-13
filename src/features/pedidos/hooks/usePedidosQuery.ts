import { useQuery } from '@tanstack/react-query';
import { pedidoService } from '../services/pedidoService';
import { PedidoFiltroParams } from '@/domain/entities/Pedido';

export function usePedidosQuery(params?: PedidoFiltroParams) {
  return useQuery({
    queryKey: ['pedidos', params],
    queryFn: () => pedidoService.listarPedidos(params),
    staleTime: 1000 * 60 * 2, // 2 minutos de cache
  });
}

import { useQuery } from '@tanstack/react-query';
import { pedidoService } from '../services/pedidoService';

export function usePedidosRecentesQuery() {
  return useQuery({
    queryKey: ['pedidos', 'recentes'],
    queryFn: () => pedidoService.listarRecentes(),
    staleTime: 1000 * 60 * 2,
  });
}

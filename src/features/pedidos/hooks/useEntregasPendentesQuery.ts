import { useQuery } from '@tanstack/react-query';
import { pedidoService } from '../services/pedidoService';

export function useEntregasPendentesQuery(atendente?: string) {
  return useQuery({
    queryKey: ['pedidos', 'pendentes-entrega', atendente],
    queryFn: () => pedidoService.listarPendentesEntrega(atendente),
    staleTime: 1000 * 60 * 2,
  });
}

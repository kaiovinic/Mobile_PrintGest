import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pedidoService } from '../services/pedidoService';

export function useAtualizarStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      pedidoService.atualizarStatus(id, status),
    onSuccess: () => {
      // Invalida o cache de pedidos para forçar re-fetch com os dados atualizados
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });
}

import { useQuery } from '@tanstack/react-query';
import { clienteService } from '../services/clienteService';

export function useClientesQuery() {
  return useQuery({
    queryKey: ['clientes'],
    queryFn: () => clienteService.listarClientes(),
    staleTime: 1000 * 60 * 2,
  });
}

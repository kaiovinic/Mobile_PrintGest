import { apiClient, HttpClient } from '@/core/api/apiClient';
import { Cliente } from '@/domain/entities/Cliente';

export class ClienteService {
  constructor(private client: HttpClient = apiClient) {}

  async listarClientes(): Promise<Cliente[]> {
    return this.client.request<Cliente[]>('/clientes');
  }
}

export const clienteService = new ClienteService();

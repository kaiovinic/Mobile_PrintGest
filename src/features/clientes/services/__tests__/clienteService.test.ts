import { ClienteService } from '../clienteService';
import { HttpClient } from '@/core/api/apiClient';

const clienteMock = {
  id: 27,
  nome: 'Kaio Vilares',
  cpfCnpj: null,
  empresa: 'KV',
  telefone: '(71) 99673-4004',
  email: null,
  endereco: null,
  cidade: 'Alagoinhas',
};

describe('ClienteService', () => {
  it('deve chamar /clientes e devolver a lista', async () => {
    const request = jest.fn().mockResolvedValue([clienteMock]);
    const client = { request } as unknown as HttpClient;

    const clientes = await new ClienteService(client).listarClientes();

    expect(request).toHaveBeenCalledWith('/clientes');
    expect(clientes).toEqual([clienteMock]);
  });

  // A rota devolve array direto, sem envelope paginado como /pedidos.
  it('deve devolver lista vazia quando não há clientes', async () => {
    const request = jest.fn().mockResolvedValue([]);
    const client = { request } as unknown as HttpClient;

    await expect(new ClienteService(client).listarClientes()).resolves.toEqual([]);
  });
});

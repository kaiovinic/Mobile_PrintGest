import { PedidoService } from '../pedidoService';
import { HttpClient } from '@/core/api/apiClient';

function criarClientFake(resposta: unknown = { itens: [], total: 0 }) {
  const request = jest.fn().mockResolvedValue(resposta);
  return { client: { request } as unknown as HttpClient, request };
}

function queryDaChamada(request: jest.Mock): URLSearchParams {
  const caminho: string = request.mock.calls[0][0];
  return new URLSearchParams(caminho.split('?')[1] ?? '');
}

const pedidoMock = {
  id: 34,
  numero: '698723',
  cliente: 'Kaio Vilares',
  tipo: 'Pedido',
  status: 'Aberto',
  dataPedido: '2026-07-09',
  dataEntrega: '2026-07-10',
  total: 500,
  valorPago: 0,
  valorEstornado: 0,
  saldoDevedor: 500,
  criadoPor: 'Kaio Santos',
  motivoCancelamento: null,
};

describe('PedidoService.listarPedidos', () => {
  // Regressão: a API devolve a lista em `itens` (português). Ler `items`
  // fazia a tela ficar permanentemente vazia.
  it('deve extrair a lista do campo "itens" da resposta paginada', async () => {
    const { client } = criarClientFake({
      itens: [pedidoMock],
      total: 1,
      pagina: 1,
      tamanhoPagina: 50,
      totalPaginas: 1,
    });

    const pedidos = await new PedidoService(client).listarPedidos();

    expect(pedidos).toHaveLength(1);
    expect(pedidos[0].numero).toBe('698723');
  });

  // Regressão: sem inicio/fim a API assume só o mês corrente.
  it('deve enviar um período explícito de 12 meses', async () => {
    const { client, request } = criarClientFake();

    await new PedidoService(client).listarPedidos();
    const query = queryDaChamada(request);

    const inicio = query.get('inicio');
    const fim = query.get('fim');
    expect(inicio).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(fim).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    const mesesDeDiferenca =
      (new Date(fim!).getFullYear() - new Date(inicio!).getFullYear()) * 12 +
      (new Date(fim!).getMonth() - new Date(inicio!).getMonth());
    expect(mesesDeDiferenca).toBe(12);
  });

  it('deve usar os nomes de filtro que a API espera', async () => {
    const { client, request } = criarClientFake();

    await new PedidoService(client).listarPedidos({
      status: 'Aberto',
      cliente: 'Kaio',
      pagina: 2,
      tamanhoPagina: 10,
    });
    const query = queryDaChamada(request);

    expect(query.get('status')).toBe('Aberto');
    expect(query.get('cliente')).toBe('Kaio');
    expect(query.get('pagina')).toBe('2');
    expect(query.get('tamanhoPagina')).toBe('10');
  });

  it('não deve enviar status nem cliente quando não forem informados', async () => {
    const { client, request } = criarClientFake();

    await new PedidoService(client).listarPedidos();
    const query = queryDaChamada(request);

    expect(query.has('status')).toBe(false);
    expect(query.has('cliente')).toBe(false);
    expect(query.get('tamanhoPagina')).toBe('50');
  });

  it('deve respeitar o período informado em vez do padrão', async () => {
    const { client, request } = criarClientFake();

    await new PedidoService(client).listarPedidos({
      inicio: '2026-01-01',
      fim: '2026-03-31',
    });
    const query = queryDaChamada(request);

    expect(query.get('inicio')).toBe('2026-01-01');
    expect(query.get('fim')).toBe('2026-03-31');
  });
});

describe('PedidoService — listas sem paginação', () => {
  it('listarRecentes deve chamar /pedidos/recentes', async () => {
    const { client, request } = criarClientFake([pedidoMock]);

    const pedidos = await new PedidoService(client).listarRecentes();

    expect(request).toHaveBeenCalledWith('/pedidos/recentes');
    expect(pedidos).toHaveLength(1);
  });

  it('listarPendentesEntrega deve chamar a rota sem query quando não há atendente', async () => {
    const { client, request } = criarClientFake([]);

    await new PedidoService(client).listarPendentesEntrega();

    expect(request).toHaveBeenCalledWith('/pedidos/pendentes-entrega');
  });

  it('listarPendentesEntrega deve repassar o atendente codificado', async () => {
    const { client, request } = criarClientFake([]);

    await new PedidoService(client).listarPendentesEntrega('Maria Atendente');

    expect(request).toHaveBeenCalledWith(
      '/pedidos/pendentes-entrega?atendente=Maria%20Atendente'
    );
  });
});

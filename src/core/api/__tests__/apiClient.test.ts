import { AuthSession } from '@/core/auth/authSession';
import { InMemoryStorageAdapter } from '@/core/storage/inMemoryStorage';
import { STORAGE_KEYS } from '@/core/storage/storageKeys';

// A URL base é resolvida na carga do módulo, então cada caso recarrega o
// apiClient com um expo-constants diferente.
function carregarModulo(hostUri?: string) {
  jest.resetModules();
  jest.doMock('expo-constants', () => ({
    __esModule: true,
    default: { expoConfig: hostUri ? { hostUri } : {} },
  }));
  return require('../apiClient');
}

describe('resolução da URL base da API', () => {
  afterEach(() => {
    jest.dontMock('expo-constants');
  });

  // Regressão: no celular físico 10.0.2.2 não existe — é alias do emulador.
  it('deve usar o IP da rede quando o Metro está servindo pela LAN', () => {
    expect(carregarModulo('192.168.200.11:8081').apiClient.getBaseUrl()).toBe(
      'http://192.168.200.11:5285/api'
    );
  });

  it('deve cair no alias do emulador quando o host é localhost', () => {
    expect(carregarModulo('localhost:8081').apiClient.getBaseUrl()).toBe(
      'http://10.0.2.2:5285/api'
    );
  });

  it('deve cair no alias do emulador quando o host é 127.0.0.1', () => {
    expect(carregarModulo('127.0.0.1:8081').apiClient.getBaseUrl()).toBe(
      'http://10.0.2.2:5285/api'
    );
  });

  it('deve cair no alias do emulador quando não há hostUri', () => {
    expect(carregarModulo().apiClient.getBaseUrl()).toBe('http://10.0.2.2:5285/api');
  });
});

describe('HttpClient — envio e descarte de credencial', () => {
  const sessaoValida = {
    usuarioId: 1,
    nome: 'Kaio Santos',
    email: 'admin@print.com',
    perfil: 'ADMIN',
    deveTrocarSenha: false,
    accessToken: 'jwt-de-teste',
    expiresAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
  };

  function respostaFake(status: number, corpo: unknown = {}) {
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => corpo,
    };
  }

  function montar(status: number) {
    const { HttpClient } = carregarModulo('192.168.200.11:8081');
    const storage = new InMemoryStorageAdapter();
    const session = new AuthSession(storage);
    const fetchMock = jest.fn().mockResolvedValue(respostaFake(status));
    (global as any).fetch = fetchMock;

    return { client: new HttpClient(undefined, session), storage, session, fetchMock };
  }

  afterEach(() => {
    jest.dontMock('expo-constants');
  });

  it('deve enviar o Authorization quando a sessão é válida', async () => {
    const { client, session, fetchMock } = montar(200);
    await session.salvar(sessaoValida as never);

    await client.request('/pedidos');

    const headers = fetchMock.mock.calls[0][1].headers;
    expect(headers.Authorization).toBe('Bearer jwt-de-teste');
  });

  // Token vencido não deve nem sair do aparelho.
  it('não deve enviar Authorization quando a sessão expirou', async () => {
    const { client, storage, fetchMock } = montar(200);
    await storage.setItem(
      STORAGE_KEYS.USER,
      JSON.stringify({ ...sessaoValida, expiresAt: new Date(Date.now() - 1000).toISOString() })
    );

    await client.request('/pedidos');

    const headers = fetchMock.mock.calls[0][1].headers;
    expect(headers.Authorization).toBeUndefined();
  });

  it('deve descartar a sessão quando o servidor responde 401', async () => {
    const { client, storage, session } = montar(401);
    await session.salvar(sessaoValida as never);

    await expect(client.request('/pedidos')).rejects.toThrow();

    await expect(storage.getItem(STORAGE_KEYS.USER)).resolves.toBeNull();
  });
});

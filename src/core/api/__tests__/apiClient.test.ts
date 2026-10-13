// A URL base é resolvida na carga do módulo, então cada caso recarrega o
// apiClient com um expo-constants diferente.
function carregarApiClient(hostUri?: string) {
  jest.resetModules();
  jest.doMock('expo-constants', () => ({
    __esModule: true,
    default: { expoConfig: hostUri ? { hostUri } : {} },
  }));
  return require('../apiClient').apiClient as { getBaseUrl(): string };
}

describe('resolução da URL base da API', () => {
  afterEach(() => {
    jest.dontMock('expo-constants');
  });

  // Regressão: no celular físico 10.0.2.2 não existe — é alias do emulador.
  it('deve usar o IP da rede quando o Metro está servindo pela LAN', () => {
    expect(carregarApiClient('192.168.200.11:8081').getBaseUrl()).toBe(
      'http://192.168.200.11:5285/api'
    );
  });

  it('deve cair no alias do emulador quando o host é localhost', () => {
    expect(carregarApiClient('localhost:8081').getBaseUrl()).toBe(
      'http://10.0.2.2:5285/api'
    );
  });

  it('deve cair no alias do emulador quando o host é 127.0.0.1', () => {
    expect(carregarApiClient('127.0.0.1:8081').getBaseUrl()).toBe(
      'http://10.0.2.2:5285/api'
    );
  });

  it('deve cair no alias do emulador quando não há hostUri', () => {
    expect(carregarApiClient().getBaseUrl()).toBe('http://10.0.2.2:5285/api');
  });
});

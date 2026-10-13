import Constants from 'expo-constants';
import { ApiError } from './apiError';
import { StorageAdapter } from '../storage/storageAdapter';
import { secureStorage } from '../storage/secureStorage';

import { STORAGE_KEYS } from '../storage/storageKeys';

const PORTA_API = 5285; // porta HTTP da API .NET (launchSettings.json)
const HOST_EMULADOR_ANDROID = '10.0.2.2'; // alias do emulador para o localhost da máquina

// O Metro roda na mesma máquina que a API, então o host dele serve de endereço
// para ambos: IP da rede no celular físico, e o alias acima no emulador.
function resolverBaseUrl(): string {
  const hostDoMetro = Constants.expoConfig?.hostUri?.split(':')[0];
  const alcancavelPelaRede =
    hostDoMetro && hostDoMetro !== 'localhost' && hostDoMetro !== '127.0.0.1';

  return `http://${alcancavelPelaRede ? hostDoMetro : HOST_EMULADOR_ANDROID}:${PORTA_API}/api`;
}

const DEFAULT_BASE_URL = resolverBaseUrl();
const AUTH_TOKEN_KEY = STORAGE_KEYS.USER;

export class HttpClient {
  constructor(
    private baseUrl: string = DEFAULT_BASE_URL,
    private storage: StorageAdapter = secureStorage
  ) {}

  public setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      const raw = await this.storage.getItem(AUTH_TOKEN_KEY);
      if (!raw) return null;
      const user = JSON.parse(raw) as { accessToken?: string };
      return user.accessToken ?? null;
    } catch {
      return null;
    }
  }

  public async request<T>(
    path: string,
    options: Omit<RequestInit, 'body'> & { body?: unknown } = {}
  ): Promise<T> {
    const token = await this.getAuthToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string>),
    };

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const errorMessage = await this.readErrorMessage(response);
      throw new ApiError(errorMessage, response.status);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }

  private async readErrorMessage(response: Response): Promise<string> {
    try {
      const data = (await response.json()) as { mensagem?: string; message?: string; title?: string };
      return data.mensagem ?? data.message ?? data.title ?? 'Erro ao comunicar com o servidor.';
    } catch {
      return 'Erro inesperado ao comunicar com o servidor.';
    }
  }
}

export const apiClient = new HttpClient();

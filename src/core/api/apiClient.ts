import { ApiError } from './apiError';
import { StorageAdapter } from '../storage/storageAdapter';
import { secureStorage } from '../storage/secureStorage';

const DEFAULT_BASE_URL = 'http://10.0.2.2:5285/api'; // IP padrão Emulador Android para a porta HTTP da API .NET (launchSettings.json: 5285)
const AUTH_TOKEN_KEY = 'printgest:user';

export class HttpClient {
  constructor(
    private baseUrl: string = DEFAULT_BASE_URL,
    private storage: StorageAdapter = secureStorage
  ) {}

  public setBaseUrl(url: string) {
    this.baseUrl = url;
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

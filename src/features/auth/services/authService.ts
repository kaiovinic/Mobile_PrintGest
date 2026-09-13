import { apiClient, HttpClient } from '@/core/api/apiClient';
import { AuthUser, LoginPayload } from '@/domain/entities/Usuario';

export class AuthService {
  constructor(private client: HttpClient = apiClient) {}

  async login(payload: LoginPayload): Promise<AuthUser> {
    return this.client.request<AuthUser>('/auth/login', {
      method: 'POST',
      body: payload,
    });
  }
}

export const authService = new AuthService();

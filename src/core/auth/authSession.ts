import { AuthUser } from '@/domain/entities/Usuario';
import { StorageAdapter } from '../storage/storageAdapter';
import { secureStorage } from '../storage/secureStorage';
import { STORAGE_KEYS } from '../storage/storageKeys';

export function sessaoExpirada(expiresAt: string | undefined | null): boolean {
  if (!expiresAt) return true;

  const expiracao = new Date(expiresAt).getTime();
  if (Number.isNaN(expiracao)) return true;

  return expiracao <= Date.now();
}

export class AuthSession {
  constructor(private storage: StorageAdapter = secureStorage) {}

  async salvar(user: AuthUser): Promise<void> {
    await this.storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  // Devolve a sessão só enquanto ela vale: token vencido ou ilegível é descartado,
  // para o app não insistir numa credencial morta e cair em 401 silencioso.
  async obter(): Promise<AuthUser | null> {
    const raw = await this.storage.getItem(STORAGE_KEYS.USER);
    if (!raw) return null;

    let user: AuthUser;
    try {
      user = JSON.parse(raw) as AuthUser;
    } catch {
      await this.encerrar();
      return null;
    }

    if (!user?.accessToken || sessaoExpirada(user.expiresAt)) {
      await this.encerrar();
      return null;
    }

    return user;
  }

  async encerrar(): Promise<void> {
    await this.storage.removeItem(STORAGE_KEYS.USER);
  }
}

export const authSession = new AuthSession();

import { AuthSession, sessaoExpirada } from '../authSession';
import { InMemoryStorageAdapter } from '@/core/storage/inMemoryStorage';
import { STORAGE_KEYS } from '@/core/storage/storageKeys';
import { AuthUser } from '@/domain/entities/Usuario';

function daquiAHoras(horas: number): string {
  return new Date(Date.now() + horas * 60 * 60 * 1000).toISOString();
}

function usuario(expiresAt: string): AuthUser {
  return {
    usuarioId: 1,
    nome: 'Kaio Santos',
    email: 'admin@print.com',
    perfil: 'ADMIN',
    deveTrocarSenha: false,
    accessToken: 'jwt-de-teste',
    expiresAt,
  };
}

describe('sessaoExpirada', () => {
  it('deve considerar expirada uma data no passado', () => {
    expect(sessaoExpirada(daquiAHoras(-1))).toBe(true);
  });

  it('não deve considerar expirada uma data no futuro', () => {
    expect(sessaoExpirada(daquiAHoras(5))).toBe(false);
  });

  it('deve considerar expirada quando a data está ausente', () => {
    expect(sessaoExpirada(undefined)).toBe(true);
    expect(sessaoExpirada(null)).toBe(true);
    expect(sessaoExpirada('')).toBe(true);
  });

  it('deve considerar expirada quando a data é inválida', () => {
    expect(sessaoExpirada('não é uma data')).toBe(true);
  });
});

describe('AuthSession', () => {
  let storage: InMemoryStorageAdapter;
  let session: AuthSession;

  beforeEach(() => {
    storage = new InMemoryStorageAdapter();
    session = new AuthSession(storage);
  });

  it('deve devolver a sessão enquanto o token for válido', async () => {
    await session.salvar(usuario(daquiAHoras(5)));

    const atual = await session.obter();

    expect(atual?.email).toBe('admin@print.com');
    expect(atual?.accessToken).toBe('jwt-de-teste');
  });

  it('deve devolver null quando não há nada guardado', async () => {
    await expect(session.obter()).resolves.toBeNull();
  });

  // O token vencido não pode ser reaproveitado: ia gerar 401 silencioso.
  it('deve descartar a sessão expirada do storage', async () => {
    await session.salvar(usuario(daquiAHoras(-1)));

    await expect(session.obter()).resolves.toBeNull();
    await expect(storage.getItem(STORAGE_KEYS.USER)).resolves.toBeNull();
  });

  it('deve descartar conteúdo corrompido no storage', async () => {
    await storage.setItem(STORAGE_KEYS.USER, 'isso não é json');

    await expect(session.obter()).resolves.toBeNull();
    await expect(storage.getItem(STORAGE_KEYS.USER)).resolves.toBeNull();
  });

  it('deve descartar sessão sem accessToken', async () => {
    const semToken = { ...usuario(daquiAHoras(5)), accessToken: '' };
    await storage.setItem(STORAGE_KEYS.USER, JSON.stringify(semToken));

    await expect(session.obter()).resolves.toBeNull();
  });

  it('encerrar deve limpar o storage', async () => {
    await session.salvar(usuario(daquiAHoras(5)));

    await session.encerrar();

    await expect(storage.getItem(STORAGE_KEYS.USER)).resolves.toBeNull();
  });
});

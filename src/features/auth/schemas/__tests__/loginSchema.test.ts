import { loginSchema } from '../loginSchema';

describe('loginSchema (Zod validation)', () => {
  it('deve aprovar credenciais válidas', () => {
    const res = loginSchema.safeParse({
      email: 'usuario@printgest.com',
      senha: '123456',
    });
    expect(res.success).toBe(true);
  });

  it('deve rejeitar e-mail em formato inválido', () => {
    const res = loginSchema.safeParse({
      email: 'emailinvalido',
      senha: '123456',
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0].message).toBe('Insira um e-mail válido');
    }
  });

  it('deve rejeitar senha com menos de 6 caracteres', () => {
    const res = loginSchema.safeParse({
      email: 'usuario@printgest.com',
      senha: '123',
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0].message).toBe('A senha deve ter pelo menos 6 caracteres');
    }
  });
});

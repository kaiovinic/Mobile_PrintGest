import { PerfilUsuario } from '../enums/PerfilUsuario';

export interface AuthUser {
  usuarioId: number;
  nome: string;
  email: string;
  perfil: PerfilUsuario | string;
  deveTrocarSenha: boolean;
  accessToken: string;
  expiresAt: string;
}

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface Cliente {
  id: number;
  nome: string;
  cpfCnpj: string | null;
  empresa: string | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  cidade: string | null;
}

/**
 * Contrato genérico de armazenamento chave-valor (DIP - Dependency Inversion Principle).
 * Permite alternar a implementação nativa (SecureStore, MMKV) ou em memória (para testes)
 * sem alterar nenhum ponto do código de negócio.
 */
export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

// Mocks de APIs Globais do Expo
jest.mock('expo-font', () => ({
  isLoaded: jest.fn(() => true),
  loadAsync: jest.fn(),
}), { virtual: true });

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}), { virtual: true });

// lucide-react-native é distribuído como ESM; nos testes cada ícone não renderiza nada.
jest.mock('lucide-react-native', () =>
  new Proxy(
    {},
    {
      get: (_alvo, nome) => (nome === '__esModule' ? true : () => null),
    }
  )
);

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
}), { virtual: true });

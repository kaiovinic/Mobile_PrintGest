// O global.css é processado pelo NativeWind via Metro, não pelo TypeScript.
declare module '*.css';

// @types/react-test-renderer não instala por conflito de peer deps com React 19,
// então declaramos aqui a superfície que os testes usam.
declare module 'react-test-renderer' {
  import type { ReactElement } from 'react';

  namespace TestRenderer {
    interface ReactTestInstance {
      props: Record<string, any>;
      type: unknown;
      findByType(type: unknown): ReactTestInstance;
      findAllByType(type: unknown): ReactTestInstance[];
      findByProps(props: Record<string, unknown>): ReactTestInstance;
    }

    interface ReactTestRenderer {
      root: ReactTestInstance;
      toJSON(): unknown;
      unmount(): void;
    }

    function create(element: ReactElement): ReactTestRenderer;
    function act(callback: () => void | Promise<void>): void;
  }

  export = TestRenderer;
}

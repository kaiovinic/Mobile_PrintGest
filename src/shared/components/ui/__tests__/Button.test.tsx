import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { Text, TouchableOpacity } from 'react-native';
import { Button } from '../Button';

describe('<Button /> UI Component', () => {
  it('deve renderizar o título do botão corretamente', () => {
    let tree!: TestRenderer.ReactTestRenderer;
    act(() => {
      tree = TestRenderer.create(<Button title="Salvar Pedido" onPress={() => {}} />);
    });
    const textComponent = tree.root.findByType(Text);
    expect(textComponent.props.children).toBe('Salvar Pedido');
  });

  it('deve disparar a função onPress quando pressionado', () => {
    const onPressMock = jest.fn();
    let tree!: TestRenderer.ReactTestRenderer;
    act(() => {
      tree = TestRenderer.create(<Button title="Entrar" onPress={onPressMock} />);
    });
    const touchable = tree.root.findByType(TouchableOpacity);

    act(() => {
      touchable.props.onPress();
    });

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('não deve disparar onPress quando desabilitado ou em estado de loading', () => {
    const onPressMock = jest.fn();
    let tree!: TestRenderer.ReactTestRenderer;
    act(() => {
      tree = TestRenderer.create(<Button title="Entrar" loading onPress={onPressMock} />);
    });
    const touchable = tree.root.findByType(TouchableOpacity);

    expect(touchable.props.disabled).toBe(true);
  });
});

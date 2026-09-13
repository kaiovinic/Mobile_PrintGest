import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { Text, TouchableOpacity } from 'react-native';
import { PedidoCard } from '../PedidoCard';
import { StatusPedido, TipoPedido } from '@/domain/enums/StatusPedido';

const pedidoMock = {
  id: 1,
  numero: 'PED-1001',
  cliente: 'Gráfica Exemplo LTDA',
  tipo: TipoPedido.PEDIDO,
  status: StatusPedido.ABERTO,
  dataPedido: '2026-09-12T10:00:00.000Z',
  dataEntrega: '2026-09-15T10:00:00.000Z',
  total: 450.0,
  valorPago: 200.0,
  valorEstornado: 0,
  saldoDevedor: 250.0,
  criadoPor: 'Admin',
  motivoCancelamento: null,
};

describe('<PedidoCard /> Component', () => {
  it('deve renderizar o número do pedido e nome do cliente', () => {
    let tree!: TestRenderer.ReactTestRenderer;
    act(() => {
      tree = TestRenderer.create(<PedidoCard pedido={pedidoMock} />);
    });

    const texts = tree.root.findAllByType(Text).map((t) => t.props.children);
    expect(texts.some((txt) => Array.isArray(txt) ? txt.includes('PED-1001') : txt === '#PED-1001')).toBe(true);
    expect(texts).toContain('Gráfica Exemplo LTDA');
  });

  it('deve disparar a função onPress quando o card for clicado', () => {
    const onPressMock = jest.fn();
    let tree!: TestRenderer.ReactTestRenderer;
    act(() => {
      tree = TestRenderer.create(<PedidoCard pedido={pedidoMock} onPress={onPressMock} />);
    });

    const touchable = tree.root.findByType(TouchableOpacity);
    act(() => {
      touchable.props.onPress();
    });

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});

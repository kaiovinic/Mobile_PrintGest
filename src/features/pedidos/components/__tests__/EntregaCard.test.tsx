import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { Text } from 'react-native';
import { EntregaCard, estaAtrasado } from '../EntregaCard';

const hoje = new Date().toISOString().slice(0, 10);

function diasAPartirDeHoje(dias: number): string {
  const data = new Date();
  data.setDate(data.getDate() + dias);
  return data.toISOString().slice(0, 10);
}

const pedidoMock = {
  id: 34,
  numero: '698723',
  cliente: 'Kaio Vilares',
  tipo: 'Pedido',
  status: 'Aberto',
  dataPedido: '2026-07-09',
  dataEntrega: hoje,
  total: 500,
  valorPago: 0,
  valorEstornado: 0,
  saldoDevedor: 500,
  criadoPor: 'Kaio Santos',
  motivoCancelamento: null,
};

describe('estaAtrasado', () => {
  it('deve considerar atrasada uma entrega de ontem', () => {
    expect(estaAtrasado(diasAPartirDeHoje(-1))).toBe(true);
  });

  it('não deve considerar atrasada a entrega de hoje', () => {
    expect(estaAtrasado(hoje)).toBe(false);
  });

  it('não deve considerar atrasada uma entrega futura', () => {
    expect(estaAtrasado(diasAPartirDeHoje(30))).toBe(false);
  });

  it('não deve considerar atrasado um pedido sem data de entrega', () => {
    expect(estaAtrasado(null)).toBe(false);
  });

  it('deve aceitar data com horário (ISO completo)', () => {
    expect(estaAtrasado(`${diasAPartirDeHoje(-5)}T10:00:00.000Z`)).toBe(true);
  });
});

describe('<EntregaCard />', () => {
  function textosDe(pedido: typeof pedidoMock): unknown[] {
    let tree!: TestRenderer.ReactTestRenderer;
    act(() => {
      tree = TestRenderer.create(<EntregaCard pedido={pedido} />);
    });
    return tree.root.findAllByType(Text).map((t) => t.props.children);
  }

  it('deve exibir o selo de atraso quando a entrega venceu', () => {
    const textos = textosDe({ ...pedidoMock, dataEntrega: diasAPartirDeHoje(-3) });
    expect(textos).toContain('Atrasado');
  });

  it('não deve exibir o selo de atraso quando está no prazo', () => {
    const textos = textosDe({ ...pedidoMock, dataEntrega: diasAPartirDeHoje(7) });
    expect(textos).not.toContain('Atrasado');
  });

  it('deve exibir o cliente do pedido', () => {
    expect(textosDe(pedidoMock)).toContain('Kaio Vilares');
  });
});

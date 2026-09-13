import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { usePedidosQuery } from '@/features/pedidos/hooks/usePedidosQuery';
import { formatarMoeda } from '@/core/utils/formatters';

export default function DashboardScreen() {
  const { data: pedidos = [], isLoading } = usePedidosQuery();

  const totalPedidos = pedidos.length;
  const emAberto = pedidos.filter((p) => String(p.status) === 'Aberto').length;
  const orcados = pedidos.filter((p) => String(p.status) === 'Orcado').length;
  const faturamentoTotal = pedidos.reduce((acc, p) => acc + p.total, 0);

  return (
    <ScrollView className="flex-1 bg-slate-50 p-4">
      <Text className="text-xl font-extrabold text-slate-900 mb-4">
        Visão Geral da Gráfica
      </Text>

      <View className="flex-row gap-3 mb-3">
        <View className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <Text className="text-xs text-slate-500 font-medium">Pedidos em Aberto</Text>
          <Text className="text-2xl font-extrabold text-blue-600 mt-1">
            {isLoading ? '...' : emAberto}
          </Text>
        </View>

        <View className="flex-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <Text className="text-xs text-slate-500 font-medium">Orçamentos</Text>
          <Text className="text-2xl font-extrabold text-amber-600 mt-1">
            {isLoading ? '...' : orcados}
          </Text>
        </View>
      </View>

      <View className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-4">
        <Text className="text-sm text-slate-500 font-medium">Volume de Vendas</Text>
        <Text className="text-3xl font-extrabold text-emerald-600 mt-1">
          {isLoading ? '...' : formatarMoeda(faturamentoTotal)}
        </Text>
        <Text className="text-xs text-slate-400 mt-1">
          Baseado em {totalPedidos} registros cadastrados
        </Text>
      </View>
    </ScrollView>
  );
}

import React from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useEntregasPendentesQuery } from '@/features/pedidos/hooks/useEntregasPendentesQuery';
import { EntregaCard, estaAtrasado } from '@/features/pedidos/components/EntregaCard';

export default function EntregasScreen() {
  const { data: entregas = [], isLoading, refetch, isRefetching } = useEntregasPendentesQuery();
  const atrasadas = entregas.filter((pedido) => estaAtrasado(pedido.dataEntrega)).length;

  if (isLoading) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-3 text-slate-500">Carregando entregas...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-white px-4 py-3 border-b border-slate-200">
        <Text className="text-sm font-bold text-slate-900">
          {entregas.length} {entregas.length === 1 ? 'entrega pendente' : 'entregas pendentes'}
        </Text>
        <Text className="text-xs text-slate-500 mt-0.5">
          {atrasadas > 0
            ? `${atrasadas} com prazo vencido`
            : 'Pedidos em aberto com data de entrega definida'}
        </Text>
      </View>

      <FlatList
        data={entregas}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={['#2563EB']} />
        }
        ListEmptyComponent={
          <View className="p-8 items-center">
            <Text className="text-base text-slate-500 text-center">
              Nenhuma entrega pendente no momento.
            </Text>
          </View>
        }
        renderItem={({ item }) => <EntregaCard pedido={item} />}
      />
    </View>
  );
}

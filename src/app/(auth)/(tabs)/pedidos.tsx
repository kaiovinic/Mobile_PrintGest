import React, { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { usePedidosQuery } from '@/features/pedidos/hooks/usePedidosQuery';
import { PedidoCard } from '@/features/pedidos/components/PedidoCard';

const FILTROS_STATUS = [
  { id: '', label: 'Todos' },
  { id: 'Aberto', label: 'Em Aberto' },
  { id: 'Orcado', label: 'Orçados' },
  { id: 'Finalizado', label: 'Finalizados' },
];

export default function PedidosScreen() {
  const [statusFiltro, setStatusFiltro] = useState('');
  const { data: rawPedidos, isLoading, refetch, isRefetching } = usePedidosQuery({
    status: statusFiltro || undefined,
  });
  const pedidos = Array.isArray(rawPedidos) ? rawPedidos : [];

  return (
    <View className="flex-1 bg-slate-50">
      {/* Barra de Filtros Rápidos */}
      <View className="bg-white py-3 px-4 border-b border-slate-200">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTROS_STATUS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isSelected = statusFiltro === item.id;
            return (
              <TouchableOpacity
                onPress={() => setStatusFiltro(item.id)}
                className={`${
                  isSelected ? 'bg-blue-600' : 'bg-slate-100'
                } px-4 py-2 rounded-full mr-2`}
              >
                <Text
                  className={`${
                    isSelected ? 'text-white font-bold' : 'text-slate-600 font-medium'
                  } text-sm`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Lista de Pedidos */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className="mt-3 text-slate-500">Carregando pedidos...</Text>
        </View>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={['#2563EB']} />}
          ListEmptyComponent={
            <View className="p-8 items-center">
              <Text className="text-base text-slate-500 text-center">
                Nenhum pedido encontrado para o filtro selecionado.
              </Text>
            </View>
          }
          renderItem={({ item }) => <PedidoCard pedido={item} />}
        />
      )}
    </View>
  );
}

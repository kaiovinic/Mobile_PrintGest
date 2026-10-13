import React from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useClientesQuery } from '@/features/clientes/hooks/useClientesQuery';
import { ClienteCard } from '@/features/clientes/components/ClienteCard';

export default function ClientesScreen() {
  const { data: clientes = [], isLoading, refetch, isRefetching } = useClientesQuery();

  if (isLoading) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-3 text-slate-500">Carregando clientes...</Text>
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1 bg-slate-50"
      data={clientes}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={['#2563EB']} />
      }
      ListEmptyComponent={
        <View className="p-8 items-center">
          <Text className="text-base text-slate-500 text-center">
            Nenhum cliente cadastrado.
          </Text>
        </View>
      }
      renderItem={({ item }) => <ClienteCard cliente={item} />}
    />
  );
}

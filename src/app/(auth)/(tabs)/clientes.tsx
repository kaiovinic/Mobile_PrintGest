import React from 'react';
import { View, Text } from 'react-native';

export default function ClientesScreen() {
  return (
    <View className="flex-1 bg-slate-50 p-4 justify-center items-center">
      <Text className="text-xl font-bold text-slate-900 mb-2">
        Módulo de Clientes
      </Text>
      <Text className="text-sm text-slate-500 text-center">
        Em breve: Pesquisa rápida e cadastro de clientes (PF e PJ).
      </Text>
    </View>
  );
}

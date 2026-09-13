import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PedidoResumo } from '@/domain/entities/Pedido';
import { Badge } from '@/shared/components/ui/Badge';
import { formatarMoeda, formatarData } from '@/core/utils/formatters';

export interface PedidoCardProps {
  pedido: PedidoResumo;
  onPress?: () => void;
}

export function PedidoCard({ pedido, onPress }: PedidoCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="bg-white rounded-xl p-4 mb-3 border border-slate-200 shadow-sm"
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-base font-bold text-slate-800">#{pedido.numero}</Text>
        <Badge status={String(pedido.status)} />
      </View>

      <Text className="text-sm font-semibold text-slate-700 mb-2">{pedido.cliente}</Text>

      <View className="flex-row justify-between mt-2 pt-2 border-t border-slate-100">
        <View>
          <Text className="text-xs text-slate-500">Data de Criação</Text>
          <Text className="text-xs font-medium text-slate-700">
            {formatarData(pedido.dataPedido)}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xs text-slate-500">Total</Text>
          <Text className="text-sm font-bold text-blue-600">
            {formatarMoeda(pedido.total)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

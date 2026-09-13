import React from 'react';
import { View, Text } from 'react-native';
import { StatusPedido } from '@/domain/enums/StatusPedido';

export interface BadgeProps {
  status: string;
}

export function Badge({ status }: BadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case StatusPedido.ORCADO:
        return { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Orçado' };
      case StatusPedido.ABERTO:
        return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Em Aberto' };
      case StatusPedido.FINALIZADO:
        return { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Finalizado' };
      case StatusPedido.CANCELADO:
        return { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelado' };
      default:
        return { bg: 'bg-slate-100', text: 'text-slate-600', label: status };
    }
  };

  const config = getStatusColor();

  return (
    <View className={`${config.bg} px-2.5 py-1 rounded-full self-start`}>
      <Text className={`${config.text} text-xs font-semibold`}>{config.label}</Text>
    </View>
  );
}

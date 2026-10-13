import React from 'react';
import { View, Text } from 'react-native';
import { AlertTriangle, CalendarDays } from 'lucide-react-native';
import { PedidoResumo } from '@/domain/entities/Pedido';
import { formatarData, formatarMoeda } from '@/core/utils/formatters';

export interface EntregaCardProps {
  pedido: PedidoResumo;
}

export function estaAtrasado(dataEntrega: string | null): boolean {
  if (!dataEntrega) return false;
  return dataEntrega.slice(0, 10) < new Date().toISOString().slice(0, 10);
}

export function EntregaCard({ pedido }: EntregaCardProps) {
  const atrasado = estaAtrasado(pedido.dataEntrega);

  return (
    <View
      className={`bg-white rounded-xl p-4 mb-3 border shadow-sm ${
        atrasado ? 'border-red-300' : 'border-slate-200'
      }`}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-base font-bold text-slate-800">#{pedido.numero}</Text>

        {atrasado ? (
          <View className="flex-row items-center gap-1 bg-red-100 px-2.5 py-1 rounded-full">
            <AlertTriangle color="#B91C1C" size={12} />
            <Text className="text-xs font-semibold text-red-700">Atrasado</Text>
          </View>
        ) : null}
      </View>

      <Text className="text-sm font-semibold text-slate-700">{pedido.cliente}</Text>
      <Text className="text-xs text-slate-500 mt-0.5">Atendente: {pedido.criadoPor}</Text>

      <View className="flex-row justify-between items-end mt-2 pt-2 border-t border-slate-100">
        <View className="flex-row items-center gap-1.5">
          <CalendarDays color={atrasado ? '#B91C1C' : '#64748B'} size={14} />
          <View>
            <Text className="text-xs text-slate-500">Entrega</Text>
            <Text
              className={`text-xs font-bold ${atrasado ? 'text-red-700' : 'text-slate-700'}`}
            >
              {formatarData(pedido.dataEntrega)}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="text-xs text-slate-500">Saldo devedor</Text>
          <Text className="text-sm font-bold text-blue-600">
            {formatarMoeda(pedido.saldoDevedor)}
          </Text>
        </View>
      </View>
    </View>
  );
}

import React from 'react';
import { View, Text } from 'react-native';
import { Building2, Phone, MapPin } from 'lucide-react-native';
import { Cliente } from '@/domain/entities/Cliente';

export interface ClienteCardProps {
  cliente: Cliente;
}

export function ClienteCard({ cliente }: ClienteCardProps) {
  const temRodape = Boolean(cliente.telefone || cliente.cidade);

  return (
    <View className="bg-white rounded-xl p-4 mb-3 border border-slate-200 shadow-sm">
      <Text className="text-base font-bold text-slate-800">{cliente.nome}</Text>

      {cliente.empresa ? (
        <View className="flex-row items-center gap-1.5 mt-1">
          <Building2 color="#64748B" size={13} />
          <Text className="text-sm text-slate-600">{cliente.empresa}</Text>
        </View>
      ) : null}

      {temRodape ? (
        <View className="flex-row gap-4 mt-2 pt-2 border-t border-slate-100">
          {cliente.telefone ? (
            <View className="flex-row items-center gap-1.5">
              <Phone color="#64748B" size={13} />
              <Text className="text-xs text-slate-600">{cliente.telefone}</Text>
            </View>
          ) : null}

          {cliente.cidade ? (
            <View className="flex-row items-center gap-1.5">
              <MapPin color="#64748B" size={13} />
              <Text className="text-xs text-slate-600">{cliente.cidade}</Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

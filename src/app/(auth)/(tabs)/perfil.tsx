import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/shared/components/ui/Button';
import { secureStorage } from '@/core/storage/secureStorage';

export default function PerfilScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await secureStorage.removeItem('printgest:user');
    router.replace('/login');
  };

  return (
    <View className="flex-1 bg-slate-50 p-6 justify-between">
      <View className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <Text className="text-lg font-bold text-slate-900 mb-1">
          Usuário Conectado
        </Text>
        <Text className="text-sm text-slate-500">
          Sessão ativa via JWT seguro no dispositivo
        </Text>
      </View>

      <Button title="Sair da Conta" variant="danger" onPress={handleLogout} />
    </View>
  );
}

import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '@/shared/components/ui/Button';
import { Badge } from '@/shared/components/ui/Badge';
import { secureStorage } from '@/core/storage/secureStorage';
import { STORAGE_KEYS } from '@/core/storage/storageKeys';
import { AuthUser } from '@/domain/entities/Usuario';
import { User, Mail, ShieldCheck } from 'lucide-react-native';

export default function PerfilScreen() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const raw = await secureStorage.getItem(STORAGE_KEYS.USER);
        if (raw) {
          setUser(JSON.parse(raw) as AuthUser);
        }
      } catch (err) {
        console.error('Erro ao carregar dados do usuário:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    await secureStorage.removeItem(STORAGE_KEYS.USER);
    router.replace('/login');
  };

  if (loading) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50 p-6 justify-between">
      <View className="space-y-4">
        {/* Cartão de Informações do Usuário */}
        <View className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm items-center">
          <View className="w-20 h-20 bg-blue-100 rounded-full justify-center items-center mb-4">
            <User color="#2563EB" size={40} />
          </View>

          <Text className="text-xl font-extrabold text-slate-900 mb-1">
            {user?.nome || 'Usuário Gestor'}
          </Text>

          <View className="flex-row items-center gap-1 mb-3">
            <Mail color="#64748B" size={14} />
            <Text className="text-sm text-slate-500 font-medium">
              {user?.email || 'email@printgest.com'}
            </Text>
          </View>

          {user?.perfil && (
            <Badge status={String(user.perfil)} />
          )}
        </View>

        {/* Status da Sessão */}
        <View className="bg-white p-4 rounded-xl border border-slate-200 flex-row items-center gap-3">
          <ShieldCheck color="#16A34A" size={24} />
          <View className="flex-1">
            <Text className="text-sm font-bold text-slate-900">
              Autenticado com Segurança
            </Text>
            <Text className="text-xs text-slate-500">
              Sessão JWT ativa e criptografada no dispositivo
            </Text>
          </View>
        </View>
      </View>

      <Button title="Sair da Conta" variant="danger" onPress={handleLogout} />
    </View>
  );
}

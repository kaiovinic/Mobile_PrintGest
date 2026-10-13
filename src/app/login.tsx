import React from 'react';
import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { LoginFormData } from '@/features/auth/schemas/loginSchema';
import { useLoginMutation } from '@/features/auth/hooks/useLoginMutation';
import { secureStorage } from '@/core/storage/secureStorage';
import { STORAGE_KEYS } from '@/core/storage/storageKeys';
import { ApiError } from '@/core/api/apiError';
import { apiClient } from '@/core/api/apiClient';

export default function LoginScreen() {
  const router = useRouter();
  const { mutate: entrar, isPending } = useLoginMutation();

  const handleLogin = (data: LoginFormData) => {
    entrar(data, {
      onSuccess: async (user) => {
        await secureStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        router.replace('/(auth)/(tabs)');
      },
      onError: (err) => {
        // Sem ApiError não houve resposta do servidor: é falha de rede, não de senha.
        if (err instanceof ApiError) {
          Alert.alert('Erro de Autenticação', err.message);
        } else {
          Alert.alert(
            'Falha de conexão',
            `Não foi possível falar com o servidor em ${apiClient.getBaseUrl()}.\n\n${err?.message ?? ''}`
          );
        }
      },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-900"
    >
      <ScrollView contentContainerClassName="flex-grow justify-center p-6">
        <View className="items-center mb-8">
          <Text className="text-4xl font-extrabold text-blue-500 mb-2">PrintGest</Text>
          <Text className="text-base text-slate-400 text-center">
            Gestão Operacional de Gráficas
          </Text>
        </View>

        <View className="bg-white rounded-2xl p-6 shadow-md">
          <Text className="text-xl font-bold text-slate-900 mb-4">Acessar Conta</Text>
          <LoginForm onSubmit={handleLogin} loading={isPending} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

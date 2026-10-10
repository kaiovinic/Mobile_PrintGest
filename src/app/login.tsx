import React, { useState } from 'react';
import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { LoginFormData } from '@/features/auth/schemas/loginSchema';
import { authService } from '@/features/auth/services/authService';
import { secureStorage } from '@/core/storage/secureStorage';
import { STORAGE_KEYS } from '@/core/storage/storageKeys';

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const user = await authService.login(data);
      await secureStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      router.replace('/(auth)/(tabs)');
    } catch (err: any) {
      Alert.alert('Erro de Autenticação', err.message || 'E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
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
          <LoginForm onSubmit={handleLogin} loading={loading} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

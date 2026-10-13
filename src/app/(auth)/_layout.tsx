import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, Redirect } from 'expo-router';
import { authSession } from '@/core/auth/authSession';

export default function AuthLayout() {
  const [temSessao, setTemSessao] = useState<boolean | null>(null);

  useEffect(() => {
    authSession.obter().then((user) => setTemSessao(user !== null));
  }, []);

  if (temSessao === null) {
    return (
      <View className="flex-1 bg-slate-50 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!temSessao) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

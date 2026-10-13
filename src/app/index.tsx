import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { authSession } from '@/core/auth/authSession';

export default function IndexScreen() {
  const [temSessao, setTemSessao] = useState<boolean | null>(null);

  // Sessão válida guardada entra direto; vencida cai no login.
  useEffect(() => {
    authSession.obter().then((user) => setTemSessao(user !== null));
  }, []);

  if (temSessao === null) {
    return (
      <View className="flex-1 bg-slate-900 justify-center items-center">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return <Redirect href={temSessao ? '/(auth)/(tabs)' : '/login'} />;
}

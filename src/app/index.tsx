import { Redirect } from 'expo-router';

export default function IndexScreen() {
  // Por padrão redireciona para a tela de login
  return <Redirect href="/login" />;
}

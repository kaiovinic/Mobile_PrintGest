import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, Pressable } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function Input({
  label,
  error,
  containerClassName = '',
  className = '',
  secureTextEntry,
  ...rest
}: InputProps) {
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  return (
    <View className={`mb-4 w-full ${containerClassName}`}>
      {label ? (
        <Text className="text-sm font-medium color-slate-700 mb-1.5">{label}</Text>
      ) : null}
      <View className="w-full">
        <TextInput
          placeholderTextColor="#94A3B8"
          secureTextEntry={secureTextEntry && !senhaVisivel}
          className={`bg-slate-50 border ${
            error ? 'border-red-500' : 'border-slate-300'
          } rounded-lg px-3.5 py-3 text-base color-slate-900 ${
            secureTextEntry ? 'pr-11' : ''
          } ${className}`}
          {...rest}
        />
        {secureTextEntry ? (
          <Pressable
            onPress={() => setSenhaVisivel((atual) => !atual)}
            accessibilityRole="button"
            accessibilityLabel={senhaVisivel ? 'Ocultar senha' : 'Mostrar senha'}
            hitSlop={8}
            className="absolute right-3 top-0 bottom-0 justify-center"
          >
            {senhaVisivel ? (
              <EyeOff size={18} color="#64748B" />
            ) : (
              <Eye size={18} color="#64748B" />
            )}
          </Pressable>
        ) : null}
      </View>
      {error ? <Text className="text-xs color-red-500 mt-1">{error}</Text> : null}
    </View>
  );
}

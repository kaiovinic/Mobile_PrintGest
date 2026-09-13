import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export function Input({ label, error, containerClassName = '', className = '', ...rest }: InputProps) {
  return (
    <View className={`mb-4 w-full ${containerClassName}`}>
      {label ? (
        <Text className="text-sm font-medium color-slate-700 mb-1.5">{label}</Text>
      ) : null}
      <TextInput
        placeholderTextColor="#94A3B8"
        className={`bg-slate-50 border ${
          error ? 'border-red-500' : 'border-slate-300'
        } rounded-lg px-3.5 py-3 text-base color-slate-900 ${className}`}
        {...rest}
      />
      {error ? <Text className="text-xs color-red-500 mt-1">{error}</Text> : null}
    </View>
  );
}

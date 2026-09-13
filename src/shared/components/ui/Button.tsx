import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
}

export function Button({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  className = '',
  onPress,
  ...rest
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return { container: 'bg-slate-200', text: 'text-slate-800' };
      case 'outline':
        return { container: 'bg-transparent border border-blue-600', text: 'text-blue-600' };
      case 'danger':
        return { container: 'bg-red-600', text: 'text-white' };
      case 'primary':
      default:
        return { container: 'bg-blue-600', text: 'text-white' };
    }
  };

  const colors = getVariantStyles();
  const isButtonDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={isButtonDisabled}
      onPress={onPress}
      className={`${colors.container} py-3.5 px-5 rounded-lg items-center justify-center ${
        isButtonDisabled ? 'opacity-60' : 'opacity-100'
      } ${className}`}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#2563EB' : '#FFFFFF'} size="small" />
      ) : (
        <Text className={`${colors.text} text-base font-semibold`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

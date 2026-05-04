import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import { colors } from '@core/theme/colors';
import { Typography } from '@core/theme/typography';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  style?: ViewStyle | ViewStyle[];
}

export const Button = ({
  title,
  loading,
  variant = 'primary',
  style,
  disabled,
  ...props
}: ButtonProps) => {
  const buttonStyle = [
    styles.base,
    variant === 'primary' && styles.primary,
    variant === 'secondary' && styles.secondary,
    variant === 'danger' && styles.danger,
    variant === 'outline' && styles.outline,
    disabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.text,
    variant === 'primary' && styles.primaryText,
    variant === 'secondary' && styles.secondaryText,
    variant === 'danger' && styles.dangerText,
    variant === 'outline' && styles.outlineText,
    disabled && styles.disabledText,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={loading || disabled}
      activeOpacity={0.7}
      {...props}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? colors.primary : colors.surface}
        />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primary: {
    backgroundColor: colors.primaryContainer,
  },
  secondary: {
    backgroundColor: colors.surfaceContainerHigh,
  },
  danger: {
    backgroundColor: colors.tertiaryContainer,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primaryContainer,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...Typography.labelLarge,
  },
  primaryText: {
    color: colors.onPrimaryContainer,
  },
  secondaryText: {
    color: colors.onSurface,
  },
  dangerText: {
    color: colors.onTertiaryContainer,
  },
  outlineText: {
    color: colors.primary,
  },
  disabledText: {
    opacity: 0.5,
  },
});

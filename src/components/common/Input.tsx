import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { colors } from '@core/theme/colors';
import { Typography } from '@core/theme/typography';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ label, error, containerStyle, ...props }, ref) => {
    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TextInput
          ref={ref}
          style={[styles.input, error && styles.inputError]}
          placeholderTextColor={colors.onSurfaceVariant}
          {...props}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    ...Typography.labelLarge,
    color: colors.onSurface,
    marginBottom: 6,
  },
  input: {
    ...Typography.bodyLarge,
    backgroundColor: colors.surfaceContainer,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.onSurface,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    ...Typography.bodyMedium,
    color: colors.error,
    marginTop: 4,
  },
});

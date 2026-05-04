import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@components/common/Button';
import { colors } from '@core/theme/colors';
import { Typography } from '@core/theme/typography';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({ icon, title, subtitle, actionLabel, onAction }: EmptyStateProps) => (
  <View style={styles.container}>
    {icon && <Text style={styles.icon}>{icon}</Text>}
    <Text style={styles.title}>{title}</Text>
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    {actionLabel && onAction && (
      <Button title={actionLabel} onPress={onAction} variant="outline" style={styles.button} />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    ...Typography.titleMedium,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});

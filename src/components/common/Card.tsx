import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@core/theme/colors';
import { Typography } from '@core/theme/typography';

interface CardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export const Card = ({ title, subtitle, children, style }: CardProps) => {
  return (
    <View style={[styles.card, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  title: {
    ...Typography.titleMedium,
    color: colors.onSurface,
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: colors.onSurfaceVariant,
    marginBottom: 8,
  },
});

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@core/theme/colors';
import { Typography } from '@core/theme/typography';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const SectionHeader = ({ title, actionLabel, onAction }: SectionHeaderProps) => (
  <View style={styles.row}>
    <Text style={styles.title}>{title}</Text>
    {actionLabel && onAction && (
      <TouchableOpacity onPress={onAction}>
        <Text style={styles.action}>{actionLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  title: {
    ...Typography.titleMedium,
    color: colors.onSurface,
  },
  action: {
    ...Typography.labelLarge,
    color: colors.primary,
  },
});

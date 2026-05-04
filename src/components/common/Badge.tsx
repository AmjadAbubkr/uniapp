import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors } from '@core/theme/colors';
import { Typography } from '@core/theme/typography';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

const VARIANT_COLORS = {
  success: { bg: 'rgba(76,175,80,0.15)', text: colors.success },
  warning: { bg: 'rgba(246,190,57,0.15)', text: colors.secondary },
  error: { bg: 'rgba(255,87,85,0.15)', text: colors.tertiaryContainer },
  info: { bg: 'rgba(133,207,255,0.15)', text: colors.primary },
  neutral: { bg: colors.surfaceContainerHigh, text: colors.onSurfaceVariant },
};

export const Badge = ({ label, variant = 'neutral' }: BadgeProps) => {
  const v = VARIANT_COLORS[variant];
  return (
    <Text style={[styles.badge, { backgroundColor: v.bg, color: v.text }]}>
      {label}
    </Text>
  );
};

const styles = StyleSheet.create({
  badge: {
    ...Typography.bodyMedium,
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
});

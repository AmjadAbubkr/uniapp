import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '@core/theme/colors';

interface FABProps {
  onPress: () => void;
  icon?: string;
  loading?: boolean;
}

export const FloatingActionButton = ({ onPress, icon = '+', loading }: FABProps) => (
  <TouchableOpacity
    style={styles.button}
    onPress={onPress}
    disabled={loading}
    activeOpacity={0.8}>
    {loading ? (
      <ActivityIndicator size="small" color={colors.onPrimaryContainer} />
    ) : (
      <Text style={styles.icon}>{icon}</Text>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  icon: {
    fontSize: 28,
    color: colors.onPrimaryContainer,
    fontWeight: '300',
    lineHeight: 32,
  },
});

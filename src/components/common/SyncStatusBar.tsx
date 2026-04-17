import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '@core/theme/colors';
import { Typography } from '@core/theme/typography';

export const SyncStatusBar = () => {
  // Placeholder for offline detection
  // TODO: Install @react-native-community/netinfo or implement native module
  const isConnected = true;

  if (isConnected) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={colors.primary} />
      <Text style={styles.text}>
        Offline Mode - Changes will sync when connected
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceContainerHigh,
    paddingVertical: 4,
    gap: 8,
  },
  text: {
    ...Typography.labelLarge,
    color: colors.onSurfaceVariant,
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@core/theme/colors';
import { Typography } from '@core/theme/typography';
import { Card } from '@components/common/Card';

interface DetailScreenProps {
  route: any;
  title: string;
}

const DetailScreen = ({ route, title }: DetailScreenProps) => {
  const itemId = route?.params?.teacherId || route?.params?.studentId || route?.params?.subjectId || '';

  return (
    <View style={styles.container}>
      <Card title={title} subtitle={`ID: ${itemId}`}>
        <Text style={styles.info}>Tap the back button to return.</Text>
        <Text style={styles.id}>ID: {itemId}</Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 16,
  },
  info: {
    ...Typography.bodyMedium,
    color: colors.onSurfaceVariant,
    marginTop: 8,
  },
  id: {
    ...Typography.bodyMedium,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
});

export default DetailScreen;

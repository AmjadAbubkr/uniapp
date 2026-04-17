import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors } from '@core/theme/colors';
import { backupService } from '@data/admin';

const BackupsScreen = () => {
  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    try {
      const data = await backupService.getBackups();
      setBackups(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    setLoading(true);
    try {
      await backupService.createBackup();
      Alert.alert('Success', 'Backup created');
      loadBackups();
    } catch (error) {
      Alert.alert('Error', 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Backups</Text>
      <Button
        title="Create Backup"
        onPress={handleCreateBackup}
        color={colors.primary}
      />

      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={backups}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.date}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
          )}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text style={styles.empty}>No backups</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface, padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.onSurface,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.surfaceContainerHigh,
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  date: { fontSize: 14, color: colors.onSurfaceVariant },
  empty: { textAlign: 'center', color: colors.onSurfaceVariant, marginTop: 24 },
});

export default BackupsScreen;

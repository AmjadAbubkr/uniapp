import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { colors } from '@core/theme/colors';
import { auditLogService } from '@data/admin';
import { AuditLog } from '@domain/types';

const AuditLogsScreen = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await auditLogService.getAll(50);
      setLogs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audit Logs</Text>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={logs}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.action}>{item.action}</Text>
              <Text style={styles.target}>Target: {item.targetId}</Text>
              <Text style={styles.date}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
          )}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text style={styles.empty}>No logs</Text>}
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
    marginBottom: 8,
  },
  action: { fontSize: 16, fontWeight: 'bold', color: colors.onSurface },
  target: { fontSize: 14, color: colors.onSurfaceVariant },
  date: { fontSize: 12, color: colors.onSurfaceVariant, marginTop: 4 },
  empty: { textAlign: 'center', color: colors.onSurfaceVariant, marginTop: 24 },
});

export default AuditLogsScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { colors } from '@core/theme/colors';
import { useAuthStore } from '@store/authStore';
import { auditLogService, backupService } from '@data/admin';

const AdminDashboardScreen = ({ navigation }: any) => {
  const { user, logout } = useAuthStore();
  const [logsCount, setLogsCount] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const logs = await auditLogService.getAll(100);
      setLogsCount(logs.length);
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.welcome}>Welcome, {user.name}</Text>

      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Text style={styles.stat_number}>{logsCount}</Text>
          <Text style={styles.stat_label}>Audit Logs</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <Button
          title="Audit Logs"
          onPress={() => navigation.navigate('AuditLogs')}
          color={colors.primary}
        />
        <Button
          title="Backups"
          onPress={() => navigation.navigate('Backups')}
          color={colors.primary}
        />
        <Button title="Logout" onPress={logout} color={colors.error} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface, padding: 16 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.onSurface,
    marginBottom: 4,
  },
  welcome: { fontSize: 16, color: colors.onSurfaceVariant, marginBottom: 24 },
  stats: { flexDirection: 'row', marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerHigh,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  stat_number: { fontSize: 24, fontWeight: 'bold', color: colors.primary },
  stat_label: { fontSize: 12, color: colors.onSurfaceVariant },
  menu: { gap: 12 },
});

export default AdminDashboardScreen;

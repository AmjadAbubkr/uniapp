import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { colors } from '@core/theme/colors';
import { useAuthStore } from '@store/authStore';
import { AnnouncementService } from '@data/services';
import { Announcement } from '@domain/types';
import { Card } from '@components/common/Card';
import { EmptyState } from '@components/common/EmptyState';
import { FloatingActionButton } from '@components/common/FloatingActionButton';

const AnnouncementsScreen = ({ navigation }: any) => {
  const { user } = useAuthStore();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAnnouncements = useCallback(async () => {
    if (!user) return;
    try {
      const data = await AnnouncementService.getByFaculty(user.facultyId);
      setAnnouncements(data.filter(a => a.expiresAt > Date.now()));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  if (!user) return null;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={announcements}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card title={item.type} subtitle={item.message}>
            <Text style={styles.date}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </Card>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <EmptyState
            icon="📢"
            title="No Announcements"
            subtitle="Create your first announcement"
            actionLabel="Create"
            onAction={() => navigation.navigate('CreateAnnouncement')}
          />
        }
      />
      <FloatingActionButton onPress={() => navigation.navigate('CreateAnnouncement')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surface },
  list: { padding: 16, paddingBottom: 100 },
  date: { fontSize: 12, color: colors.onSurfaceVariant, marginTop: 4 },
});

export default AnnouncementsScreen;

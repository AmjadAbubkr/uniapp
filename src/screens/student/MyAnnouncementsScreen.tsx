import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { colors } from '@core/theme/colors';
import { useAuthStore } from '@store/authStore';
import { announcementService } from '@data/teacher';
import { Announcement } from '@domain/types';

const MyAnnouncementsScreen = () => {
  const { user } = useAuthStore();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const data = await announcementService.getAll();
      setAnnouncements(
        data.filter(
          a =>
            (a.facultyId === user?.facultyId || !a.facultyId) &&
            a.expiresAt > Date.now(),
        ),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Announcements</Text>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={announcements}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.date}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          )}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Text style={styles.empty}>No announcements</Text>
          }
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
  message: { fontSize: 16, color: colors.onSurface, marginBottom: 8 },
  date: { fontSize: 12, color: colors.onSurfaceVariant },
  empty: { textAlign: 'center', color: colors.onSurfaceVariant, marginTop: 24 },
});

export default MyAnnouncementsScreen;

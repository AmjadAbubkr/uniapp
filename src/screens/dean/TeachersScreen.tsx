import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert } from 'react-native';
import { colors } from '@core/theme/colors';
import { useAuthStore } from '@store/authStore';
import { userManagementService } from '@data/dean';
import { User } from '@domain/types';

const TeachersScreen = ({ navigation }: any) => {
  const { user } = useAuthStore();
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    if (!user?.facultyId) return;
    try {
      const data = await userManagementService.getTeachers(user.facultyId);
      setTeachers(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.email}>{item.email}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teachers</Text>
      <FlatList
        data={teachers}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No teachers found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 16,
  },
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
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.onSurface,
  },
  email: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
  },
  empty: {
    textAlign: 'center',
    color: colors.onSurfaceVariant,
    marginTop: 24,
  },
});

export default TeachersScreen;

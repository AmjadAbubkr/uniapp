import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { colors } from '@core/theme/colors';
import { useAuthStore } from '@store/authStore';
import { subjectService } from '@data/dean';
import { Subject } from '@domain/types';

const SubjectsScreen = () => {
  const { user } = useAuthStore();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    if (!user?.facultyId) return;
    try {
      const data = await subjectService.getByFaculty(user.facultyId);
      setSubjects(data);
    } catch (error) {
      Alert.alert('Error', 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subjects</Text>
      <FlatList
        data={subjects}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.title}</Text>
            <Text style={styles.detail}>{item.scheduleText}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.empty}>No subjects</Text>}
      />
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
  name: { fontSize: 16, fontWeight: 'bold', color: colors.onSurface },
  detail: { fontSize: 14, color: colors.onSurfaceVariant },
  empty: { textAlign: 'center', color: colors.onSurfaceVariant, marginTop: 24 },
});

export default SubjectsScreen;

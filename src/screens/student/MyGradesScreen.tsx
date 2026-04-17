import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors } from '@core/theme/colors';
import { useAuthStore } from '@store/authStore';
import { gradeService } from '@data/teacher';
import { Grade } from '@domain/types';

const MyGradesScreen = () => {
  const { user } = useAuthStore();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGrades();
  }, []);

  const loadGrades = async () => {
    if (!user?.id) return;
    try {
      const data = await gradeService.getByStudent(user.id);
      setGrades(data.filter(g => g.isPublished));
    } catch (error) {
      Alert.alert('Error', 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (grade: Grade) =>
    (((grade.testScore + grade.examScore) / 40) * 100).toFixed(1);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Grades</Text>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={grades}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.subject}>Subject: {item.subjectId}</Text>
              <Text style={styles.score}>Test: {item.testScore}/20</Text>
              <Text style={styles.score}>Exam: {item.examScore}/20</Text>
              <Text style={styles.total}>Total: {calculateTotal(item)}%</Text>
            </View>
          )}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Text style={styles.empty}>No published grades</Text>
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
  subject: { fontSize: 16, fontWeight: 'bold', color: colors.onSurface },
  score: { fontSize: 14, color: colors.onSurfaceVariant },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 8,
  },
  empty: { textAlign: 'center', color: colors.onSurfaceVariant, marginTop: 24 },
});

export default MyGradesScreen;

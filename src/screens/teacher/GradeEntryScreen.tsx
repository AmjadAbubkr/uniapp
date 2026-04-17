import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  FlatList,
} from 'react-native';
import { colors } from '@core/theme/colors';
import { useAuthStore } from '@store/authStore';
import { gradeService } from '@data/teacher';
import { Grade } from '@domain/types';

const GradeEntryScreen = () => {
  const { user } = useAuthStore();
  const [studentId, setStudentId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [testScore, setTestScore] = useState('');
  const [examScore, setExamScore] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveGrade = async () => {
    if (!studentId || !subjectId || !testScore || !examScore) {
      Alert.alert('Error', 'Fill all fields');
      return;
    }
    setLoading(true);
    try {
      await gradeService.setGrade({
        studentId,
        subjectId,
        teacherId: user?.id || '',
        academicYearId: '',
        semesterId: '',
        testScore: parseFloat(testScore),
        examScore: parseFloat(examScore),
        isPublished: false,
        conflictFlag: false,
        updatedBy: user?.id || '',
      });
      Alert.alert('Success', 'Grade saved');
      setStudentId('');
      setSubjectId('');
      setTestScore('');
      setExamScore('');
    } catch (error) {
      Alert.alert('Error', 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grade Entry</Text>
      <TextInput
        style={styles.input}
        placeholder="Student ID"
        value={studentId}
        onChangeText={setStudentId}
      />
      <TextInput
        style={styles.input}
        placeholder="Subject ID"
        value={subjectId}
        onChangeText={setSubjectId}
      />
      <TextInput
        style={styles.input}
        placeholder="Test Score (0-20)"
        value={testScore}
        onChangeText={setTestScore}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Exam Score (0-20)"
        value={examScore}
        onChangeText={setExamScore}
        keyboardType="numeric"
      />
      <Button title="Save Grade" onPress={handleSaveGrade} disabled={loading} />
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
  input: {
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: colors.onSurface,
  },
});

export default GradeEntryScreen;

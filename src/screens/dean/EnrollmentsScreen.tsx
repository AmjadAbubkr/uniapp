import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, TextInput } from 'react-native';
import { colors } from '@core/theme/colors';
import { useAuthStore } from '@store/authStore';
import { EnrollmentService } from '@data/services';

const EnrollmentsScreen = () => {
  const { user } = useAuthStore();
  const [studentId, setStudentId] = useState('');
  const [subjectId, setSubjectId] = useState('');

  const handleEnroll = async () => {
    if (!studentId || !subjectId) {
      Alert.alert('Error', 'Enter student and subject ID');
      return;
    }
    try {
      await EnrollmentService.create({
        studentId,
        subjectId,
        academicYearId: '',
        semesterId: '',
      });
      Alert.alert('Success', 'Student enrolled');
      setStudentId('');
      setSubjectId('');
    } catch {
      Alert.alert('Error', 'Failed to enroll');
    }
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enrollments</Text>
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
      <Button title="Enroll Student" onPress={handleEnroll} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.onSurface, marginBottom: 16 },
  input: { borderWidth: 1, borderColor: colors.outline, borderRadius: 8, padding: 12, marginBottom: 12, color: colors.onSurface },
});

export default EnrollmentsScreen;

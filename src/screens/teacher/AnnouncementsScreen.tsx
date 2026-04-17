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
import { announcementService } from '@data/teacher';

const AnnouncementsScreen = () => {
  const { user } = useAuthStore();
  const [message, setMessage] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!message) {
      Alert.alert('Error', 'Enter message');
      return;
    }
    setLoading(true);
    try {
      await announcementService.create({
        type: 'subject',
        subjectId: subjectId || null,
        facultyId: user?.facultyId || null,
        teacherId: user?.id || '',
        message,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      Alert.alert('Success', 'Announcement created');
      setMessage('');
      setSubjectId('');
    } catch (error) {
      Alert.alert('Error', 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Announcements</Text>
      <TextInput
        style={styles.input}
        placeholder="Subject ID (optional)"
        value={subjectId}
        onChangeText={setSubjectId}
      />
      <TextInput
        style={styles.input}
        multiline
        placeholder="Message"
        value={message}
        onChangeText={setMessage}
      />
      <Button
        title="Create Announcement"
        onPress={handleCreate}
        disabled={loading}
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
  input: {
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: colors.onSurface,
    minHeight: 80,
  },
});

export default AnnouncementsScreen;

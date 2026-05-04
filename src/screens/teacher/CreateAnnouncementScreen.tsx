import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useAuthStore } from '@store/authStore';
import { AnnouncementService } from '@data/services';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';
import { colors } from '@core/theme/colors';
import { Typography } from '@core/theme/typography';

const CreateAnnouncementScreen = ({ route, navigation }: any) => {
  const { user } = useAuthStore();
  const prefillSubjectId = route?.params?.subjectId ?? '';
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'subject' | 'faculty' | 'university'>(
    prefillSubjectId ? 'subject' : 'faculty',
  );
  const [subjectId, setSubjectId] = useState(prefillSubjectId);
  const [expiresInDays, setExpiresInDays] = useState('7');
  const [isSaving, setIsSaving] = useState(false);

  const handleCreate = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Message is required');
      return;
    }
    if (!user) {
      Alert.alert('Error', 'Not authenticated. Please log in again.');
      return;
    }
    setIsSaving(true);
    try {
      const days = parseInt(expiresInDays, 10) || 7;
      await AnnouncementService.create({
        type,
        subjectId: type === 'subject' ? subjectId.trim() || null : null,
        facultyId: user.facultyId,
        teacherId: user.id,
        message: message.trim(),
        expiresAt: Date.now() + days * 24 * 60 * 60 * 1000,
      });
      Alert.alert('Success', 'Announcement created', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.typeRow}>
        {(['subject', 'faculty', 'university'] as const).map(t => (
          <Text
            key={t}
            style={[styles.typeOption, type === t && styles.typeOptionActive]}
            onPress={() => setType(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </Text>
        ))}
      </View>

      {type === 'subject' && (
        <Input
          label="Subject ID"
          value={subjectId}
          onChangeText={setSubjectId}
          placeholder="Enter subject ID"
        />
      )}

      <Input
        label="Message"
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={5}
        placeholder="Write your announcement..."
      />

      <Input
        label="Expires in (days)"
        value={expiresInDays}
        onChangeText={setExpiresInDays}
        keyboardType="number-pad"
        placeholder="7"
      />

      <Button
        title="Create Announcement"
        loading={isSaving}
        onPress={handleCreate}
        style={styles.createButton}
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
  typeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  typeOption: {
    ...Typography.labelLarge,
    color: colors.onSurfaceVariant,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainerLow,
    overflow: 'hidden',
  },
  typeOptionActive: {
    color: colors.onPrimaryContainer,
    backgroundColor: colors.primaryContainer,
  },
  createButton: {
    marginTop: 16,
  },
});

export default CreateAnnouncementScreen;

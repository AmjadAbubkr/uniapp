import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors } from '@core/theme/colors';
import { parseCSV, importUsersFromCSV, CSVRow } from '@core/utils/csvParser';
import { useAuthStore } from '@store/authStore';

const CSVImportScreen = () => {
  const [csvContent, setCsvContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  const handleImport = async () => {
    if (!csvContent.trim()) {
      Alert.alert('Error', 'Please paste CSV content');
      return;
    }

    if (!user?.facultyId) {
      Alert.alert('Error', 'No faculty assigned');
      return;
    }

    setLoading(true);
    try {
      const rows = parseCSV(csvContent);
      if (rows.length === 0) {
        Alert.alert('Error', 'No valid rows found in CSV');
        return;
      }

      const result = await importUsersFromCSV(rows, user.facultyId, user.id);
      Alert.alert(
        'Import Complete',
        `Success: ${result.success}, Failed: ${result.failed}`,
      );
      setCsvContent('');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const exampleCSV = `name,email,role
John Doe,john@test.com,student
Jane Doe,jane@test.com,student`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CSV Import</Text>
      <Text style={styles.subtitle}>
        Paste CSV with columns: name, email, role
      </Text>

      <TextInput
        style={styles.input}
        multiline
        placeholder={exampleCSV}
        value={csvContent}
        onChangeText={setCsvContent}
      />

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <Button title="Import Users" onPress={handleImport} />
      )}
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 8,
    padding: 12,
    minHeight: 200,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
});

export default CSVImportScreen;

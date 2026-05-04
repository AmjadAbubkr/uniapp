import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFacultyStore } from '@store/facultyStore';
import { UserService } from '@data/services';
import { User } from '@domain/types';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';
import { Card } from '@components/common/Card';
import { AppModal } from '@components/common/AppModal';
import { PickerModal, PickerItem } from '@components/common/PickerModal';
import { FloatingActionButton } from '@components/common/FloatingActionButton';
import { EmptyState } from '@components/common/EmptyState';
import { Badge } from '@components/common/Badge';
import { SearchBar } from '@components/common/SearchBar';
import { colors } from '@core/theme/colors';
import { Typography } from '@core/theme/typography';
import { UserRole } from '@core/constants/roles';
import { withTimeout, unwrapResult } from '@core/utils/async';

const ManageFacultiesScreen = () => {
  const { faculties, fetchFaculties, createFaculty, deleteFaculty } = useFacultyStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDeans, setIsLoadingDeans] = useState(false);
  const [deans, setDeans] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeanPicker, setShowDeanPicker] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDeanId, setNewDeanId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = useCallback(async () => {
    await fetchFaculties();
    setIsLoading(false);
  }, [fetchFaculties]);

  const loadDeans = useCallback(async () => {
    setIsLoadingDeans(true);
    const data = unwrapResult(await withTimeout(UserService.getAllDeans(), 8000));
    setDeans(data ?? []);
    setIsLoadingDeans(false);
  }, []);

  useEffect(() => {
    loadData();
    loadDeans();
  }, [loadData, loadDeans]);

  const handleCreate = async () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'Faculty name is required');
      return;
    }
    try {
      await createFaculty(newName.trim(), newDeanId.trim());
      setNewName('');
      setNewDeanId('');
      setShowDeanPicker(false);
      setShowModal(false);
      setTimeout(() => Alert.alert('Success', 'Faculty created successfully'), 300);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Confirm', `Delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          useFacultyStore.setState(s => ({
            faculties: s.faculties.filter(f => f.id !== id),
          }));
          deleteFaculty(id).catch(() => fetchFaculties());
        },
      },
    ]);
  };

  const getDeanName = (deanId: string) => {
    if (!deanId) return 'Unassigned';
    return deans.find(d => d.id === deanId)?.name ?? deanId;
  };

  const deanPickerItems: PickerItem[] = deans
    .filter(d => d.role === UserRole.DEAN)
    .map(d => ({ id: d.id, label: d.name, subtitle: d.isActive ? 'Active' : 'Inactive' }));

  const filteredFaculties = faculties.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search faculties..." />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredFaculties}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Card title={item.name} subtitle={`Dean: ${getDeanName(item.deanId)}`}>
              <View style={styles.cardRow}>
                <Badge
                  label={item.deanId ? 'Assigned' : 'No Dean'}
                  variant={item.deanId ? 'info' : 'neutral'}
                />
                <TouchableOpacity onPress={() => handleDelete(item.id, item.name)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </Card>
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              icon="🏛"
              title="No Faculties"
              subtitle="Create your first faculty to get started"
              actionLabel="Add Faculty"
              onAction={() => setShowModal(true)}
            />
          }
        />
      )}

      <FloatingActionButton onPress={() => setShowModal(true)} />

      <AppModal visible={showModal} title="New Faculty" onClose={() => setShowModal(false)}>
        <Input label="Faculty Name" value={newName} onChangeText={setNewName} placeholder="e.g. Faculty of Science" />
        <Text style={styles.pickerLabel}>Dean</Text>
        <TouchableOpacity
          style={styles.pickerTrigger}
          onPress={() => {
            if (isLoadingDeans) loadDeans();
            else setShowDeanPicker(true);
          }}>
          <Text style={styles.pickerValue}>
            {isLoadingDeans
              ? 'Loading deans...'
              : newDeanId
                ? deans.find(d => d.id === newDeanId)?.name ?? 'Select dean'
                : 'Select dean (optional)'}
          </Text>
        </TouchableOpacity>
        <Button title="Create" onPress={handleCreate} style={{ marginTop: 16 }} />
      </AppModal>

      <PickerModal
        visible={showDeanPicker}
        title="Select Dean"
        items={deanPickerItems}
        selectedId={newDeanId}
        onSelect={(id) => { setNewDeanId(id); setShowDeanPicker(false); }}
        onClose={() => setShowDeanPicker(false)}
        emptyMessage="No deans available"
        allowEmpty
        emptyLabel="No dean (optional)"
        isLoading={isLoadingDeans}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  searchBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  list: {
    padding: 16,
    paddingTop: 4,
    paddingBottom: 100,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  deleteText: {
    ...Typography.labelLarge,
    color: colors.tertiaryContainer,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerLabel: {
    ...Typography.labelLarge,
    color: colors.onSurface,
    marginBottom: 6,
  },
  pickerTrigger: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    marginBottom: 16,
  },
  pickerValue: {
    ...Typography.bodyLarge,
    color: colors.onSurface,
  },
});

export default ManageFacultiesScreen;

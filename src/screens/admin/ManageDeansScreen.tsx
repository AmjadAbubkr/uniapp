import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Clipboard } from '@core/utils/clipboard';
import { UserService } from '@data/services';
import { FacultyService } from '@data/services';
import { User, Faculty, PendingUser } from '@domain/types';
import { Input } from '@components/common/Input';
import { Button } from '@components/common/Button';
import { Card } from '@components/common/Card';
import { AppModal } from '@components/common/AppModal';
import { PickerModal, PickerItem } from '@components/common/PickerModal';
import { FloatingActionButton } from '@components/common/FloatingActionButton';
import { SectionHeader } from '@components/common/SectionHeader';
import { EmptyState } from '@components/common/EmptyState';
import { Badge } from '@components/common/Badge';
import { SearchBar } from '@components/common/SearchBar';
import { colors } from '@core/theme/colors';
import { Typography } from '@core/theme/typography';
import { UserRole } from '@core/constants/roles';
import { withTimeout, unwrapResult } from '@core/utils/async';

const ManageDeansScreen = () => {
  const [deans, setDeans] = useState<User[]>([]);
  const [pending, setPending] = useState<PendingUser[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [isLoadingDeans, setIsLoadingDeans] = useState(true);
  const [isLoadingFaculties, setIsLoadingFaculties] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFacultyPicker, setShowFacultyPicker] = useState(false);
  const [deanName, setDeanName] = useState('');
  const [deanEmail, setDeanEmail] = useState('');
  const [selectedFacultyId, setSelectedFacultyId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const loadDeans = useCallback(async () => {
    setIsLoadingDeans(true);
    const [deansR, pendingR] = await Promise.all([
      withTimeout(UserService.getAllDeans(), 8000),
      withTimeout(UserService.getAllPendingUsers(), 8000),
    ]);
    const deansData = unwrapResult(deansR);
    const pendingData = unwrapResult(pendingR);
    setDeans(deansData ?? []);
    setPending((pendingData ?? []).filter(p => p.role === UserRole.DEAN));
    setIsLoadingDeans(false);
  }, []);

  const loadFaculties = useCallback(async () => {
    setIsLoadingFaculties(true);
    const data = unwrapResult(await withTimeout(FacultyService.getAll(), 8000));
    setFaculties(data ?? []);
    setIsLoadingFaculties(false);
  }, []);

  useEffect(() => {
    loadDeans();
    loadFaculties();
  }, [loadDeans, loadFaculties]);

  const handleCreateDean = async () => {
    if (!deanName.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    try {
        const result = await UserService.createPendingUser(
          {
            name: deanName.trim(),
            email: deanEmail.trim(),
            role: UserRole.DEAN,
            facultyId: selectedFacultyId,
            createdBy: '',
          },
          '',
        );
      setDeanName('');
      setDeanEmail('');
      setSelectedFacultyId('');
      setShowFacultyPicker(false);
      setShowModal(false);
      setTimeout(() => Alert.alert('Success', `Dean invitation created. Code: ${result.invitationCode}`), 300);
      loadDeans();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const handleToggleActive = (uid: string, currentActive: boolean) => {
    Alert.alert(
      'Confirm',
      currentActive ? 'Deactivate this dean?' : 'Activate this dean?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            setDeans(prev => prev.map(d => d.id === uid ? { ...d, isActive: !currentActive } : d));
            UserService.toggleActive(uid, !currentActive).catch(() => loadDeans());
          },
        },
      ],
    );
  };

  const copyCode = (code: string) => {
    Clipboard.setString(code);
    Alert.alert('Copied', `Invitation code "${code}" copied to clipboard`);
  };

  const handleCancelPending = (id: string) => {
    Alert.alert('Confirm', 'Cancel this pending invitation?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          setPending(prev => prev.filter(p => p.id !== id));
          UserService.deletePendingUser(id).catch(() => loadDeans());
        },
      },
    ]);
  };

  const getFacultyName = (facultyId: string) => {
    return faculties.find(f => f.id === facultyId)?.name ?? 'Unknown';
  };

  const facultyPickerItems: PickerItem[] = faculties.map(f => ({
    id: f.id,
    label: f.name,
  }));

  const filteredDeans = deans.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search deans..." />
      </View>

      {pending.length > 0 && !isLoadingDeans && (
        <View style={styles.section}>
          <SectionHeader
            title={`Pending Invitations (${pending.length})`}
          actionLabel="Dismiss All"
          onAction={() => {
            const ids = pending.map(p => p.id);
            setPending([]);
            Promise.all(ids.map(id => UserService.deletePendingUser(id))).catch(() => loadDeans());
          }}
          />
          {pending.map(p => (
            <Card key={p.id} title={p.name} subtitle={getFacultyName(p.facultyId)}>
              <View style={styles.invitationRow}>
                <View style={styles.codeContainer}>
                  <Text style={styles.codeLabel}>Code:</Text>
                  <Text style={styles.codeValue}>{p.invitationCode || p.id}</Text>
                </View>
                <TouchableOpacity style={styles.copyButton} onPress={() => copyCode(p.invitationCode || p.id)}>
                  <Text style={styles.copyText}>Copy Code</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleCancelPending(p.id)}>
                  <Text style={styles.deleteText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </View>
      )}

      {isLoadingDeans ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredDeans}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Card title={item.name} subtitle={getFacultyName(item.facultyId)}>
              <View style={styles.cardRow}>
                <Badge
                  label={item.isActive ? 'Active' : 'Inactive'}
                  variant={item.isActive ? 'success' : 'error'}
                />
                <TouchableOpacity onPress={() => handleToggleActive(item.id, item.isActive)}>
                  <Text style={styles.actionText}>
                    {item.isActive ? 'Deactivate' : 'Activate'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              icon="🎓"
              title="No Deans"
              subtitle="Create a dean invitation to get started"
              actionLabel="Add Dean"
              onAction={() => setShowModal(true)}
            />
          }
        />
      )}

      <FloatingActionButton onPress={() => setShowModal(true)} />

      <AppModal visible={showModal} title="Add Dean" onClose={() => setShowModal(false)}>
        <Input label="Name" value={deanName} onChangeText={setDeanName} placeholder="Full name" />
        <Input
          label="Email"
          value={deanEmail}
          onChangeText={setDeanEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="dean@university.edu"
        />
        <Text style={styles.pickerLabel}>Faculty</Text>
        <TouchableOpacity
          style={styles.pickerTrigger}
          onPress={() => {
            if (isLoadingFaculties) loadFaculties();
            else setShowFacultyPicker(true);
          }}>
          <Text style={styles.pickerValue}>
            {isLoadingFaculties
              ? 'Loading faculties...'
              : selectedFacultyId
                ? faculties.find(f => f.id === selectedFacultyId)?.name ?? 'Select faculty'
                : 'Select faculty'}
          </Text>
        </TouchableOpacity>
        <Button title="Create Invitation" onPress={handleCreateDean} style={{ marginTop: 16 }} />
      </AppModal>

      <PickerModal
        visible={showFacultyPicker}
        title="Select Faculty"
        items={facultyPickerItems}
        selectedId={selectedFacultyId}
        onSelect={(id) => { setSelectedFacultyId(id); setShowFacultyPicker(false); }}
        onClose={() => setShowFacultyPicker(false)}
        emptyMessage="No faculties available"
        isLoading={isLoadingFaculties}
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
  section: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  list: {
    padding: 16,
    paddingTop: 4,
    paddingBottom: 100,
  },
  invitationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  codeLabel: {
    ...Typography.bodyMedium,
    color: colors.onSurfaceVariant,
  },
  codeValue: {
    ...Typography.labelLarge,
    color: colors.primary,
    fontFamily: 'monospace',
  },
  copyButton: {
    backgroundColor: 'rgba(133,207,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  copyText: {
    ...Typography.labelLarge,
    color: colors.primary,
    fontSize: 12,
  },
  deleteText: {
    ...Typography.labelLarge,
    color: colors.tertiaryContainer,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  actionText: {
    ...Typography.labelLarge,
    color: colors.primary,
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

export default ManageDeansScreen;

import React from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Button } from '@components/common/Button';
import { colors } from '@core/theme/colors';
import { Typography } from '@core/theme/typography';

export interface PickerItem {
  id: string;
  label: string;
  subtitle?: string;
}

interface PickerModalProps {
  visible: boolean;
  title: string;
  items: PickerItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
  emptyMessage?: string;
  allowEmpty?: boolean;
  emptyLabel?: string;
  isLoading?: boolean;
}

export const PickerModal = ({
  visible,
  title,
  items,
  selectedId,
  onSelect,
  onClose,
  emptyMessage = 'No items available',
  allowEmpty = false,
  emptyLabel = 'None',
  isLoading = false,
}: PickerModalProps) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.overlay}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <ScrollView style={styles.list} keyboardShouldPersistTaps="handled">
            {allowEmpty && (
              <TouchableOpacity
                style={[styles.item, !selectedId && styles.itemSelected]}
                onPress={() => onSelect('')}>
                <Text style={[styles.itemText, !selectedId && styles.itemTextSelected]}>
                  {emptyLabel}
                </Text>
              </TouchableOpacity>
            )}
            {items.map(item => (
              <TouchableOpacity
                key={item.id}
                style={[styles.item, selectedId === item.id && styles.itemSelected]}
                onPress={() => onSelect(item.id)}>
                <Text style={[styles.itemText, selectedId === item.id && styles.itemTextSelected]}>
                  {item.label}
                </Text>
                {item.subtitle && (
                  <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                )}
              </TouchableOpacity>
            ))}
            {items.length === 0 && !allowEmpty && (
              <Text style={styles.emptyText}>{emptyMessage}</Text>
            )}
          </ScrollView>
        )}

        <Button title="Cancel" variant="outline" onPress={onClose} style={styles.cancelBtn} />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    ...Typography.titleMedium,
    color: colors.onSurface,
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    ...Typography.titleMedium,
    color: colors.onSurfaceVariant,
  },
  loading: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  list: {
    maxHeight: 320,
    marginBottom: 12,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 2,
  },
  itemSelected: {
    backgroundColor: colors.primaryContainer,
  },
  itemText: {
    ...Typography.bodyLarge,
    color: colors.onSurface,
  },
  itemTextSelected: {
    color: colors.onPrimaryContainer,
    fontWeight: '600',
  },
  itemSubtitle: {
    ...Typography.bodyMedium,
    color: colors.onSurfaceVariant,
    marginTop: 2,
    fontSize: 12,
  },
  emptyText: {
    ...Typography.bodyMedium,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    paddingVertical: 24,
  },
  cancelBtn: {
    marginTop: 4,
  },
});

import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { Typography } from './typography';

export const formStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  heading: {
    ...Typography.headlineSmall,
    color: colors.onSurface,
    marginBottom: 16,
  },
  label: {
    ...Typography.labelLarge,
    color: colors.onSurface,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: colors.onSurface,
    ...Typography.bodyMedium,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    ...Typography.labelLarge,
    color: colors.onPrimary,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  logoutText: {
    ...Typography.labelLarge,
    color: colors.error,
  },
  greeting: {
    ...Typography.headlineMedium,
    color: colors.onSurface,
    marginBottom: 4,
  },
  roleBadge: {
    ...Typography.labelLarge,
    color: colors.primary,
    marginBottom: 24,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    ...Typography.titleMedium,
    color: colors.onSurface,
    marginBottom: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    ...Typography.titleMedium,
    color: colors.onSurface,
  },
  cardDesc: {
    ...Typography.bodySmall,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  emptyText: {
    ...Typography.bodySmall,
    color: colors.onSurfaceVariant,
    marginBottom: 16,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  typeOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainerLow,
    overflow: 'hidden',
  },
  typeOptionActive: {
    backgroundColor: colors.primaryContainer,
  },
  typeOptionText: {
    ...Typography.labelLarge,
    color: colors.onSurfaceVariant,
  },
  typeOptionTextActive: {
    color: colors.onPrimaryContainer,
  },
  contentInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  facultyRow: {
    maxHeight: 50,
    marginBottom: 16,
  },
  facultyOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainerLow,
    marginRight: 8,
  },
  facultyOptionActive: {
    backgroundColor: colors.primaryContainer,
  },
  facultyOptionText: {
    ...Typography.labelLarge,
    color: colors.onSurfaceVariant,
  },
  facultyOptionTextActive: {
    color: colors.onPrimaryContainer,
  },
});

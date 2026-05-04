import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from '@components/common/Button';
import { colors } from '@core/theme/colors';
import { Typography } from '@core/theme/typography';
import { UserRole, ROLE_DISPLAY_NAMES } from '@core/constants/roles';
import { useAuthStore } from '@store/authStore';
import { User } from '@domain/types';

const ROLE_CONFIG = [
  {
    role: UserRole.ROOT_ADMIN,
    color: colors.roleAdmin,
    icon: '🛡',
    description: 'Full system access',
  },
  {
    role: UserRole.DEAN,
    color: colors.roleDean,
    icon: '🏛',
    description: 'Faculty management',
  },
  {
    role: UserRole.TEACHER,
    color: colors.roleTeacher,
    icon: '👨‍🏫',
    description: 'Grades & announcements',
  },
  {
    role: UserRole.STUDENT,
    color: colors.roleStudent,
    icon: '🎓',
    description: 'View grades & announcements',
  },
];

const DevRolePickerScreen = () => {
  const { setUser, logout } = useAuthStore();

  const handleRolePick = (role: UserRole) => {
    const devUser: User = {
      id: 'dev-001',
      name: 'Developer',
      role,
      facultyId: 'dev-faculty',
      isActive: true,
      createdAt: Date.now(),
    };
    setUser(devUser);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.devBadge}>
          <Text style={styles.devBadgeText}>DEV</Text>
        </View>
        <Text style={styles.title}>Developer Mode</Text>
        <Text style={styles.subtitle}>Choose a role to explore</Text>
      </View>

      <View style={styles.cardsContainer}>
        {ROLE_CONFIG.map(({ role, color, icon, description }) => (
          <TouchableOpacity
            key={role}
            style={styles.roleCard}
            onPress={() => handleRolePick(role)}
            activeOpacity={0.7}>
            <View style={[styles.roleCardAccent, { backgroundColor: color }]} />
            <View style={styles.roleCardContent}>
              <Text style={styles.roleIcon}>{icon}</Text>
              <View style={styles.roleTextContainer}>
                <Text style={[styles.roleName, { color }]}>{ROLE_DISPLAY_NAMES[role].en}</Text>
                <Text style={styles.roleDescription}>{description}</Text>
              </View>
              <Text style={[styles.roleArrow, { color }]}>→</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        title="Logout"
        variant="outline"
        onPress={logout}
        style={styles.logoutButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  devBadge: {
    backgroundColor: 'rgba(133,207,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  devBadgeText: {
    ...Typography.labelLarge,
    color: colors.primary,
    fontSize: 12,
    letterSpacing: 2,
  },
  title: {
    ...Typography.titleLarge,
    color: colors.onSurface,
  },
  subtitle: {
    ...Typography.bodyMedium,
    color: colors.onSurfaceVariant,
    marginTop: 8,
  },
  cardsContainer: {
    width: '100%',
    gap: 12,
  },
  roleCard: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: 12,
    overflow: 'hidden',
  },
  roleCardAccent: {
    height: 3,
    width: '100%',
  },
  roleCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  roleIcon: {
    fontSize: 28,
  },
  roleTextContainer: {
    flex: 1,
  },
  roleName: {
    ...Typography.titleMedium,
    fontWeight: '600',
  },
  roleDescription: {
    ...Typography.bodyMedium,
    color: colors.onSurfaceVariant,
    marginTop: 2,
    fontSize: 12,
  },
  roleArrow: {
    ...Typography.titleLarge,
    fontSize: 20,
  },
  logoutButton: {
    marginTop: 32,
    width: '100%',
  },
});

export default DevRolePickerScreen;

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { formStyles } from '../../theme/forms';
import { useAuthStore } from '../../data/stores/authStore';

export const StudentHomeScreen: React.FC = () => {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);

  return (
    <ScrollView style={formStyles.container} contentContainerStyle={formStyles.content}>
      <Text style={formStyles.greeting}>Welcome, {user?.name || 'Student'}</Text>
      <Text style={formStyles.roleBadge}>Student</Text>

      <View style={formStyles.section}>
        <Text style={formStyles.sectionTitle}>Quick Access</Text>
        <Text style={formStyles.emptyText}>More features coming soon...</Text>
      </View>

      <TouchableOpacity style={formStyles.logoutButton} onPress={logout}>
        <Text style={formStyles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

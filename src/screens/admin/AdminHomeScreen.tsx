import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { formStyles } from '../../theme/forms';
import { useAuthStore } from '../../data/stores/authStore';

type AdminStackParamList = { AdminHome: undefined; ManageDeans: undefined };
type AdminNavProp = NativeStackNavigationProp<AdminStackParamList, 'AdminHome'>;

export const AdminHomeScreen: React.FC = () => {
  const navigation = useNavigation<AdminNavProp>();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);

  return (
    <ScrollView style={formStyles.container} contentContainerStyle={formStyles.content}>
      <Text style={formStyles.greeting}>Welcome, {user?.name || 'Admin'}</Text>
      <Text style={formStyles.roleBadge}>Administrator</Text>

      <View style={formStyles.section}>
        <Text style={formStyles.sectionTitle}>Management</Text>
        <TouchableOpacity style={formStyles.card} onPress={() => navigation.navigate('ManageDeans')}>
          <Text style={formStyles.cardTitle}>Manage Deans</Text>
          <Text style={formStyles.cardDesc}>Create and manage dean accounts</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={formStyles.logoutButton} onPress={logout}>
        <Text style={formStyles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

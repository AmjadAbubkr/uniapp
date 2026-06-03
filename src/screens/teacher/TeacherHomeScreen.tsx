import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { formStyles } from '../../theme/forms';
import { useAuthStore } from '../../data/stores/authStore';

type TeacherStackParamList = { TeacherHome: undefined; CreateAnnouncement: undefined };
type TeacherNavProp = NativeStackNavigationProp<TeacherStackParamList, 'TeacherHome'>;

export const TeacherHomeScreen: React.FC = () => {
  const navigation = useNavigation<TeacherNavProp>();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);

  return (
    <ScrollView style={formStyles.container} contentContainerStyle={formStyles.content}>
      <Text style={formStyles.greeting}>Welcome, {user?.name || 'Teacher'}</Text>
      <Text style={formStyles.roleBadge}>Teacher</Text>

      <View style={formStyles.section}>
        <Text style={formStyles.sectionTitle}>Communication</Text>
        <TouchableOpacity style={formStyles.card} onPress={() => navigation.navigate('CreateAnnouncement')}>
          <Text style={formStyles.cardTitle}>Create Announcement</Text>
          <Text style={formStyles.cardDesc}>Post announcements for students</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={formStyles.logoutButton} onPress={logout}>
        <Text style={formStyles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

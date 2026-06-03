import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TeacherHomeScreen } from '../screens/teacher/TeacherHomeScreen';
import { CreateAnnouncementScreen } from '../screens/teacher/CreateAnnouncementScreen';

const Stack = createNativeStackNavigator();

export const TeacherNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TeacherHome" component={TeacherHomeScreen} />
    <Stack.Screen name="CreateAnnouncement" component={CreateAnnouncementScreen} />
  </Stack.Navigator>
);

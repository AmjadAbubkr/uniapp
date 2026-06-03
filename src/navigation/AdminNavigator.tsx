import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminHomeScreen } from '../screens/admin/AdminHomeScreen';
import { ManageDeansScreen } from '../screens/admin/ManageDeansScreen';

const Stack = createNativeStackNavigator();

export const AdminNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
    <Stack.Screen name="ManageDeans" component={ManageDeansScreen} />
  </Stack.Navigator>
);

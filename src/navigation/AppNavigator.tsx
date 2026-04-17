import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '@store/authStore';
import { UserRole } from '@core/constants/roles';
import { colors } from '@core/theme/colors';

import { RootStackParamList } from './types';
import {
  AuthNavigator,
  DeanNavigator,
  TeacherNavigator,
  StudentNavigator,
  AdminNavigator,
} from './Navigators';

const RootStack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { user, is_initialized } = useAuthStore();

  if (!is_initialized) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            {user.role === UserRole.DEAN && (
              <RootStack.Screen name="DeanTabs" component={DeanNavigator} />
            )}
            {user.role === UserRole.TEACHER && (
              <RootStack.Screen
                name="TeacherTabs"
                component={TeacherNavigator}
              />
            )}
            {user.role === UserRole.STUDENT && (
              <RootStack.Screen
                name="StudentTabs"
                component={StudentNavigator}
              />
            )}
            {user.role === UserRole.ROOT_ADMIN && (
              <RootStack.Screen name="AdminTabs" component={AdminNavigator} />
            )}
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

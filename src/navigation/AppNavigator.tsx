import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '@store/authStore';
import { UserRole } from '@core/constants/roles';

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
  const effectiveUser = __DEV__ || !user || user.id !== 'dev-001' ? user : null;

  if (!is_initialized) {
    return null;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator
        key={effectiveUser?.role ?? 'auth'}
        screenOptions={{ headerShown: false }}
      >
        {!effectiveUser ? (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            {effectiveUser.role === UserRole.DEAN && (
              <RootStack.Screen name="DeanTabs" component={DeanNavigator} />
            )}
            {effectiveUser.role === UserRole.TEACHER && (
              <RootStack.Screen
                name="TeacherTabs"
                component={TeacherNavigator}
              />
            )}
            {effectiveUser.role === UserRole.STUDENT && (
              <RootStack.Screen
                name="StudentTabs"
                component={StudentNavigator}
              />
            )}
            {effectiveUser.role === UserRole.ROOT_ADMIN && (
              <RootStack.Screen name="AdminTabs" component={AdminNavigator} />
            )}
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

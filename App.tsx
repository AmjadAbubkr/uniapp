import React, { useEffect, useCallback } from 'react';
import { StatusBar, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import AppNavigator from '@navigation/AppNavigator';
import { useAuthStore } from '@store/authStore';
import { configureFirebase } from '@data/firebase';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const initialize = useAuthStore(state => state.initialize);

  const init = useCallback(async () => {
    await configureFirebase();
    initialize();
  }, [initialize]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <View style={{ flex: 1, paddingTop: safeAreaInsets.top }}>
      <AppNavigator />
    </View>
  );
}

export default App;

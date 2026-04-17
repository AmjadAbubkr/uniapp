import React, { useEffect } from 'react';
import { StatusBar, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import AppNavigator from '@navigation/AppNavigator';
import { SyncStatusBar } from '@components/common/SyncStatusBar';
import { colors } from '@core/theme/colors';
import { useAuthStore } from '@store/authStore';

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

  useEffect(() => {
    initialize();
  }, []);

  return (
    <View style={{ flex: 1, paddingTop: safeAreaInsets.top }}>
      <SyncStatusBar />
      <AppNavigator />
    </View>
  );
}

export default App;

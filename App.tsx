import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { ViolationsProvider } from './src/context/ViolationsContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <ViolationsProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </ViolationsProvider>
    </SafeAreaProvider>
  );
}

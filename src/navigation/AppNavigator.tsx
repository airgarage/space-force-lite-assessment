import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import ViolationsListScreen from '../screens/ViolationsListScreen';
import ViolationDetailScreen from '../screens/ViolationDetailScreen';
import { TouchableOpacity, Text } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

const backButton = (onPress: () => void) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>← Back</Text>
    </TouchableOpacity>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ViolationsList">
        <Stack.Screen
          name="ViolationsList"
          component={ViolationsListScreen}
        />
        <Stack.Screen
          name="ViolationDetails"
          component={ViolationDetailScreen}
          options={({ navigation }) => ({
            title: 'Violation Details',
            headerLeft: () => backButton(() => navigation.goBack())
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 
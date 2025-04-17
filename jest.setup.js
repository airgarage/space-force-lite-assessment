// Add any global configuration for Jest here
import '@testing-library/jest-native/extend-expect';

// Mock the expo-status-bar
// jest.mock('expo-status-bar', () => ({
//   StatusBar: () => 'StatusBar',
// }));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

// Mock react-native-screens
jest.mock('react-native-screens', () => ({
  ...jest.requireActual('react-native-screens'),
  enableScreens: jest.fn(),
}));

// Mock react-navigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

// Use a timeout that's long enough for most operations
jest.setTimeout(30000); 
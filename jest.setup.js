import '@testing-library/jest-native/extend-expect';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper'); // Mock NativeAnimatedHelper

// Mock untuk react-native-reanimated (jika menggunakan)
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// Mock react-navigation (jika menggunakan)
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn(() => ({
      goBack: jest.fn(),
      navigate: jest.fn(),
    })),
  };
});

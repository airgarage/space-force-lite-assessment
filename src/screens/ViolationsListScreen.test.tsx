import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ViolationsListScreen from './ViolationsListScreen';
import { View } from 'react-native';

// Mock the navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock the ViolationsContext
const mockViolations = [
  {
    id: '1',
    car: {
      plate: 'ABC123',
      state: 'CA',
    },
    date: '2023-01-01T12:00:00Z',
    location: '123 Main St',
    resolved: false,
  },
  {
    id: '2',
    car: {
      plate: 'XYZ789',
      state: 'NY',
    },
    date: '2023-01-02T14:00:00Z',
    location: '456 Oak Ave',
    resolved: true,
  },
];

// Create a reusable mock for the ViolationsContext
const mockContextValue = {
  violations: mockViolations,
  filteredViolations: mockViolations,
  isLoading: false,
  errorMessage: null as string | null,
  searchTerm: '',
  updateSearchTerm: jest.fn(),
  refreshViolations: jest.fn(),
  fetchViolations: jest.fn(),
  toggleViolationStatus: jest.fn(),
  isPendingUpdate: jest.fn().mockReturnValue(false),
};

jest.mock('../context/ViolationsContext', () => ({
  useViolations: () => mockContextValue,
}));

// // Mock the ViolationCard component
// jest.mock('../components/ViolationCard', () => 'ViolationCard');

describe('ViolationsListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock values to default
    mockContextValue.isLoading = false;
    mockContextValue.errorMessage = null;
    mockContextValue.filteredViolations = mockViolations;
  });

  it('renders the violations list correctly', async () => {
    const { getByText, getAllByText, getByPlaceholderText } = render(<ViolationsListScreen />);

    const searchInput = getByPlaceholderText('Search by plate number...');
    expect(searchInput).toBeTruthy();

    // loop through the mockViolations and get the violation card for each one
    mockViolations.forEach((violation) => {
      const plate = getByText(violation.car.plate);
      const state = getByText(violation.car.state);
      const location = getByText(violation.location);
      expect(plate).toBeTruthy();
      expect(state).toBeTruthy();
      expect(location).toBeTruthy();
    });
  });

  it('navigates to detail screen when a violation is pressed', async () => {
    const { getByText } = render(<ViolationsListScreen />);

    const firstViolationCard = getByText(mockViolations[0].car.plate);
    fireEvent.press(firstViolationCard);

    expect(mockNavigate).toHaveBeenCalledWith('ViolationDetails', { violationId: mockViolations[0].id });
  });

  it('renders loading indicator when loading', async () => {
    // Override the mock value for this test
    mockContextValue.isLoading = true;
    mockContextValue.filteredViolations = [];

    const { getByTestId } = render(
      <ViolationsListScreen />
    );

    await waitFor(() => {
      const loadingIndicator = getByTestId('loading-indicator');
      expect(loadingIndicator).toBeTruthy();
    });

  });

  it('renders error message when there is an error', async () => {
    // Override the mock value for this test
    mockContextValue.errorMessage = 'Failed to load violations';

    const { getByText } = render(<ViolationsListScreen />);

    await waitFor(() => {
      expect(getByText('Failed to load violations')).toBeTruthy();
    });
  });
}); 
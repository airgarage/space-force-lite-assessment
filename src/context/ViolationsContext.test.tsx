import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { ViolationsProvider, useViolations } from './ViolationsContext';
import { mockViolations } from '../mocks/violations';
import { violationService } from '../services';

/**
 * ViolationsContext Test Suite
 * 
 * This file tests the ViolationsContext which should implement the following:
 * 
 * STATE:
 * - violations: Array of violation objects from the API
 * - isLoading: Boolean flag indicating if data is being fetched
 * - errorMessage: String containing error message if any operation fails
 * - filteredViolations: Array of violations filtered by searchTerm
 * - searchTerm: String containing the current search term
 * 
 * ACTIONS:
 * - fetchViolations(): Function to fetch violations from the API
 * - toggleViolationStatus(id, newStatus): Function to toggle a violation's resolved status
 * - updateSearchTerm(term): Function to update the search term for filtering
 * - isPendingUpdate(id): Function to check if a specific violation is currently being updated
 * - dismissError(): Function to dismiss the error message
 * 
 * FEATURES TO IMPLEMENT:
 * 1. Automatic data fetching on mount
 * 2. Error handling for API failures
 * 3. Filtering violations by plate number (case-insensitive)
 * 4. Optimistic UI updates when toggling violation status
 * 5. Manual refresh capability
 */

// Mock the violationService module
jest.mock('../services', () => ({
  violationService: {
    getViolations: jest.fn(),
    updateViolationStatus: jest.fn(),
  },
}));

const mockedViolationService = {
  getViolations: violationService.getViolations as any,
  updateViolationStatus: violationService.updateViolationStatus as any,
};

/**
 * This TestComponent shows all the required state variables and actions
 * that should be implemented in the ViolationsContext.
 */
const TestComponent = () => {
  const {
    violations,
    isLoading,
    errorMessage,
    filteredViolations,
    searchTerm,
    isPendingUpdate,
    fetchViolations,
    toggleViolationStatus,
    updateSearchTerm,
    dismissError,
  } = useViolations();

  return (
    <View>
      <Text testID="loading-state">{isLoading.toString()}</Text>
      <Text testID="error-message">{errorMessage}</Text>
      <Text testID="violations-count">{violations.length}</Text>
      <Text testID="filtered-count">{filteredViolations.length}</Text>
      <Text testID="search-term">{searchTerm}</Text>

      {filteredViolations.map((violation) => (
        <View key={violation.id} testID={`violation-${violation.id}`}>
          <Text testID={`plate-${violation.id}`}>{violation.car.plate}</Text>
          <Text testID={`resolved-${violation.id}`}>{violation.resolved.toString()}</Text>
          <Text testID={`pending-${violation.id}`}>{isPendingUpdate(violation.id).toString()}</Text>
          <TouchableOpacity
            testID={`toggle-${violation.id}`}
            onPress={() => toggleViolationStatus(violation.id, !violation.resolved)}
          >
            <Text>Toggle</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity testID="fetch-button" onPress={fetchViolations}>
        <Text>Fetch Violations</Text>
      </TouchableOpacity>

      <TextInput
        testID="search-input"
        value={searchTerm}
        onChangeText={updateSearchTerm}
        placeholder="Search"
      />

      <TouchableOpacity testID="dismiss-error" onPress={dismissError}>
        <Text>Dismiss Error</Text>
      </TouchableOpacity>
    </View>
  );
};

describe('ViolationsContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Data Fetching', () => {
    it('should automatically fetch violations when component mounts', async () => {
      // Mock the API response
      mockedViolationService.getViolations.mockResolvedValueOnce(mockViolations);

      const { getByTestId } = render(
        <ViolationsProvider>
          <TestComponent />
        </ViolationsProvider>
      );

      // Check loading state is true during fetching
      expect(getByTestId('loading-state').props.children).toBe('true');

      // Wait for the async operation to complete
      await waitFor(() => {
        expect(mockedViolationService.getViolations).toHaveBeenCalledTimes(1);
      });

      // Check the loading state changed after fetch completes
      expect(getByTestId('loading-state').props.children).toBe('false');

      // Verify that the violations were loaded correctly
      expect(getByTestId('violations-count').props.children).toBe(mockViolations.length);
      expect(getByTestId('filtered-count').props.children).toBe(mockViolations.length);
    });

    it('should handle API errors during data fetching', async () => {
      // Mock the API to throw an error
      const errorMsg = 'Network error';
      mockedViolationService.getViolations.mockRejectedValueOnce(new Error(errorMsg));

      const { getByTestId } = render(
        <ViolationsProvider>
          <TestComponent />
        </ViolationsProvider>
      );

      // Check loading state is true during fetching
      expect(getByTestId('loading-state').props.children).toBe('true');

      // Wait for the error to be displayed
      await waitFor(() => {
        expect(getByTestId('error-message').props.children).toBe(errorMsg);
      });

      // Check loading state is false after error
      expect(getByTestId('loading-state').props.children).toBe('false');
    });

    it('should support manual fetching of violations through the fetchViolations action', async () => {
      // Mock the API response for initial load (empty) and manual fetch (with data)
      mockedViolationService.getViolations.mockResolvedValueOnce([])
        .mockResolvedValueOnce(mockViolations);

      const { getByTestId } = render(
        <ViolationsProvider>
          <TestComponent />
        </ViolationsProvider>
      );

      // Wait for the initial load (empty array)
      await waitFor(() => {
        expect(getByTestId('violations-count').props.children).toBe(0);
      });

      // Trigger a manual fetch using the action
      fireEvent.press(getByTestId('fetch-button'));

      // Check that loading state is true during fetch
      expect(getByTestId('loading-state').props.children).toBe('true');
      // Check that error message is reset to null
      expect(getByTestId('error-message').props.children).toBe(null);

      // Wait for the manual fetch to complete
      await waitFor(() => {
        expect(mockedViolationService.getViolations).toHaveBeenCalledTimes(2);
        expect(getByTestId('violations-count').props.children).toBe(mockViolations.length);
      });

      // Check loading state is false after fetch completes
      expect(getByTestId('loading-state').props.children).toBe('false');
    });
  });

  describe('Search and Filtering', () => {
    it('should filter violations based on car plate when search term is provided', async () => {
      // Mock the API response
      mockedViolationService.getViolations.mockResolvedValueOnce(mockViolations);

      const { getByTestId } = render(
        <ViolationsProvider>
          <TestComponent />
        </ViolationsProvider>
      );

      // Wait for the initial data load
      await waitFor(() => {
        expect(getByTestId('violations-count').props.children).toBe(mockViolations.length);
      });

      // Update search term to filter for a specific plate
      fireEvent.changeText(getByTestId('search-input'), 'ABC');

      // Check that filteredViolations contains only matching items
      const expectedId = Number(mockViolations[0].id);
      expect(getByTestId('filtered-count').props.children).toBe(expectedId);
      expect(getByTestId('search-term').props.children).toBe('ABC');

      // Verify filtered data matches expected plate
      expect(getByTestId(`plate-${expectedId}`).props.children).toBe('ABC123');
      expect(getByTestId(`resolved-${expectedId}`).props.children).toBe('false');
      expect(getByTestId(`pending-${expectedId}`).props.children).toBe('false');
    });

    it('should show all violations when search term is empty', async () => {
      // Mock the API response
      mockedViolationService.getViolations.mockResolvedValueOnce(mockViolations);

      const { getByTestId } = render(
        <ViolationsProvider>
          <TestComponent />
        </ViolationsProvider>
      );

      // Wait for the initial data load
      await waitFor(() => {
        expect(getByTestId('violations-count').props.children).toBe(mockViolations.length);
      });

      // Set search term to empty string
      fireEvent.changeText(getByTestId('search-input'), '');

      // Verify all violations are shown when search is empty
      expect(getByTestId('filtered-count').props.children).toBe(mockViolations.length);
    });

    it('should perform case-insensitive filtering of violations', async () => {
      // Mock the API response
      mockedViolationService.getViolations.mockResolvedValueOnce(mockViolations);

      const { getByTestId } = render(
        <ViolationsProvider>
          <TestComponent />
        </ViolationsProvider>
      );

      // Wait for the initial data load
      await waitFor(() => {
        expect(getByTestId('violations-count').props.children).toBe(mockViolations.length);
      });

      // Use mixed case search term to test case insensitivity
      fireEvent.changeText(getByTestId('search-input'), 'aBc');

      // Verify that it still finds the right plate (case insensitive)
      expect(getByTestId('filtered-count').props.children).toBe(1);
      expect(getByTestId('plate-1').props.children).toBe('ABC123');
    });
  });

  describe('Violation Status Management', () => {
    it('should toggle violation status from false to true when requested', async () => {
      // Mock the API response for initial load and update
      mockedViolationService.getViolations.mockResolvedValueOnce(mockViolations);
      mockedViolationService.updateViolationStatus.mockResolvedValueOnce({
        ...mockViolations[0],
        resolved: true,
      });

      const { getByTestId } = render(
        <ViolationsProvider>
          <TestComponent />
        </ViolationsProvider>
      );

      // Wait for the initial data load
      await waitFor(() => {
        expect(getByTestId('violations-count').props.children).toBe(mockViolations.length);
      });

      // Verify initial resolved state is false
      expect(getByTestId('resolved-1').props.children).toBe('false');

      // Toggle the violation status
      fireEvent.press(getByTestId('toggle-1'));

      // Wait for the update to complete
      await waitFor(() => {
        expect(mockedViolationService.updateViolationStatus).toHaveBeenCalledWith('1', true);
      });

      // Verify the resolved state is now true after toggle
      expect(getByTestId('resolved-1').props.children).toBe('true');
    });

    it('should implement optimistic UI updates when toggling violation status', async () => {
      // Mock the API response for initial load
      mockedViolationService.getViolations.mockResolvedValueOnce(mockViolations);

      // Use a delayed promise to simulate network latency
      mockedViolationService.updateViolationStatus.mockImplementationOnce(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({
              ...mockViolations[0],
              resolved: true,
            });
          }, 100);
        });
      });

      const { getByTestId } = render(
        <ViolationsProvider>
          <TestComponent />
        </ViolationsProvider>
      );

      // Wait for the initial data load
      await waitFor(() => {
        expect(getByTestId('violations-count').props.children).toBe(mockViolations.length);
      });

      // Verify isPendingUpdate is initially false
      expect(getByTestId('pending-1').props.children).toBe('false');

      // Verify initial resolved state is false
      expect(getByTestId('resolved-1').props.children).toBe('false');

      // Toggle the violation status
      fireEvent.press(getByTestId('toggle-1'));

      // IMPORTANT: Immediately verify optimistic UI update (before API response):
      // 1. The resolved status should change immediately in the UI
      expect(getByTestId('resolved-1').props.children).toBe('true');

      // 2. The isPendingUpdate should be true during the update
      expect(getByTestId('pending-1').props.children).toBe('true');

      // 3. The global loading state should remain false (only the specific item is pending)
      expect(getByTestId('loading-state').props.children).toBe('false');

      // Wait for the update to complete
      await waitFor(() => {
        expect(mockedViolationService.updateViolationStatus).toHaveBeenCalledWith('1', true);
        // After update completes, pending flag should be false
        expect(getByTestId('pending-1').props.children).toBe('false');
      });
    });

    it('should handle API errors when toggling violation status and rollback optimistic updates', async () => {
      // Mock the API response for initial load
      mockedViolationService.getViolations.mockResolvedValueOnce(mockViolations);

      // Mock the update to throw an error
      const errorMsg = 'Failed to update';
      mockedViolationService.updateViolationStatus.mockRejectedValueOnce(new Error(errorMsg));

      const { getByTestId } = render(
        <ViolationsProvider>
          <TestComponent />
        </ViolationsProvider>
      );

      // Wait for the initial data load
      await waitFor(() => {
        expect(getByTestId('violations-count').props.children).toBe(mockViolations.length);
      });

      // Toggle the violation status
      fireEvent.press(getByTestId('toggle-1'));

      // Wait for the error to be displayed
      await waitFor(() => {
        expect(getByTestId('error-message').props.children).toContain(errorMsg);
      });

      // Verify that the resolved status was rolled back after error
      expect(getByTestId('resolved-1').props.children).toBe('false');

      // Verify that isPendingUpdate is false after the error
      expect(getByTestId('pending-1').props.children).toBe('false');
    });
  });

  describe('Error Message', () => {
    it('should recover from API errors by successfully re-fetching data', async () => {
      // First, mock an API failure for the initial load
      const errorMsg = 'Network error';
      mockedViolationService.getViolations
        .mockRejectedValueOnce(new Error(errorMsg))
        // Then mock a successful response for the retry
        .mockResolvedValueOnce(mockViolations);

      const { getByTestId } = render(
        <ViolationsProvider>
          <TestComponent />
        </ViolationsProvider>
      );

      // Wait for the initial error to be displayed
      await waitFor(() => {
        expect(getByTestId('error-message').props.children).toBe(errorMsg);
      });

      // Verify no violations were loaded due to error
      expect(getByTestId('violations-count').props.children).toBe(0);

      // Trigger a manual fetch to recover from the error
      fireEvent.press(getByTestId('fetch-button'));

      // Verify loading state is set during retry
      expect(getByTestId('loading-state').props.children).toBe('true');

      // Wait for the retry to complete successfully
      await waitFor(() => {
        expect(mockedViolationService.getViolations).toHaveBeenCalledTimes(2);
      });

      // Verify error message is cleared after successful fetch
      expect(getByTestId('error-message').props.children).toBe(null);

      // Verify that violations were successfully loaded after recovery
      expect(getByTestId('violations-count').props.children).toBe(mockViolations.length);
      expect(getByTestId('filtered-count').props.children).toBe(mockViolations.length);
      expect(getByTestId('loading-state').props.children).toBe('false');
    });

    it('should clear error messages when new operations succeed after a previous failure', async () => {
      // Mock API responses: initial load success, first toggle fails, second toggle succeeds
      mockedViolationService.getViolations.mockResolvedValueOnce(mockViolations);

      const errorMsg = 'Failed to update';
      mockedViolationService.updateViolationStatus
        // First toggle fails
        .mockRejectedValueOnce(new Error(errorMsg))
        // Second toggle succeeds
        .mockResolvedValueOnce({
          ...mockViolations[0],
          resolved: true,
        });

      const { getByTestId } = render(
        <ViolationsProvider>
          <TestComponent />
        </ViolationsProvider>
      );

      // Wait for the initial data load
      await waitFor(() => {
        expect(getByTestId('violations-count').props.children).toBe(mockViolations.length);
      });

      // Attempt first toggle which will fail
      fireEvent.press(getByTestId('toggle-1'));

      // Wait for the error to be displayed
      await waitFor(() => {
        expect(getByTestId('error-message').props.children).toContain(errorMsg);
      });

      // Verify that the status was rolled back
      expect(getByTestId('resolved-1').props.children).toBe('false');

      // Attempt second toggle which should succeed
      fireEvent.press(getByTestId('toggle-1'));

      // Wait for the successful update
      await waitFor(() => {
        expect(mockedViolationService.updateViolationStatus).toHaveBeenCalledTimes(2);
      });

      // Verify error message is cleared after successful operation
      expect(getByTestId('error-message').props.children).toBe(null);

      // Verify the update was applied successfully
      expect(getByTestId('resolved-1').props.children).toBe('true');
      expect(getByTestId('pending-1').props.children).toBe('false');
    });

    it('should dismiss error message when dismissError is called', async () => {
      // Mock API error response for the initial data load
      const errorMsg = 'Test error';
      mockedViolationService.getViolations
        .mockResolvedValueOnce(mockViolations) // Initial load success
        .mockRejectedValueOnce(new Error(errorMsg)); // Error on manual fetch

      const { getByTestId } = render(
        <ViolationsProvider>
          <TestComponent />
        </ViolationsProvider>
      );

      // Wait for the initial data load
      await waitFor(() => {
        expect(getByTestId('violations-count').props.children).toBe(mockViolations.length);
      });

      // Verify error message is initially null
      expect(getByTestId('error-message').props.children).toBe(null);

      // Trigger a fetch that will cause an error
      fireEvent.press(getByTestId('fetch-button'));

      // Wait for the error to be displayed
      await waitFor(() => {
        expect(getByTestId('error-message').props.children).toBe(errorMsg);
      });

      // Dismiss the error
      fireEvent.press(getByTestId('dismiss-error'));

      // Verify the error message is dismissed
      await waitFor(() => {
        expect(getByTestId('error-message').props.children).toBe(null);
      });
    });
  });
}); 
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ViolationDetailScreen from './ViolationDetailScreen';
import { mockViolations } from '../mocks/violations';
import { formatDate } from '../utils/time';

// Mock the navigation
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
  useRoute: () => ({
    params: { violationId: '1' }
  }),
}));

// Mock the ViolationsContext
const mockToggleViolationStatus = jest.fn();
jest.mock('../context/ViolationsContext', () => ({
  useViolations: () => ({
    violations: mockViolations,
    toggleViolationStatus: mockToggleViolationStatus,
    isPendingUpdate: () => false,
    errorMessage: null
  }),
}));

const mockProps: any = {
  navigation: { goBack: mockGoBack },
  route: { params: { violationId: '1' } }
};

describe('ViolationDetailScreen', () => {
  it('renders violation details correctly', () => {
    const { getByText } = render(<ViolationDetailScreen {...mockProps} />);

    expect(getByText('ABC123')).toBeTruthy();
    expect(getByText('AZ')).toBeTruthy();
    expect(getByText('123 Main St, Phoenix')).toBeTruthy();

    const expectedFormattedDate = formatDate(mockViolations[0].date);
    expect(getByText(expectedFormattedDate)).toBeTruthy();
  });

  it('renders the status switch correctly', () => {
    const { getByText, getByTestId } = render(<ViolationDetailScreen {...mockProps} />);

    expect(getByText('Unresolved')).toBeTruthy();
    expect(getByTestId('switch-1')).toBeTruthy();
  });

  it('handles toggling the violation status', () => {
    const { getByTestId } = render(<ViolationDetailScreen {...mockProps} />);

    const toggleSwitch = getByTestId('switch-1');
    fireEvent(toggleSwitch, 'valueChange', true);

    expect(mockToggleViolationStatus).toHaveBeenCalledWith('1', true);
  });

  it('shows correct status text based on resolved status', () => {
    // Update the context mock for this test to return a resolved violation
    jest.spyOn(require('../context/ViolationsContext'), 'useViolations').mockReturnValue({
      violations: [{ ...mockViolations[0], resolved: true }],
      toggleViolationStatus: mockToggleViolationStatus,
      isPendingUpdate: () => false,
      errorMessage: null
    });

    const { getByText, getByTestId } = render(<ViolationDetailScreen {...mockProps} />);

    expect(getByText('Resolved')).toBeTruthy();
    expect(getByTestId(`switch-${mockViolations[0].id}`)).toBeTruthy();
    expect(getByTestId(`switch-${mockViolations[0].id}`).props.value).toBe(true);
  });
}); 
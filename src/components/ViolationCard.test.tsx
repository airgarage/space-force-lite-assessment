import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ViolationCard from './ViolationCard';
import { Violation } from '../types/models';

// Mock the time utils
jest.mock('../utils/time', () => ({
  formatShortDate: (date: string) => date,
}));

describe('ViolationCard', () => {
  const mockViolation: Violation = {
    id: '1',
    car: {
      plate: 'ABC123',
      state: 'CA',
    },
    date: '2023-01-01T12:00:00Z',
    location: '123 Main St',
    resolved: false,
  };

  const mockOnPress = jest.fn();
  const mockToggleViolationStatus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the violation information correctly', () => {
    const { getByText, getByTestId } = render(
      <ViolationCard
        violation={mockViolation}
        onPress={mockOnPress}
        toggleViolationStatus={mockToggleViolationStatus}
      />
    );

    expect(getByText('ABC123')).toBeTruthy();
    expect(getByText('CA')).toBeTruthy();
    expect(getByText('123 Main St')).toBeTruthy();
    expect(getByText('2023-01-01T12:00:00Z')).toBeTruthy();
    expect(getByTestId(`switch-${mockViolation.id}`)).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByTestId } = render(
      <ViolationCard
        violation={mockViolation}
        onPress={mockOnPress}
        toggleViolationStatus={mockToggleViolationStatus}
        testID="violation-card"
      />
    );

    fireEvent.press(getByTestId('violation-card'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('calls toggleViolationStatus when toggle is pressed', () => {
    const { getByTestId } = render(
      <ViolationCard
        violation={mockViolation}
        onPress={mockOnPress}
        toggleViolationStatus={mockToggleViolationStatus}
      />
    );

    fireEvent(getByTestId(`switch-${mockViolation.id}`), 'valueChange', true);
    expect(mockToggleViolationStatus).toHaveBeenCalledWith(mockViolation.id, true);
  });

  it('shows different button text when resolved', () => {
    const resolvedViolation = { ...mockViolation, resolved: true };
    const { getByText } = render(
      <ViolationCard
        violation={resolvedViolation}
        onPress={mockOnPress}
        toggleViolationStatus={mockToggleViolationStatus}
      />
    );

    expect(getByText('Resolved')).toBeTruthy();
  });
}); 
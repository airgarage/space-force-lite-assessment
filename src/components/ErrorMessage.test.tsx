import React from 'react';
import { render } from '@testing-library/react-native';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage', () => {
  it('renders the error message correctly', () => {
    const { getByText } = render(
      <ErrorMessage
        message="Network error occurred"
      />
    );

    expect(getByText('Network error occurred')).toBeTruthy();
  });
}); 
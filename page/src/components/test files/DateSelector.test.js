// DateSelector.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DateSelector from '../DateSelector'; // Adjust the import path if necessary

describe('DateSelector', () => {
  // Test to ensure the component renders correctly
  test('renders start and end date inputs with correct values', () => {
    const mockOnStartDateChange = jest.fn();
    const mockOnEndDateChange = jest.fn();
    
    render(
      <DateSelector
        startDate="2024-01-01"
        endDate="2024-01-31"
        onStartDateChange={mockOnStartDateChange}
        onEndDateChange={mockOnEndDateChange}
      />
    );

    // Check if the inputs and labels are rendered correctly
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toHaveValue('2024-01-01');
    expect(screen.getByLabelText(/end date/i)).toHaveValue('2024-01-31');
  });

  // Test to ensure the change handlers are called correctly
  test('calls onStartDateChange and onEndDateChange when dates are changed', () => {
    const mockOnStartDateChange = jest.fn();
    const mockOnEndDateChange = jest.fn();
    
    render(
      <DateSelector
        startDate="2024-01-01"
        endDate="2024-01-31"
        onStartDateChange={mockOnStartDateChange}
        onEndDateChange={mockOnEndDateChange}
      />
    );

    // Simulate a change event on start date input
    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: '2024-02-01' }
    });
    expect(mockOnStartDateChange).toHaveBeenCalledWith('2024-02-01');

    // Simulate a change event on end date input
    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: '2024-02-28' }
    });
    expect(mockOnEndDateChange).toHaveBeenCalledWith('2024-02-28');
  });
});

// DatePicker.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DatePicker from '../DatePicker'; // Adjust the import path if necessary

describe('DatePicker', () => {
  test('renders date input with correct initial value', () => {
    const mockSetSelectedDate = jest.fn();
    const initialDate = new Date('2024-01-01');

    render(
      <DatePicker
        selectedDate={initialDate}
        setSelectedDate={mockSetSelectedDate}
      />
    );

    // Check if the input is rendered with the correct value
    const dateInput = screen.getByTestId('date-picker-input'); // Use data-testid
    expect(dateInput).toBeInTheDocument();
    expect(dateInput).toHaveValue('2024-01-01');
  });

  test('calls setSelectedDate when the date is changed', () => {
    const mockSetSelectedDate = jest.fn();
    const initialDate = new Date('2024-01-01');

    render(
      <DatePicker
        selectedDate={initialDate}
        setSelectedDate={mockSetSelectedDate}
      />
    );

    // Simulate a change event on the date input
    fireEvent.change(screen.getByTestId('date-picker-input'), {
      target: { value: '2024-02-01' }
    });

    // Check if setSelectedDate is called with the correct date
    expect(mockSetSelectedDate).toHaveBeenCalledWith(new Date('2024-02-01'));
  });
});

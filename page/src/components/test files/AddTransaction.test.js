
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import AddTransaction from '../AddTransaction';
import { ADD_TRANSACTION } from '../../graphql';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(() => 'mockUserId'),
  },
  writable: true,
});

const mocks = [
  {
    request: {
      query: ADD_TRANSACTION,
      variables: {
        userId: 'mockUserId',
        description: 'Test Transaction',
        amount: 100,
        type: 'income',
        date: expect.any(String),
      },
    },
    result: {
      data: {
        addTransaction: {
          id: '1',
          description: 'Test Transaction',
          amount: 100,
          type: 'income',
          date: '2024-08-04',
        },
      },
    },
  },
];

describe('AddTransaction Component', () => {
  const renderComponent = () =>
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter>
          <AddTransaction />
        </MemoryRouter>
      </MockedProvider>
    );

  it('renders the component', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: 'Add Transaction' })).toBeInTheDocument();
  });

  it('handles input changes', () => {
    renderComponent();
    const descriptionInput = screen.getByPlaceholderText('Description');
    const amountInput = screen.getByPlaceholderText('Amount');
    const typeSelect = screen.getByRole('combobox');

    fireEvent.change(descriptionInput, { target: { value: 'Test Transaction' } });
    fireEvent.change(amountInput, { target: { value: '100' } });
    fireEvent.change(typeSelect, { target: { value: 'expense' } });

    expect(descriptionInput.value).toBe('Test Transaction');
    expect(amountInput.value).toBe('100');
    expect(typeSelect.value).toBe('expense');
  });

  it('submits the form and shows success message', async () => {
    renderComponent();
    const descriptionInput = screen.getByPlaceholderText('Description');
    const amountInput = screen.getByPlaceholderText('Amount');
    const submitButton = screen.getByRole('button', { name: 'Add Transaction' });
  
    fireEvent.change(descriptionInput, { target: { value: 'Test Transaction' } });
    fireEvent.change(amountInput, { target: { value: '100' } });
  
    // Mock the confirm dialog
    window.confirm = jest.fn(() => true);
  
    fireEvent.click(submitButton);
  
    // Wait for any async operations to complete
    await waitFor(() => {
      expect(screen.getByText('Transaction added successfully.')).toBeInTheDocument();
    }, { timeout: 3000 }); // Increase timeout if necessary
  
    // Check if navigation was called
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/income', { state: { refetch: true } });
  });

  it('shows error message for invalid input', async () => {
    renderComponent();
    const submitButton = screen.getByRole('button', { name: 'Add Transaction' });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please provide valid transaction details.')).toBeInTheDocument();
    });
  });

  it('cancels the transaction when user declines confirmation', async () => {
    renderComponent();
    const descriptionInput = screen.getByPlaceholderText('Description');
    const amountInput = screen.getByPlaceholderText('Amount');
    const submitButton = screen.getByRole('button', { name: 'Add Transaction' });

    fireEvent.change(descriptionInput, { target: { value: 'Test Transaction' } });
    fireEvent.change(amountInput, { target: { value: '100' } });

    // Mock the confirm dialog to return false
    window.confirm = jest.fn(() => false);

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Transaction canceled.')).toBeInTheDocument();
    });
  });
});
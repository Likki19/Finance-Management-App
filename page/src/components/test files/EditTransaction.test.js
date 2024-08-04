import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import EditTransaction from '../EditTransaction';
import { GET_TRANSACTION_BY_ID, EDIT_TRANSACTION } from '../../graphql';

// Mock the useParams hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn(),
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
      query: GET_TRANSACTION_BY_ID,
      variables: { id: '1' },
    },
    result: {
      data: {
        transaction: {
          id: '1',
          description: 'Test Transaction',
          amount: 100,
          type: 'income',
          date: '2024-08-04',
        },
      },
    },
  },
  {
    request: {
      query: EDIT_TRANSACTION,
      variables: {
        userId: 'mockUserId',
        id: '1',
        description: 'Updated Transaction',
        amount: 150,
        type: 'expense',
        date: expect.any(String),
      },
    },
    result: {
      data: {
        editTransaction: {
          id: '1',
          description: 'Updated Transaction',
          amount: 150,
          type: 'expense',
          date: '2024-08-04',
        },
      },
    },
  },
];

describe('EditTransaction Component', () => {
  const renderComponent = () =>
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MemoryRouter initialEntries={['/edit/1']}>
          <Routes>
            <Route path="/edit/:id" element={<EditTransaction />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );

  it('renders the component and loads transaction data', async () => {
    renderComponent();
    expect(await screen.findByText('Edit Transaction')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Transaction')).toBeInTheDocument();
      expect(screen.getByDisplayValue('100')).toBeInTheDocument();
    });
  });

  it('handles input changes', async () => {
    renderComponent();
    await waitFor(() => {
      const descriptionInput = screen.getByPlaceholderText('Description');
      const amountInput = screen.getByPlaceholderText('Amount');
      const typeSelect = screen.getByRole('combobox');

      fireEvent.change(descriptionInput, { target: { value: 'Updated Transaction' } });
      fireEvent.change(amountInput, { target: { value: '150' } });
      fireEvent.change(typeSelect, { target: { value: 'expense' } });

      expect(descriptionInput.value).toBe('Updated Transaction');
      expect(amountInput.value).toBe('150');
      expect(typeSelect.value).toBe('expense');
    });
  });

  it('submits the form and shows success message', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    });
  
    const descriptionInput = screen.getByPlaceholderText('Description');
    const amountInput = screen.getByPlaceholderText('Amount');
    const typeSelect = screen.getByRole('combobox');
    const submitButton = screen.getByRole('button', { name: 'Update Transaction' });
  
    fireEvent.change(descriptionInput, { target: { value: 'Updated Transaction' } });
    fireEvent.change(amountInput, { target: { value: '150' } });
    fireEvent.change(typeSelect, { target: { value: 'expense' } });
  
    // Mock the confirm dialog
    window.confirm = jest.fn(() => true);
  
    fireEvent.click(submitButton);
  
    await waitFor(() => {
      expect(screen.getByText('Transaction updated successfully.')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('cancels the transaction update when user declines confirmation', async () => {
    renderComponent();
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: 'Update Transaction' });

      // Mock the confirm dialog to return false
      window.confirm = jest.fn(() => false);

      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Transaction update canceled.')).toBeInTheDocument();
    });
  });
});
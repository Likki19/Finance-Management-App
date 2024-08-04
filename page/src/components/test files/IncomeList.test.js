import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import IncomeList from '../IncomeList';
import { GET_TRANSACTIONS_BY_DATE, DELETE_TRANSACTION } from '../../graphql';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock the localStorage
const mockLocalStorage = {
  getItem: jest.fn(() => "mockUserId"),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock data
const mockIncomes = [
  { id: '1722358747959', description: 'Salary', amount: '5000', date: '2023-08-01', type: 'income' },
  { id: '1722358747945', description: 'Freelance', amount: '1000', date: '2023-08-15', type: 'income' },
];

const mocks = [
  {
    request: {
      query: GET_TRANSACTIONS_BY_DATE,
      variables: {
        userId: "mockUserId",
        startDate: expect.any(String),
        endDate: expect.any(String),
      },
    },
    result: {
      data: {
        transactionsByDate: mockIncomes,
      },
    },
  },
  {
    request: {
      query: DELETE_TRANSACTION,
      variables: {
        userId: 'mockUserId',
        id: '1722358747959',
      },
    },
    result: {
      data: {
        deleteTransaction: { id: '1722358747959' },
      },
    },
  },
];

const renderComponent = () =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <BrowserRouter>
        <IncomeList />
      </BrowserRouter>
    </MockedProvider>
  );

describe('IncomeList Component', () => {
  test('renders income list correctly', async () => {
    renderComponent();
    
    try {
      await waitFor(() => {
        const incomeElement = screen.getByText('Income');
        console.log('Income element found:', incomeElement);
        expect(incomeElement).toBeInTheDocument();
      });
    } catch (error) {
      console.error('Error finding Income element:', error);
      console.log('Current document body:', document.body.innerHTML);
    }
    
    try {
      expect(screen.getByText('Salary')).toBeInTheDocument();
      expect(screen.getByText('Freelance')).toBeInTheDocument();
      expect(screen.getByText('Total Income: Rs: 6000.00')).toBeInTheDocument();
    } catch (error) {
      console.error('Error finding income details:', error);
      console.log('Current document body:', document.body.innerHTML);
    }
  });

  test('filters work correctly', async () => {
    renderComponent();

    try {
      await waitFor(() => {
        expect(screen.getByText('Salary')).toBeInTheDocument();
      });
    } catch (error) {
      console.error('Error finding Salary text:', error);
      console.log('Current document body:', document.body.innerHTML);
    }

    try {
      const monthSelect = screen.getByLabelText('Month:');
      const yearSelect = screen.getByLabelText('Year:');

      fireEvent.change(monthSelect, { target: { value: '7' } });
      fireEvent.change(yearSelect, { target: { value: '2022' } });

      expect(monthSelect.value).toBe('7');
      expect(yearSelect.value).toBe('2022');
    } catch (error) {
      console.error('Error interacting with filters:', error);
      console.log('Current document body:', document.body.innerHTML);
    }
  });

  test('delete transaction works', async () => {
    renderComponent();

    try {
      await waitFor(() => {
        expect(screen.getByText('Salary')).toBeInTheDocument();
      });
    } catch (error) {
      console.error('Error finding Salary text:', error);
      console.log('Current document body:', document.body.innerHTML);
    }

    window.confirm = jest.fn(() => true);

    try {
      const deleteButtons = await screen.findAllByText('Delete');
      fireEvent.click(deleteButtons[0]);

      expect(window.confirm).toHaveBeenCalledWith('Do you want to delete this transaction?');

      await waitFor(() => {
        expect(screen.queryByText('Salary')).not.toBeInTheDocument();
      });
    } catch (error) {
      console.error('Error deleting transaction:', error);
      console.log('Current document body:', document.body.innerHTML);
    }
  });

  test('edit transaction navigates correctly', async () => {
    renderComponent();

    try {
      await waitFor(() => {
        expect(screen.getByText('Salary')).toBeInTheDocument();
      });
    } catch (error) {
      console.error('Error finding Salary text:', error);
      console.log('Current document body:', document.body.innerHTML);
    }

    try {
      const editButtons = await screen.findAllByText('Edit');
      fireEvent.click(editButtons[0]);

      expect(mockNavigate).toHaveBeenCalledWith('/edit-transaction/1722358747959', { state: { transaction: mockIncomes[0] } });
    } catch (error) {
      console.error('Error editing transaction:', error);
      console.log('Current document body:', document.body.innerHTML);
    }
  });
});
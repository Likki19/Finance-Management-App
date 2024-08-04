import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GET_TRANSACTIONS_BY_DATE } from '../../graphql';
import Savings from '../Savings';

const mocks = [
  {
    request: {
      query: GET_TRANSACTIONS_BY_DATE,
      variables: {
        userId: 'testUserId',
        startDate: '2024-01-31', // Ensure these match your component's query
        endDate: '2025-01-30',
      },
    },
    result: {
      data: {
        transactionsByDate: [
          { id: '1', description: 'Salary', amount: 300, type: 'income', date: '2024-03-15' },
          { id: '2', description: 'Rent', amount: 150, type: 'expense', date: '2024-03-16' },
          { id: '3', description: 'Bonus', amount: 200, type: 'income', date: '2024-06-15' },
          { id: '4', description: 'Utilities', amount: 100, type: 'expense', date: '2024-06-16' },
        ],
      },
    },
  },
];

describe('Savings Component', () => {
  test('renders and updates yearly income correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Savings userId="testUserId" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('yearly-income')).toBeInTheDocument();
      expect(screen.getByTestId('yearly-expenses')).toBeInTheDocument();
      expect(screen.getByTestId('yearly-savings')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('year-only-select'), { target: { value: '2024' } });

    await waitFor(() => {
      expect(screen.getByTestId('yearly-income')).toHaveTextContent('Income: Rs: 500.00');
      expect(screen.getByTestId('yearly-expenses')).toHaveTextContent('Expenses: Rs: 250.00');
      expect(screen.getByTestId('yearly-savings')).toHaveTextContent('Savings: Rs: 250.00');
    });
  });

  test('renders and updates monthly income correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Savings userId="testUserId" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('monthly-income')).toBeInTheDocument();
      expect(screen.getByTestId('monthly-expenses')).toBeInTheDocument();
      expect(screen.getByTestId('monthly-savings')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('month-select'), { target: { value: '6' } });
    fireEvent.change(screen.getByTestId('year-input'), { target: { value: '2024' } });

    await waitFor(() => {
      expect(screen.getByTestId('monthly-income')).toHaveTextContent('Income: Rs: 200.00');
      expect(screen.getByTestId('monthly-expenses')).toHaveTextContent('Expenses: Rs: 100.00');
      expect(screen.getByTestId('monthly-savings')).toHaveTextContent('Savings: Rs: 100.00');
    });
  });
});

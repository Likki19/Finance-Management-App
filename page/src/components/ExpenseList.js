import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { GET_TRANSACTIONS_BY_DATE, DELETE_TRANSACTION } from '../graphql';
import Header from './Header';
import './styles/IncomeExpense.css';

function ExpenseList() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem('userId');

  const { loading, error, data, refetch } = useQuery(GET_TRANSACTIONS_BY_DATE, {
    variables: {
      userId,
      startDate: new Date(year, month - 1, 1).toISOString().split('T')[0],
      endDate: new Date(year, month, 0).toISOString().split('T')[0]
    },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (location.state?.refetch) {
      refetch();
    }
  }, [location.state, refetch]);

  const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: [{
      query: GET_TRANSACTIONS_BY_DATE,
      variables: {
        userId,
        startDate: new Date(year, month - 1, 1).toISOString().split('T')[0],
        endDate: new Date(year, month, 0).toISOString().split('T')[0]
      }
    }],
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const expenses = data?.transactionsByDate
    ? data.transactionsByDate.filter(t => t.type === 'expense')
    : [];

  const handleEdit = (transaction) => {
    navigate(`/edit-transaction/${transaction.id}`, { state: { transaction } });
  };

  const onDeleteTransaction = async (id) => {
    const confirmed = window.confirm("Do you want to delete this transaction?");
    if (confirmed) {
      try {
        await deleteTransaction({ variables: { userId, id } });
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0).toFixed(2);

  return (
    <div id="expense-list" className="income-expense">
      <Header title="Expenses" />
      <div className="income-expense-content">
        <h2 className="income-expense-Header">Expenses</h2>
        <div className="filters">
          <select id="month-select" value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
          <select id="year-select" value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        {expenses.length === 0 ? (
          <p>No expense transactions found for this period.</p>
        ) : (
          <table id="expense-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.description}</td>
                  <td>Rs: {expense.amount}</td>
                  <td>{new Date(expense.date).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleEdit(expense)}>Edit</button>
                    <button onClick={() => onDeleteTransaction(expense.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="total">
          <h3>Total Expenses: Rs: {totalExpenses}</h3>
        </div>
      </div>
    </div>
  );
}

export default ExpenseList;

import React, { useState , useEffect} from 'react';
import { useQuery } from '@apollo/client';
import { GET_TRANSACTIONS_BY_DATE } from '../graphql';
import './styles/Savings.css';

const Savings = ({ userId }) => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedYearOnly, setSelectedYearOnly] = useState(currentDate.getFullYear());

  const handleMonthChange = (e) => setSelectedMonth(parseInt(e.target.value, 10));
  const handleYearChange = (e) => setSelectedYear(parseInt(e.target.value, 10));
  const handleYearOnlyChange = (e) => setSelectedYearOnly(parseInt(e.target.value, 10));

  const yearOnlyStartDate = new Date(selectedYearOnly, 1, 1).toISOString().split('T')[0];
  const yearOnlyEndDate = new Date(selectedYearOnly, 12, 31).toISOString().split('T')[0];

  const { loading, error, data, refetch } = useQuery(GET_TRANSACTIONS_BY_DATE, {
    variables: {
      userId,
      startDate: yearOnlyStartDate,
      endDate: yearOnlyEndDate,
    },
    skip: !userId, // Skip the query if `userId` is not available
  });

  // Use effect to refetch data on `selectedYearOnly` change
  useEffect(() => {
    if (userId) {
      refetch();
    }
  }, [selectedYearOnly, refetch, userId]);


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const transactions = data?.transactionsByDate || [];

  const calculateTotals = (transactions, filter) => {
    const income = transactions
      .filter(t => t.type === 'income' && filter(t))
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter(t => t.type === 'expense' && filter(t))
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expenses, savings: income - expenses };
  };

  const monthYearTotals = calculateTotals(transactions, 
    t => new Date(t.date).getMonth() + 1 === selectedMonth && new Date(t.date).getFullYear() === selectedYear
  );

  const yearOnlyTotals = calculateTotals(transactions, 
    t => new Date(t.date).getFullYear() === selectedYearOnly
  );

  return (
    <div className="savings" id="savings">
      <h2 data-testid="savings-title" id="savings-title">Savings</h2>
      <div className="savings-container">
        <div className="savings-section" id="monthly-savings">
          <h3 data-testid="monthly-savings-title" id="monthly-savings-title">Monthly Savings</h3>
          <div className="savings-controls" id="monthly-controls">
            <select value={selectedMonth} onChange={handleMonthChange} data-testid="month-select">
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={selectedYear}
              onChange={handleYearChange}
              min="1900"
              max={currentDate.getFullYear()}
              data-testid="year-input"
            />
          </div>
          <p data-testid="monthly-income" id="monthly-income">Income: Rs: {monthYearTotals.income.toFixed(2)}</p>
          <p data-testid="monthly-expenses" id="monthly-expenses">Expenses: Rs: {monthYearTotals.expenses.toFixed(2)}</p>
          <p data-testid="monthly-savings" id="monthly-savings">Savings: Rs: {monthYearTotals.savings.toFixed(2)}</p>
        </div>
        <div className="savings-section" id="yearly-savings">
          <h3 data-testid="yearly-savings-title" id="yearly-savings-title">Yearly Savings</h3>
          <div className="savings-controls" id="yearly-controls">
            <select value={selectedYearOnly} onChange={handleYearOnlyChange} data-testid="year-only-select">
              {Array.from({ length: 20 }, (_, i) => currentDate.getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <p data-testid="yearly-income" id="yearly-income">Income: Rs: {yearOnlyTotals.income.toFixed(2)}</p>
          <p data-testid="yearly-expenses" id="yearly-expenses">Expenses: Rs: {yearOnlyTotals.expenses.toFixed(2)}</p>
          <p data-testid="yearly-savings" id="yearly-savings">Savings: Rs: {yearOnlyTotals.savings.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Savings;

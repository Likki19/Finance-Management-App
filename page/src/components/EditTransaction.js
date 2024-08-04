import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { EDIT_TRANSACTION, GET_TRANSACTION_BY_ID, GET_TRANSACTIONS_BY_DATE } from '../graphql';
import DatePicker from './DatePicker';
import Header from './Header';
import './styles/AddEditTransaction.css';

const EditTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: '',
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [message, setMessage] = useState('');

  const { loading, error, data } = useQuery(GET_TRANSACTION_BY_ID, {
    variables: { id },
    fetchPolicy: 'network-only',
  });

  const [editTransaction] = useMutation(EDIT_TRANSACTION, {
    refetchQueries: [
      {
        query: GET_TRANSACTIONS_BY_DATE,
        variables: {
          userId,
          startDate: new Date(0).toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0]
        }
      }
    ],
  });

  useEffect(() => {
    if (data && data.transaction) {
      setFormData({
        description: data.transaction.description,
        amount: data.transaction.amount.toString(),
        type: data.transaction.type,
      });
      setSelectedDate(new Date(data.transaction.date));
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userConfirmed = window.confirm('Are you sure you want to update this transaction?');

    if (userConfirmed) {
      try {
        await editTransaction({
          variables: {
            userId,
            id,
            description: formData.description,
            amount: parseFloat(formData.amount),
            type: formData.type,
            date: selectedDate.toISOString().split('T')[0]
          }
        });
        setMessage('Transaction updated successfully.');
        setTimeout(() => navigate(`/${formData.type === 'income' ? 'income' : 'expenses'}`), 2000);
      } catch (error) {
        console.error('Error updating transaction:', error);
        setMessage('Error updating transaction.');
      }
    } else {
      setMessage('Transaction update canceled.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="edit-transaction-container" id="edit-transaction-page">
      <Header title="Edit Transaction" />
      <div className="edit-transaction-content">
        <form onSubmit={handleSubmit} className="edit-transaction-form" id="edit-transaction-form">
          <h2>Edit Transaction</h2>
          <input
            id="description-input"
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description"
            required
          />
          <input
            id="amount-input"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="Amount"
            required
            step="any"
          />
          <select 
            id="type-select"
            value={formData.type} 
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          <button type="submit" id="update-transaction-button">Update Transaction</button>
        </form>
        {message && (
          <p id="message" className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
        <Link to={`/${formData.type === 'income' ? 'income' : 'expenses'}`} className="back-link" id="back-link">
          Back to {formData.type === 'income' ? 'Income' : 'Expenses'}
        </Link>
      </div>
    </div>
  );
};

export default EditTransaction;
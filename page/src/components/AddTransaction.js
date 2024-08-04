import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_TRANSACTION, GET_TRANSACTIONS_BY_DATE } from '../graphql';
import { useNavigate } from 'react-router-dom';
import DatePicker from './DatePicker';
import Header from './Header';
import './styles/AddEditTransaction.css';


const formatDate = (date) => date.toISOString().split('T')[0];

const AddTransaction = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [message, setMessage] = useState('');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const [addTransaction] = useMutation(ADD_TRANSACTION, {
    update: (cache, { data: { addTransaction } }) => {
      const today = new Date();
      const cachedData = cache.readQuery({
        query: GET_TRANSACTIONS_BY_DATE,
        variables: {
          userId,
          startDate: formatDate(new Date(0)),
          endDate: formatDate(today)
        }
      });

      if (cachedData && cachedData.transactionsByDate) {
        cache.writeQuery({
          query: GET_TRANSACTIONS_BY_DATE,
          variables: {
            userId,
            startDate: formatDate(new Date(0)),
            endDate: formatDate(today)
          },
          data: {
            transactionsByDate: [...cachedData.transactionsByDate, addTransaction]
          }
        });
      }
    },
    onCompleted: (data) => {
      setMessage('Transaction added successfully.');
      setTimeout(() => {
        navigate(type === 'income' ? '/income' : '/expenses', { state: { refetch: true } });
      }, 2000);
    },
    onError: (error) => {
      console.error('Error saving transaction:', error);
      setMessage('Error saving transaction.');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || isNaN(amount) || parseFloat(amount) <= 0) {
      setMessage('Please provide valid transaction details.');
      return;
    }

    const userConfirmed = window.confirm('Are you sure you want to add this transaction?');

    if (userConfirmed) {
      const transactionData = {
        userId,
        description,
        amount: parseFloat(amount),
        type,
        date: formatDate(selectedDate),
      };

      try {
        await addTransaction({ variables: transactionData });
      } catch (error) {
        console.error('Error saving transaction:', error);
        setMessage('Error saving transaction.');
      }
    } else {
      setMessage('Transaction canceled.');
    }
  };

  return (
    <div className="add-edit-transaction-container" id="add-transaction-page">
      <Header title="Add Transaction" className="header" />
      <div className="add-transaction-content">
        <form onSubmit={handleSubmit} className="add-transaction-form">
        <h2>Add Transaction</h2>
        <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            required
            step="any"
          />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          <button type="submit">Add Transaction</button>
        </form>
        {message && (
          <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AddTransaction;
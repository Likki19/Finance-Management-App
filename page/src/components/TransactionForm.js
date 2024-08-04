import React from 'react';

function TransactionForm({ onSubmit, transactionData, setTransactionData }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...transactionData,
      amount: parseFloat(transactionData.amount),
      date: transactionData.date || new Date().toISOString().split('T')[0]
    });
  };

  const handleChange = (e) => {
    setTransactionData({
      ...transactionData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit}> {/* Fixed onSubmit handler */}
      <div>
        <label htmlFor="description">
          Description:
          <input
            id="description"
            type="text"
            name="description"
            value={transactionData.description}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label htmlFor="amount">
          Amount:
          <input
            id="amount"
            type="number"
            name="amount"
            value={transactionData.amount}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label htmlFor="type">
          Type:
          <select
            id="type"
            name="type"
            value={transactionData.type}
            onChange={handleChange}
            required
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
      </div>
      <div>
        <label htmlFor="date">
          Date:
          <input
            id="date"
            type="date"
            name="date"
            value={transactionData.date}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default TransactionForm;

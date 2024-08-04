import React from 'react';

function DateSelector({ startDate, endDate, onStartDateChange, onEndDateChange }) {
  return (
    <div>
      <label htmlFor="start-date">Start Date:</label>
      <input 
        id="start-date"
        type="date" 
        value={startDate} 
        onChange={(e) => onStartDateChange(e.target.value)} 
      />
      <label htmlFor="end-date">End Date:</label>
      <input 
        id="end-date"
        type="date" 
        value={endDate} 
        onChange={(e) => onEndDateChange(e.target.value)} 
      />
    </div>
  );
}

export default DateSelector;

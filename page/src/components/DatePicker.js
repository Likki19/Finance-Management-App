// DatePicker.js
import React from 'react';

const DatePicker = ({ selectedDate, setSelectedDate }) => {
  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  return (
    <input
      id="date-picker"
      type="date"
      value={selectedDate.toISOString().split('T')[0]}
      onChange={handleDateChange}
      data-testid="date-picker-input" // Add data-testid for easier querying
    />
  );
};

export default DatePicker;

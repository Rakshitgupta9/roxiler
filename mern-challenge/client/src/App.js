import React, { useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChartComponent from './components/BarChart';
import PieChartComponent from './components/PieChart';

const App = () => {
  const [month, setMonth] = useState('3');

  return (
    <div>
      <h1>Transactions</h1>
      <select value={month} onChange={e => setMonth(e.target.value)}>
        <option value="1">January</option>
        <option value="2">February</option>
        <option value="3">March</option>
        <option value="4">April</option>
        <option value="5">May</option>
        <option value="6">June</option>
        <option value="7">July</option>
        <option value="8">August</option>
        <option value="9">September</option>
        <option value="10">October</option>
        <option value="11">November</option>
        <option value="12">December</option>
      </select>
      <TransactionsTable month={month} />
      <Statistics month={month} />
      <BarChartComponent month={month} />
      <PieChartComponent month={month} />
    </div>
  );
};

export default App;

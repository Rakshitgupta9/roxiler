import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [month, setMonth] = useState('3');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTransactions();
  }, [month, search, page]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/api/transactions', {
        params: { month, search, page }
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions');
    }
  };

  return (
    <div>
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
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
      <button onClick={() => setPage(page + 1)}>Next</button>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date of Sale</th>
            <th>Sold</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction._id}>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              <td>{transaction.sold ? 'Yes' : 'No'}</td>
              <td>{transaction.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Statistics = ({ month }) => {
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    fetchStatistics();
  }, [month]);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get('/api/statistics', { params: { month } });
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics');
    }
  };

  return (
    <div>
      <h3>Statistics</h3>
      <p>Total Sale Amount: ${statistics.totalSaleAmount}</p>
      <p>Total Sold Items: {statistics.totalSoldItems}</p>
      <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
    </div>
  );
};

export default Statistics;

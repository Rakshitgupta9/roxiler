import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PieChartComponent = ({ month }) => {
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    fetchPieData();
  }, [month]);

  const fetchPieData = async () => {
    try {
      const response = await axios.get('/api/pie-chart', { params: { month } });
      setPieData(response.data);
    } catch (error) {
      console.error('Error fetching pie chart data');
    }
  };

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={pieData}
        cx={200}
        cy={200}
        labelLine={false}
        label={({ name, value }) => `${name}: ${value}`}
        outerRadius={80}
        fill="#8884d8"
        dataKey="count"
      >
        {pieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default PieChartComponent;

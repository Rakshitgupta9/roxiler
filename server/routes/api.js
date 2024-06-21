const express = require('express');
const axios = require('axios');
const Transaction = require('../models/Transaction');

const router = express.Router();

// Initialize Database
router.get('/initialize', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    await Transaction.insertMany(response.data);
    res.status(200).send('Database initialized with seed data');
  } catch (error) {
    res.status(500).send('Error initializing database');
  }
});

// List Transactions
router.get('/transactions', async (req, res) => {
  const { month, search, page = 1, per_page = 10 } = req.query;
  const regex = new RegExp(search, 'i');
  const matchMonth = new Date(2000, month - 1).getMonth();
  const filter = {
    dateOfSale: { $gte: new Date(2000, matchMonth, 1), $lt: new Date(2000, matchMonth + 1, 0) }
  };
  if (search) {
    filter.$or = [
      { title: regex },
      { description: regex },
      { price: { $regex: regex } }
    ];
  }
  try {
    const transactions = await Transaction.find(filter)
      .skip((page - 1) * per_page)
      .limit(Number(per_page));
    res.json(transactions);
  } catch (error) {
    res.status(500).send('Error fetching transactions');
  }
});

// Statistics API
router.get('/statistics', async (req, res) => {
  const { month } = req.query;
  const matchMonth = new Date(2000, month - 1).getMonth();
  const filter = {
    dateOfSale: { $gte: new Date(2000, matchMonth, 1), $lt: new Date(2000, matchMonth + 1, 0) }
  };
  try {
    const totalSaleAmount = await Transaction.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    const totalSoldItems = await Transaction.countDocuments({ ...filter, sold: true });
    const totalNotSoldItems = await Transaction.countDocuments({ ...filter, sold: false });
    res.json({
      totalSaleAmount: totalSaleAmount[0]?.total || 0,
      totalSoldItems,
      totalNotSoldItems
    });
  } catch (error) {
    res.status(500).send('Error fetching statistics');
  }
});

// Bar Chart API
router.get('/bar-chart', async (req, res) => {
  const { month } = req.query;
  const matchMonth = new Date(2000, month - 1).getMonth();
  const filter = {
    dateOfSale: { $gte: new Date(2000, matchMonth, 1), $lt: new Date(2000, matchMonth + 1, 0) }
  };
  const ranges = [
    { range: '0-100', min: 0, max: 100 },
    { range: '101-200', min: 101, max: 200 },
    { range: '201-300', min: 201, max: 300 },
    { range: '301-400', min: 301, max: 400 },
    { range: '401-500', min: 401, max: 500 },
    { range: '501-600', min: 501, max: 600 },
    { range: '601-700', min: 601, max: 700 },
    { range: '701-800', min: 701, max: 800 },
    { range: '801-900', min: 801, max: 900 },
    { range: '901-above', min: 901, max: Infinity }
  ];
  try {
    const barData = await Promise.all(ranges.map(async ({ range, min, max }) => {
      const count = await Transaction.countDocuments({ ...filter, price: { $gte: min, $lte: max } });
      return { range, count };
    }));
    res.json(barData);
  } catch (error) {
    res.status(500).send('Error fetching bar chart data');
  }
});

// Pie Chart API
router.get('/pie-chart', async (req, res) => {
  const { month } = req.query;
  const matchMonth = new Date(2000, month - 1).getMonth();
  const filter = {
    dateOfSale: { $gte: new Date(2000, matchMonth, 1), $lt: new Date(2000, matchMonth + 1, 0) }
  };
  try {
    const pieData = await Transaction.aggregate([
      { $match: filter },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    res.json(pieData.map(({ _id, count }) => ({ category: _id, count })));
  } catch (error) {
    res.status(500).send('Error fetching pie chart data');
  }
});

// Combined Data API
router.get('/combined-data', async (req, res) => {
  const { month } = req.query;
  try {
    const [statistics, barChart, pieChart] = await Promise.all([
      axios.get(`http://localhost:3000/api/statistics?month=${month}`),
      axios.get(`http://localhost:3000/api/bar-chart?month=${month}`),
      axios.get(`http://localhost:3000/api/pie-chart?month=${month}`)
    ]);
    res.json({
      statistics: statistics.data,
      barChart: barChart.data,
      pieChart: pieChart.data
    });
  } catch (error) {
    res.status(500).send('Error fetching combined data');
  }
});

module.exports = router;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { EnergyData, ChartAccessLog } = require('./db/model');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: [""],
  methods: ["POST", "GET"],
  credentials: true
}));

app.use(express.json());

//! connecting to mongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

//! Authentication middleware for Extra task
const authMiddleware = (req, res, next) => {
  const userId = req.headers['authorization'];
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
  }
  next();
};

//! Task-1 API route
app.get('/api/data', (req, res) => {
  fs.readFile(path.join(__dirname, 'data.json'), (err, data) => {
    if (err) {
      console.error('Error:', err);
      return res.status(500).json({ error: 'Error reading data' });
    }
    try {
      const jsonData = JSON.parse(data);
      const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
      const sortedData = dataArray.sort((a, b) => new Date(a.createdAt.$date) - new Date(b.createdAt.$date));
      res.json(sortedData);
    } catch (parseErr) {
      console.error('Parse Error:', parseErr);
      res.status(500).json({ error: 'Error parsing data' });
    }
  });
});

//! Task-2 API route
app.get('/api/energy-data', async (req, res) => {
  try {
    const data = await EnergyData.find({}).sort({ createdAt: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//! Task-3 API route
app.post('/api/chartAccess-log', authMiddleware, async (req, res) => {
  try {
    const { accessTime, accessDate, employeeName, algoStatus } = req.body;
    const newLog = new ChartAccessLog({ accessTime, accessDate, employeeName, algoStatus });
    await newLog.save();
    const energyData = await EnergyData.find({ algo_status: algoStatus }).sort({ createdAt: 1 });
    res.json({ success: true, data: energyData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.get("/api/getChartAccess-logs", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};

    if (startDate && endDate) {
      query.accessDate = {
        $gte: startDate,
        $lte: endDate
      };
    }

    const logs = await ChartAccessLog.find(query).sort({ accessDate: 1, accessTime: 1 });
    res.json(logs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const fs = require('fs');
const path = require('path');


app.use(cors());
app.use(express.json());


mongoose.connect('mongodb+srv://kamalnayan403:hXY9W04nXNpzgDRA@cluster0.lot43.mongodb.net/data')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const EnergyDataSchema = new mongoose.Schema({
  createdAt: Date,
  serialNo: String,
  total_kwh: Number,
  algo_status: Number,
  ac_run_hrs: Number,
  weather: {
    max_temp: Number,
    min_temp: Number
  }
});

const chartAccessLogSchema = new mongoose.Schema({
  accessTime: { type: String, required: true },
  accessDate: { type: String, required: true },
  employeeName: { type: String, required: true },
  algoStatus: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});
const EnergyData = mongoose.model('EnergyData', EnergyDataSchema);
const ChartAccessLog = mongoose.model('ChartAccessLog', chartAccessLogSchema);


app.post('/api/chartAccess-log', async (req, res) => {
  try {
    const { accessTime, accessDate, employeeName, algoStatus } = req.body;
    const newLog = new ChartAccessLog({
      accessTime,
      accessDate,
      employeeName,
      algoStatus,
    });
    await newLog.save();

    const energyData = await EnergyData.find({ algo_status: algoStatus })
    .sort({ createdAt: 1 });
    console.log(energyData);
    res.json({
      success: true,
      data: energyData,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/energy-data', async (req, res) => {
  try {
    
    const data = await EnergyData.find({})
    .sort({ createdAt: 1 })
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/data', (req, res) => {
  fs.readFile(path.join(__dirname, 'data.json'), (err, data) => {
    if (err) {
      console.error('Error:', err);
      return res.status(500).json({ error: 'Error reading data' });
    }

    try {
      const jsonData = JSON.parse(data);
      const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
      
      const sortedData = dataArray.sort((a, b) => {
        const dateA = new Date(a.createdAt.$date);
        const dateB = new Date(b.createdAt.$date);
        return dateA - dateB;
      });

      res.json(sortedData);
    } catch (parseErr) {
      console.error('Parse Error:', parseErr);
      res.status(500).json({ error: 'Error parsing data' });
    }
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
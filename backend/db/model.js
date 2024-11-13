const mongoose = require('mongoose');

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

module.exports = { EnergyData, ChartAccessLog };
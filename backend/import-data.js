//Completing Task2 i.e importing data to mongoDb

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');


const MONGODB_URI = process.env.MONGODB_URI;

const EnergyDataSchema = new mongoose.Schema({
    createdAt: Date,
    serialNo: String,
    clientID: mongoose.Schema.Types.ObjectId,
    deviceMapID: mongoose.Schema.Types.ObjectId,
    devices: [mongoose.Schema.Types.ObjectId],
    total_kwh: Number,
    updatedAt: Date,
    ac_run_hrs: Number,
    ac_fan_hrs: Number,
    algo_status: Number,
    billing_ammount: Number,
    cost_reduction: Number,
    energy_savings: {
      savings_percent: Number,
      ref_kwh: Number,
      us_meter: Number,
      us_calc: Number,
      inv_factor: Number
    },
    mitigated_co2: Number,
    weather: {
      max_temp: Number,
      min_temp: Number
    }
  }, { timestamps: true });

  const EnergyData = mongoose.model('EnergyData', EnergyDataSchema);

  async function importData() {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('Connected to MongoDB');
  
      const jsonPath = path.join(__dirname, 'data.json');
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
      const transformedData = data.map(item => ({
        ...item,
        _id: new mongoose.Types.ObjectId(item._id.$oid),
        createdAt: new Date(item.createdAt.$date),
        updatedAt: new Date(item.updatedAt.$date),
        clientID: new mongoose.Types.ObjectId(item.clientID.$oid),
        deviceMapID: new mongoose.Types.ObjectId(item.deviceMapID.$oid),
        devices: item.devices.map(device => new mongoose.Types.ObjectId(device.$oid))
      }));
  
      const result = await EnergyData.insertMany(transformedData);
      console.log(`Successfully imported ${result.length} records`);
  
    } catch (error) {
      console.error('Error importing data:', error);
    } finally {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
  }
  importData();
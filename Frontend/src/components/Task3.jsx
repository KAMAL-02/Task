import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Energy Consumption Over Time',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Energy Consumption (kWh)'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Date'
      }
    }
  }
};

const EnergyConsumptionChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Energy Consumption (kWh)',
      data: [],
      backgroundColor: 'rgba(75,192,192,0.6)',
      borderColor: 'rgba(75,192,192,1)',
      borderWidth: 1,
    }]
  });

  const [formData, setFormData] = useState({
    accessTime: '',
    accessDate: '',
    employeeName: '',
    algoStatus: '',
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/chartAccess-log', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = response.data.data;
      console.log('Raw data from backend:', data);

      if(Array.isArray(data) && data.length > 0){
        console.log('inside if 1')
        const dates = data.map(item => {
          const date = new Date(item.createdAt);
          return date.toLocaleDateString();
        });
        console.log('outside if 1')
        const energyConsumption = data.map(item => Number(item.total_kwh));
        console.log('energyconsumpotj')
        console.log('Processed dates:', dates);
        console.log('Processed energy consumption:', energyConsumption);

        if (energyConsumption.some(value => value > 0)) {
          setChartData({
            labels: dates,
            datasets: [{
              label: 'Energy Consumption (kWh)',
              data: energyConsumption,
              backgroundColor: 'rgba(75,192,192,0.6)',
              borderColor: 'rgba(75,192,192,1)',
              borderWidth: 1,
            }]
          });
        } else {
          setError('No energy consumption data available for the selected period.');
        }
      } else {
        setError('No data available for the selected period.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('An error occurred while fetching data. Please try again.');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">Access Time:</label>
          <input
            type="time"
            name="accessTime"
            value={formData.accessTime}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">Access Date:</label>
          <input
            type="date"
            name="accessDate"
            value={formData.accessDate}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">Employee Name:</label>
          <input
            type="text"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">Energy Saving Mode:</label>
          <select
            name="algoStatus"
            value={formData.algoStatus}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
          >
            <option value="">Select</option>
            <option value="1">ON</option>
            <option value="0">OFF</option>
          </select>
        </div>
        <button type="submit" className="w-full py-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Submit
        </button>
      </form>
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3>Energy Consumption Chart</h3>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            chartData.datasets[0].data.length > 0 ? (
              <Bar data={chartData} options={options} />
            ) : (
              <p>No data to display. Please submit the form to fetch data.</p>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default EnergyConsumptionChart;
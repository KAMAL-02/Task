import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import MoonLoader from "react-spinners/MoonLoader";

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

const Task1 = () => {
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
  const [isLoading, setIsLoading] = useState(true);
  
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_URL}/api/data`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          const dates = data.map(item => {
            const date = new Date(item.createdAt.$date);
            return date.toLocaleDateString();
          });
          
          const energyConsumption = data.map(item => Number(item.total_kwh));

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
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h3>Task-1</h3>
      <div className="bg-white rounded-lg shadow-lg border border-black p-6 flex items-center justify-center">
        
        {isLoading || error ? <MoonLoader size={40} /> : <Bar data={chartData} options={options} />}
      </div>
    </div>
  );
};

export default Task1;
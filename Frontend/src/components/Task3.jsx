import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import Form from "./Form";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import MoonLoader from "react-spinners/MoonLoader";

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
      position: "top",
    },
    title: {
      display: true,
      text: "Energy Consumption Over Time",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Energy Consumption (kWh)",
      },
    },
    x: {
      title: {
        display: true,
        text: "Date",
      },
    },
  },
};

const EnergyConsumptionChart = () => {
  const [isloading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Energy Consumption (kWh)",
        data: [],
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  });

  const [formData, setFormData] = useState({
    accessTime: "",
    accessDate: "",
    employeeName: "",
    algoStatus: "",
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
      setIsLoading(true);
      const userId = localStorage.getItem("userId");
      const response = await axios.post(
        "http://localhost:5000/api/chartAccess-log",
        formData,
        {
          headers: {
            Authorization: userId,
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data.data;

      if (Array.isArray(data) && data.length > 0) {
        const dates = data.map((item) =>
          new Date(item.createdAt).toLocaleDateString()
        );
        const energyConsumption = data.map((item) => Number(item.total_kwh));

        if (energyConsumption.some((value) => value > 0)) {
          setChartData({
            labels: dates,
            datasets: [
              {
                label: "Energy Consumption (kWh)",
                data: energyConsumption,
                backgroundColor: "rgba(75,192,192,0.6)",
                borderColor: "rgba(75,192,192,1)",
                borderWidth: 1,
              },
            ],
          });
        } else {
          setError(
            "No energy consumption data available for the selected period."
          );
        }
      } else {
        setError("No data available for the selected period.");
      }
    } catch (error) {
      setError("An error occurred while fetching data or Kindly Authenticate.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 justify-center items-center lg:flex-row">
      <Form
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
      <div className="w-full max-w-4xl mx-auto p-4">
        <h3>Task-3</h3>
        <div className="bg-white rounded-lg shadow-lg p-6 border border-black flex items-center justify-center">
          {isloading ? (
            <MoonLoader size={40} />
          ) : error ? (
            <p className="text-red-500">{error}</p> // Display error message in red if there's an error
          ) : chartData.datasets[0].data.length > 0 ? (
            <Bar data={chartData} options={options} />
          ) : (
            <p>No data to display. Please submit the form to fetch data.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnergyConsumptionChart;

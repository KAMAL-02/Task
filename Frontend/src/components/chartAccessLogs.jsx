import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MoonLoader } from 'react-spinners';

const ChartAccessLogs = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/getChartAccess-logs');
        setLogs(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (isLoading) return <div className="flex justify-center p-4"><MoonLoader /></div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Chart Access Logs</h2>
      {logs.length > 0 ? (
        <div className="max-h-80 overflow-y-auto">
          <ul className="space-y-2">
            {logs.map((log, index) => (
              <li key={index} className="p-4 bg-white shadow-md rounded">
                <p><strong>Access Time:</strong> {log.accessTime}</p>
                <p><strong>Access Date:</strong> {log.accessDate}</p>
                <p><strong>Employee Name:</strong> {log.employeeName}</p>
                <p><strong>Algo Status:</strong> {log.algoStatus ? 'ON' : 'OFF'}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center p-4">No logs available</div>
      )}
    </div>
  );
};

export default ChartAccessLogs;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MoonLoader } from 'react-spinners';

export default function ChartAccessLogs() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchLogs = async (start = '', end = '') => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/api/getChartAccess-logs`, {
        params: { startDate: start, endDate: end }
      });
      setLogs(response.data);
    } catch (err) {
      setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchLogs(startDate, endDate);
  };

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
    fetchLogs();
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 min-h-[400px]">
      <h2 className="text-2xl font-semibold mb-4">Chart Access Logs</h2>
      <form onSubmit={handleFilter} className="flex gap-4 mb-4">
        <label className="flex flex-col">
          <span className="mb-1">Start Date</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </label>
        <label className="flex flex-col">
          <span className="mb-1">End Date</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </label>
        <div className="flex items-end gap-2">
          <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">Filter</button>
          <button type="button" onClick={handleClearFilter} className="bg-gray-300 px-4 py-1 rounded">Clear</button>
        </div>
      </form>
      <div className="h-80 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
            <MoonLoader size={40} />
          </div>
        )}
        {error ? (
          <div className="h-full flex items-center justify-center text-red-500" role="alert">
            Error: {error}
          </div>
        ) : logs.length > 0 ? (
          <div className="h-full overflow-y-auto">
            <ul className="space-y-2">
              {logs.map((log) => (
                <li key={log._id} className="p-4 bg-white shadow-md rounded">
                  <p><strong>Access Time:</strong> {log.accessTime}</p>
                  <p><strong>Access Date:</strong> {log.accessDate}</p>
                  <p><strong>Employee Name:</strong> {log.employeeName}</p>
                  <p><strong>Algo Status:</strong> {log.algoStatus ? 'ON' : 'OFF'}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            No logs available
          </div>
        )}
      </div>
    </div>
  );
}
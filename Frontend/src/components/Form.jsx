//! AccessLogForm.js
import React from 'react';

const Form = ({ formData, handleChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md border border-black">
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
  );
};

export default Form;

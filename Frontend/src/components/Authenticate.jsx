import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const AuthButton = ({ onAuth }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleAuth = () => {
    try {
      setIsLoading(true);
      const uniqueId = uuidv4();
      localStorage.setItem("userId", uniqueId);
      onAuth(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setIsAuthenticated(true);
    }
  };

  return (
    <div>
    <button
      onClick={handleAuth}
      className="bg-gray-600 text-white p-2 rounded-md m-4 hover:bg-gray-700"
    >
      {isLoading ? "Loading..." : "Authenticate"}
    </button>
    {isAuthenticated && <p className="text-green-500">Authenticated</p>}
    </div>
  );
};

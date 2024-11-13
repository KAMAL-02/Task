//! In the actual implementation we would have get the data from the user like email and password and 
//! send it to the server to authenticate the user. But for the sake of simplicity we are just
//! generating a random id and storing it in the local storage to simulate the authentication process

import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const AuthButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuth = () => {
    try {
      setIsLoading(true);
      const uniqueId = uuidv4();
      localStorage.setItem("userId", uniqueId);
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

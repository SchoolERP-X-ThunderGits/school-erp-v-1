// src/context/UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUserContext = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [school, setSchool] = useState(null);

  // Load school data from sessionStorage when the component mounts
  useEffect(() => {
    const storedSchool = localStorage.getItem('school');
    if (storedSchool) {
      setSchool(JSON.parse(storedSchool));  // Load the school data from sessionStorage
    }
  }, []);

  // Function to update the school data
  const setSchoolData = (schoolData) => {
    setSchool(schoolData);
    localStorage.setItem('school', JSON.stringify(schoolData)); // Store it in sessionStorage
  };

  // Function to log out and clear the school data
  const logout = () => {
    setSchool(null);
    localStorage.removeItem('school'); // Clear from sessionStorage
  };

  return (
    <UserContext.Provider value={{ school, setSchoolData, logout }}>
      {children}
    </UserContext.Provider>
  );
};

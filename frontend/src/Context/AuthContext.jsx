/* eslint-disable react/prop-types */
// src/context/AuthContext.jsx
import React, { useState, useEffect, useContext } from 'react';
import getAuth from '../util/auth';

const AuthContext = React.createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [employee, setEmployee] = useState(null);

  const value = {
    isLogged,
    isAdmin,
    setIsAdmin,
    setIsLogged,
    employee,
    setEmployee,
  };

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const loggedInEmployee = await getAuth();
        if (loggedInEmployee.employee_token) {
          setIsLogged(true);
          if (loggedInEmployee.employee_role === 3) {
            setIsAdmin(true);
          }
          setEmployee(loggedInEmployee);
        }
      } catch (error) {
        console.error('Failed to retrieve authentication data', error);
      }
    };

    fetchAuth();
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

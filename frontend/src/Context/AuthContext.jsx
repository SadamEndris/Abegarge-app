/* eslint-disable react/prop-types */
// src/context/AuthContext.jsx

// Import React and the necessary hooks (useState, useEffect, useContext)
import React, { useState, useEffect, useContext } from "react";
// Import the getAuth function from the util folder, which handles authentication logic
import getAuth from "../util/auth";

// Create a new context object for the authentication data
const AuthContext = React.createContext();

// Custom hook to access the authentication context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext); // Returns the current context value (authentication data)
};

// Create a provider component that will wrap the entire app and pass authentication data
export const AuthProvider = ({ children }) => {
  // State to track if the user is logged in
  const [isLogged, setIsLogged] = useState(false);
  // State to track if the user is an admin
  const [isAdmin, setIsAdmin] = useState(false);
  // State to store the current employee information
  const [employee, setEmployee] = useState(null);

  // Create a value object to pass down the authentication states and functions via context
  const value = {
    isLogged, // Whether the user is logged in
    isAdmin, // Whether the user is an admin
    setIsAdmin, // Function to update admin status
    setIsLogged, // Function to update logged-in status
    employee, // Stores the current employee's data
    setEmployee, // Function to update the employee's data
  };

  // useEffect hook runs on component mount to check authentication status
  useEffect(() => {
    // Define an async function to fetch the authentication data
    const fetchAuth = async () => {
      try {
        // Call the getAuth function to check the logged-in user
        const loggedInEmployee = await getAuth();
        // Check if the employee token exists to confirm login
        if (loggedInEmployee.employee_token) {
          setIsLogged(true); // Set the user as logged in
          // If the user's role is 3, mark them as an admin
          if (loggedInEmployee.employee_role === 3) {
            setIsAdmin(true); // Set the user as an admin
          }
          setEmployee(loggedInEmployee); // Save the employee data in the state
        }
      } catch (error) {
        // Log any errors that occur during the authentication check
        console.error("Failed to retrieve authentication data", error);
      }
    };

    fetchAuth(); // Invoke the async function to check auth status on component mount
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Return the context provider wrapping around children, passing the authentication data
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

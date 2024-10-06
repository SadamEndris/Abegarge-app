/* eslint-disable react/prop-types */
// Disables the prop-types rule for this file from ESLint, usually used when prop types are not being validated

// Import React, the useState and useEffect hooks
import { useState, useEffect } from "react";

// Import the Navigate component to redirect to different routes
import { Navigate } from "react-router";

// Import a utility function to retrieve authentication information from local storage
import getAuth from "../../../util/auth";

const PrivateAuthRoute = ({ roles, children }) => {
  // State to track whether the authentication check is completed
  const [isChecked, setIsChecked] = useState(false);

  // State to track whether the user is logged in
  const [isLogged, setIsLogged] = useState(false);

  // State to track whether the user has the proper role and authorization
  const [isAuthorized, setIsAuthorized] = useState(false);

  // useEffect hook to run when the component mounts or when `roles` changes
  useEffect(() => {
    // Retrieve logged-in employee's details (such as token and role) from local storage
    const loggedInEmployee = getAuth();

    // Once the authentication data is retrieved
    loggedInEmployee.then((response) => {
      // Check if the user has a valid token, meaning they are logged in
      if (response.employee_token) {
        // Set the logged-in state to true
        setIsLogged(true);

        // Check if roles are provided, and the user’s role is included in the allowed roles
        if (
          roles &&
          roles.length > 0 &&
          roles.includes(response.employee_role)
        ) {
          // Set the authorization state to true if the user has the right role
          setIsAuthorized(true);
        }
      }
      // Set the checked state to true once the authentication process is completed
      setIsChecked(true);
    });
  }, [roles]); // Dependency array ensures this effect runs whenever the `roles` prop changes

  // If the authentication check is completed
  if (isChecked) {
    // If the user is not logged in, redirect them to the login page
    if (!isLogged) {
      return <Navigate to="/login" />;
    }

    // If the user is logged in but not authorized, redirect to the unauthorized page
    if (!isAuthorized) {
      return <Navigate to="/unauthorized" />;
    }
  }

  // If the user is logged in and authorized, render the children components (the route content)
  return children;
};

export default PrivateAuthRoute;

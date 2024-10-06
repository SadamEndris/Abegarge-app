import React from "react";
// Import the auth hook
import { useAuth } from "../../../Context/AuthContext";
// Import the login form component
import LoginForm from "../../components/LoginForm/LoginForm";

const Employees = () => {
  // Destructure the auth hook to get isLogged and isAdmin
  const { isLogged, isAdmin } = useAuth();

  // If the user is not logged in, show the login form
  if (!isLogged) {
    return (
      <div>
        <h1 className="text-danger text-center mt-5 h4">
          Please log in to access this page
        </h1>
        <LoginForm />
      </div>
    );
  }

  // If the user is logged in but not an admin, display an unauthorized access message
  if (isLogged && !isAdmin) {
    return (
      <div>
        <h1>You are not authorized to access this page</h1>
      </div>
    );
  }

  // If the user is logged in and is an admin, display the Employees page
  return (
    <div>
      <h1>Employees Page</h1>
      {/* Render the rest of the employees-related components or content */}
    </div>
  );
};

export default Employees;

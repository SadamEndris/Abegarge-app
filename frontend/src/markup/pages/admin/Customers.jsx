import React from "react";
// Import the auth hook to access the logged in user's information and role
import { useAuth } from "../../../Context/AuthContext";
// Import the login form component
import LoginForm from "../../components/LoginForm/LoginForm";
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";
import CustomerList from "../../components/Admin/CustomerList/CustomerList";

const Customers = () => {
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

  // If the user is logged in and is an admin, display the Customers page
  return (
    <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <AdminMenu />
          </div>
          <div className="col-md-9 admin-right-side">
            <CustomerList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;

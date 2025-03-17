import React from "react";
import { useAuth } from "../../../Context/AuthContext";
import LoginForm from "../../components/LoginForm/LoginForm";
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";
import AdminDashboard from "../../components/Admin/Dashboard/AdminDashboard";

const Admin = () => {
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
  return (
    <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <AdminMenu />
          </div>
          <div className="col-md-9 admin-right-side">
            <AdminDashboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

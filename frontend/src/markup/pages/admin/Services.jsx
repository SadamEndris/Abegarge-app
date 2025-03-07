import { useAuth } from "../../../Context/AuthContext";
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";
import ServiceList from "../../components/Admin/ServiceList/ServiceList";
import LoginForm from "../../components/LoginForm/LoginForm";

const Services = () => {
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
  // If the user is logged in and is an admin, display the Service page
  return (
    <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <AdminMenu />
          </div>
          <div className="col-md-9 admin-right-side">
            <ServiceList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;

// Import the Routes and Route components from react-router
import { Routes, Route } from "react-router-dom";
// Import the page components
import Home from "./markup/pages/Home";
import Login from "./markup/pages/Login";
import AddEmployee from "./markup/pages/admin/AddEmployee";
import Unauthorized from "./markup/pages/Unauthorized";
// import customers , employees, and orders pages
import Customers from "./markup/pages/admin/Customers";
import Employees from "./markup/pages/admin/Employees";
import Orders from "./markup/pages/admin/Orders";

// Import the css files
import "./assets/template_assets/css/bootstrap.css";
import "./assets/template_assets/css/style.css";
import "./assets/template_assets/css/responsive.css";
import "./assets/template_assets/css/color.css";

// Import the custom css file
import "./assets/styles/custom.css";

// Import the Header component
import Header from "./markup/components/Header/Header";
// Import the Footer component
import Footer from "./markup/components/Footer/Footer";
// import the PrivateAuthRoute component
import PrivateAuthRoute from "./markup/components/Auth/PrivateAuthRoute";
import EditEmployee from "./markup/pages/admin/EditEmployee";
import AddCustomer from "./markup/pages/admin/AddCustomer";
import EditCustomer from "./markup/pages/admin/EditCustomer";
import CustomerDetails from "./markup/pages/admin/CustomerDetails";
import Services from "./markup/pages/Services";
import Admin from "./markup/pages/admin/Admin";
import AboutUs from "./markup/pages/AboutUs";
import Contact from "./markup/pages/Contact";
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        {/* authorized routes */}
        {/* <Route path="/admin/orders" element={<Orders />} /> */}
        <Route
          path="/orders"
          element={
            <PrivateAuthRoute roles={[1, 2, 3]}>
              <Orders />
            </PrivateAuthRoute>
          }
        />
        {/* Protected route for employees */}
        <Route
          path="/admin/employees"
          element={
            <PrivateAuthRoute roles={[2, 3]}>
              <Employees />
            </PrivateAuthRoute>
          }
        />
        {/* Route for editing an employee (dynamic path) */}
        <Route
          path="/admin/edit-employee/:id"
          element={
            <PrivateAuthRoute roles={[3]}>
              <EditEmployee />
            </PrivateAuthRoute>
          }
        />
        {/* Route for editing an customer (dynamic path) */}
        <Route
          path="/admin/customer-details/:customer_id"
          element={
            <PrivateAuthRoute roles={[3]}>
              <CustomerDetails />
            </PrivateAuthRoute>
          }
        />
        <Route
          path="/admin/edit-customer/:id"
          element={
            <PrivateAuthRoute roles={[3]}>
              <EditCustomer />
            </PrivateAuthRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <PrivateAuthRoute roles={[2, 3]}>
              <Customers />
            </PrivateAuthRoute>
          }
        />
        {/* <Route path="/admin/add-employee" element={<AddEmployee />} /> */}
        <Route
          path="/admin/add-employee"
          element={
            <PrivateAuthRoute roles={[3]}>
              <AddEmployee />
            </PrivateAuthRoute>
          }
        />
        <Route
          path="/admin/add-customer"
          element={
            <PrivateAuthRoute roles={[3]}>
              <AddCustomer />
            </PrivateAuthRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <PrivateAuthRoute roles={[2, 3]}>
              <Customers />
            </PrivateAuthRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <PrivateAuthRoute roles={[3]}>
              <Services />
            </PrivateAuthRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateAuthRoute roles={[3]}>
              <Admin />
            </PrivateAuthRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

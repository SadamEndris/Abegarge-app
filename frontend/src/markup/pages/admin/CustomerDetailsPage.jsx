import React from "react";
import CustomerDetails from "../../components/Admin/CustomerDetails/CustomerDetails";
import { useParams } from "react-router-dom";
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";

const CustomerDetailsPage = () => {
  const { id } = useParams(); // Get the customer ID from the URL
  return (
    <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <AdminMenu />
          </div>
          <div className="col-md-9 admin-right-side p-5">
            {/* Pass the customer ID as a prop */}
            <CustomerDetails customerID={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsPage;

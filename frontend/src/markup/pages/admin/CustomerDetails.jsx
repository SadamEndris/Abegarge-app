import React from "react";
import { useParams } from "react-router-dom";
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";
import CustomerProfile from "../../components/Admin/CustomerDetails/CustomerProfile";

const CustomerDetails = () => {
  return (
    <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <AdminMenu />
          </div>
          <div className="col-md-9 admin-right-side p-5">
            <CustomerProfile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;

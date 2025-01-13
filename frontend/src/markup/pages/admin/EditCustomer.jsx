import React from "react";
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";
import EditCustomerForm from "../../components/Admin/EditCustomerForm/EditCustomerForm";
import { useParams } from "react-router-dom";

const EditCustomer = () => {
  const { id } = useParams(); // Get the employee ID from the URL

  return (
    <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <AdminMenu />
          </div>
          <div className="col-md-9 admin-right-side">
            {/* Pass the customer ID as a prop */}
            <EditCustomerForm customerId={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCustomer;

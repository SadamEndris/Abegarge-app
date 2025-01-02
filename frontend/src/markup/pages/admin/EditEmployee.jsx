import React from "react";
import { useParams } from "react-router-dom";
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";
import EditEmployeeForm from "../../components/Admin/EditEmployeeForm/EditEmployeeForm";

const EditEmployee = () => {
  const { id } = useParams(); // Get the employee ID from the URL

  return (
    <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <AdminMenu />
          </div>
          <div className="col-md-9 admin-right-side">
            {/* Pass the employee ID as a prop */}
            <EditEmployeeForm employeeId={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;

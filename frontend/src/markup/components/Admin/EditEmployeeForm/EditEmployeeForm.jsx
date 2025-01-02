import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import employeeService from "../../../../services/employee.service";
import { useAuth } from "../../../../Context/AuthContext";

const EditEmployeeForm = () => {
  const { id } = useParams(); // Extract employee ID from route params
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employee_first_name: "",
    employee_last_name: "",
    employee_phone: "",
    active_employee: false,
    company_role_id: "",
    employee_email: "",
  });

  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { employee } = useAuth();
  const token = employee ? employee.employee_token : null;

  // Fetch employee details on component mount
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const res = await employeeService.getEmployeeById(id, token);
        const data = await res.json();
        if (data.status === "success") {
          setFormData({
            employee_first_name: data.data.employee_first_name,
            employee_last_name: data.data.employee_last_name,
            employee_phone: data.data.employee_phone,
            active_employee: !!data.data.active_employee,
            company_role_id: data.data.company_role_id,
            employee_email: data.data.employee_email,
          });
        } else {
          setServerError(data.message || "Failed to load employee details.");
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
        setServerError("Failed to load employee details.");
      }
    };

    fetchEmployeeDetails();
  }, [id, token]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await employeeService.updateEmployee(
        id,
        formData,
        token
      );
      const data = await response.json();

      if (data.status === "success") {
        setSuccessMessage("Employee updated successfully!");
        setTimeout(() => navigate("/admin/employees"), 2000);
      } else {
        setServerError(data.message || "Failed to update employee.");
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      setServerError("Failed to update employee.");
    }
  };

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <section className="contact-section ml-5">
      <div className="auto-container">
        <div className="contact-title">
          <h2>
            Edit: {formData.employee_first_name} {formData.employee_last_name}
          </h2>
        </div>
        <div className="row clearfix">
          <div className="form-column col-lg-7">
            <div className="inner-column">
              <div className="contact-form">
                <form onSubmit={handleSubmit}>
                  <div className="row clearfix">
                    <div className="form-group col-md-12">
                      <label>Employee email: {formData.employee_email}</label>
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="employee_first_name"
                        value={formData.employee_first_name}
                        onChange={handleInputChange}
                        placeholder="First Name"
                      />
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="employee_last_name"
                        value={formData.employee_last_name}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                      />
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="employee_phone"
                        value={formData.employee_phone}
                        onChange={handleInputChange}
                        placeholder="Phone"
                      />
                    </div>
                    <div className="form-group col-md-12">
                      <select
                        name="company_role_id"
                        value={formData.company_role_id}
                        onChange={handleInputChange}
                      >
                        <option value={1}>Employee</option>
                        <option value={2}>Manager</option>
                        <option value={3}>Admin</option>
                      </select>
                    </div>
                    <div className="form-group col-md-12 ">
                      <label>
                        <input
                          type="checkbox"
                          name="active_employee"
                          checked={formData.active_employee}
                          onChange={handleInputChange}
                        />
                        <span className="ml-2">Is active employee</span>
                      </label>
                    </div>
                    <div className="form-group col-md-12">
                      <button type="submit" className="theme-btn btn-style-one">
                        <span>Update</span>
                      </button>
                    </div>
                  </div>
                </form>
                {serverError && (
                  <div className="validation-error" role="alert">
                    {serverError}
                  </div>
                )}
                {successMessage && (
                  <div className="success-message" role="alert">
                    {successMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditEmployeeForm;

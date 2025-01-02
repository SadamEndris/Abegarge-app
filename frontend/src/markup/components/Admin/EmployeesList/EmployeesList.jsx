import { useEffect, useState } from "react";
import { Table, Button, Alert } from "react-bootstrap";
import { useAuth } from "../../../../Context/AuthContext";
import { format, set } from "date-fns";
import employeeService from "../../../../services/employee.service";
import { FaEdit, FaTrash } from "react-icons/fa"; // FontAwesome edit and trash icons
import { useNavigate } from "react-router-dom";
const EmployeesList = () => {
  // States to store employee data and error messages
  const [employees, setEmployees] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate(); // Initialize navigate function

  // Getting the logged-in employee's token
  const { employee } = useAuth();
  let token = employee ? employee.employee_token : null;

  // Fetch employees when the component mounts
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await employeeService.getEmployees(token);
        if (!res.ok) {
          setApiError(true);
          if (res.status === 401) {
            setApiErrorMessage("Please login again");
          } else if (res.status === 403) {
            setApiErrorMessage("You are not authorized to access this page");
          } else {
            setApiErrorMessage("An error occurred. Please try again later");
          }
          return;
        }

        const data = await res.json();
        if (data.data && data.data.length > 0) {
          setEmployees(data.data);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        setApiError(true);
        setApiErrorMessage(
          "Failed to fetch employees. Please try again later."
        );
      }
    };

    fetchEmployees();
  }, [token]);

  // Redirect to EditEmployee page
  const handleEditClick = (employeeId) => {
    navigate(`/admin/edit-employee/${employeeId}`);
  };
  // handleDeleteClick function to delete an employeeService
  const handleDeleteClick = async (employeeId) => {
    try {
      const response = await employeeService.deleteEmployee(employeeId, token);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const updatedEmployees = employees.filter(
            (employee) => employee.employee_id !== employeeId
          );
          setEmployees(updatedEmployees);
          setSuccessMessage(data.message);
          setTimeout(() => setSuccessMessage(""), 1000); // Clear message after 1 seconds
        } else {
          console.error("Error deleting employee:", data.message);
        }
      } else {
        console.error("Error deleting employee:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <>
      {apiError ? (
        <section className="contact-section">
          <div className="auto-container">
            <div className="contact-title">
              <h2>{apiErrorMessage}</h2>
            </div>
          </div>
        </section>
      ) : (
        <section className="contact-section">
          <div className="auto-container">
            <div className="contact-title">
              <h2>Employees</h2>
            </div>
            {/* Display Success Message */}
            {successMessage && (
              <Alert variant="success" className="mb-4 success-alert">
                {successMessage}
              </Alert>
            )}
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Active</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Added Date</th>
                  <th>Role</th>
                  <th>Edit/Delete</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.employee_id}>
                    <td>{employee.active_employee ? "Yes" : "No"}</td>
                    <td>{employee.employee_first_name}</td>
                    <td>{employee.employee_last_name}</td>
                    <td>{employee.employee_email}</td>
                    <td>{employee.employee_phone}</td>
                    <td>
                      {format(
                        new Date(employee.added_date),
                        "MM - dd - yyyy | kk:mm"
                      )}
                    </td>
                    <td>{employee.company_role_name}</td>
                    <td>
                      <div className="edit-delete-icons text-center">
                        {/* Edit Icon with onClick event */}
                        <FaEdit
                          style={{ cursor: "pointer", marginRight: "10px" }}
                          title="Edit Employee"
                          onClick={() => handleEditClick(employee.employee_id)}
                        />
                        {/* Delete Icon with onClick event */}
                        <FaTrash
                          style={{ cursor: "pointer" }}
                          title="Delete Employee"
                          onClick={(e) => {
                            e.preventDefault(); // Prevent any default behavior
                            e.stopPropagation(); // Stop the event from bubbling up
                            handleDeleteClick(employee.employee_id);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </section>
      )}
    </>
  );
};

export default EmployeesList;

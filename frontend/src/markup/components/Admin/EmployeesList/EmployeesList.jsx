import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { useAuth } from "../../../../Context/AuthContext";
import { format } from "date-fns";
import employeeService from "../../../../services/employee.service";

const EmployeesList = () => {
  // States to store employee data and error messages
  const [employees, setEmployees] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);

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
                      <div className="edit-delete-icons">edit | delete</div>
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

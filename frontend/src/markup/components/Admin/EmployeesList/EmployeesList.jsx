import { useEffect, useState } from "react";
import { Table, Alert, Pagination } from "react-bootstrap";
import { useAuth } from "../../../../Context/AuthContext";
import { format } from "date-fns";
import employeeService from "../../../../services/employee.service";
import { FaEdit, FaTrash } from "react-icons/fa"; // FontAwesome edit and trash icons
import { useNavigate } from "react-router-dom";

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // Number of items per page
  const navigate = useNavigate();

  const { employee } = useAuth();
  let token = employee ? employee.employee_token : null;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await employeeService.getEmployees(token);
        if (!res.ok) {
          setApiError(true);
          if (res.status === 401) {
            setApiErrorMessage("Please login again.");
          } else if (res.status === 403) {
            setApiErrorMessage("You are not authorized to access this page.");
          } else {
            setApiErrorMessage("An error occurred. Please try again later.");
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

  const handleEditClick = (employeeId) => {
    navigate(`/admin/edit-employee/${employeeId}`);
  };

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
          setTimeout(() => setSuccessMessage(""), 2000); // Clear after 2 seconds
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

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderEmployeeRows = () => {
    // Pagination logic
    const indexOfLastEmployee = currentPage * itemsPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
    const currentEmployees = employees.slice(
      indexOfFirstEmployee,
      indexOfLastEmployee
    );

    return currentEmployees.map((employee) => (
      <tr key={employee.employee_id}>
        <td>{employee.employee_id}</td>
        <td>{employee.active_employee ? "Yes" : "No"}</td>
        <td>{employee.employee_first_name}</td>
        <td>{employee.employee_last_name}</td>
        <td>{employee.employee_email}</td>
        <td>{employee.employee_phone}</td>
        <td>{format(new Date(employee.added_date), "MM-dd-yyyy | kk:mm")}</td>
        <td>{employee.company_role_name}</td>
        <td>
          <div className="d-flex  justify-content-center text-center ">
            <FaEdit
              className="mr-2 text-gray-800"
              style={{ cursor: "pointer" }}
              title="Edit Employee"
              onClick={() => handleEditClick(employee.employee_id)}
            />
            <FaTrash
              className="text-gray-800"
              style={{ cursor: "pointer" }}
              title="Delete Employee"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDeleteClick(employee.employee_id);
              }}
            />
          </div>
        </td>
      </tr>
    ));
  };

  const totalPages = Math.ceil(employees.length / itemsPerPage);

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
            {successMessage && (
              <Alert variant="success" className="mb-4 success-alert">
                {successMessage}
              </Alert>
            )}
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
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
              <tbody>{renderEmployeeRows()}</tbody>
            </Table>
            {/* Pagination Controls */}
            <Pagination className="mt-4 text-center justify-content-center">
              <Pagination.Prev
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </section>
      )}
    </>
  );
};

export default EmployeesList;

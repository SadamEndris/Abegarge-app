import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { Table, Alert, Pagination } from "react-bootstrap";
import { useAuth } from "../../../../Context/AuthContext";
import { format } from "date-fns";
import customerService from "../../../../services/customer.service";
import { FaEdit, FaExternalLinkAlt } from "react-icons/fa"; // FontAwesome edit and trash icons
import { useNavigate } from "react-router-dom";
import classes from "./CustomerList.module.css"; // Importing your CSS module

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [itemsPerPage] = useState(8); // Number of items per page
  const navigate = useNavigate();

  const { employee } = useAuth();
  let token = employee ? employee.employee_token : null;

  // Debounce the search term to prevent making too many API requests
  // by wating for the user to stop typing for 500ms
  useDebounce(() => setDebouncedSearchTerm(searchQuery), 500, [searchQuery]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await customerService.getCustomers(token);
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
          setCustomers(data.data);
          setFilteredCustomers(data.data);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        setApiError(true);
        setApiErrorMessage(
          "Failed to fetch customers. Please try again later."
        );
      }
    };

    fetchCustomers();
  }, [token]);

  useEffect(() => {
    const lowerCaseQuery = debouncedSearchTerm.toLowerCase();
    const filtered = customers.filter((customer) => {
      return (
        customer.customer_first_name.toLowerCase().includes(lowerCaseQuery) ||
        customer.customer_last_name.toLowerCase().includes(lowerCaseQuery) ||
        customer.customer_email.toLowerCase().includes(lowerCaseQuery) ||
        customer.customer_phone_number.toLowerCase().includes(lowerCaseQuery)
      );
    });
    setFilteredCustomers(filtered);
    setCurrentPage(1); // Reset to first page when search query changes
  }, [debouncedSearchTerm, customers]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEditClick = (customerId) => {
    navigate(`/admin/edit-customer/${customerId}`);
  };

  // handle detail click
  const handleDetailClick = (customer_id) => {
    navigate(`/admin/customer-details/${customer_id}`);
  };

  const renderCustomerRows = () => {
    // Pagination logic with filtered customers
    const indexOfLastCustomer = currentPage * itemsPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;
    const currentCustomers = filteredCustomers.slice(
      indexOfFirstCustomer,
      indexOfLastCustomer
    );

    if (currentCustomers.length === 0) {
      return (
        <tr>
          <td colSpan="8" className="text-center">
            No customers match your search query.
          </td>
        </tr>
      );
    }

    return currentCustomers.map((customer) => (
      <tr key={customer.customer_id}>
        <td>{customer.customer_id}</td>
        <td>{customer.customer_first_name}</td>
        <td>{customer.customer_last_name}</td>
        <td>{customer.customer_email}</td>
        <td>{customer.customer_phone_number}</td>
        <td>
          {format(new Date(customer.customer_added_date), "MM-dd-yyyy | kk:mm")}
        </td>
        <td>{customer.active_customer_status ? "Yes" : "No"}</td>
        <td>
          <div className="d-flex justify-content-center align-items-center text-center">
            <FaEdit
              className="mr-2 text-gray-400 cursor-pointer text-base"
              title="Edit customer"
              onClick={() => handleEditClick(customer.customer_id)}
            />
            <FaExternalLinkAlt
              className="text-gray-400  cursor-pointer "
              title="View customer details"
              onClick={() => handleDetailClick(customer.customer_id)}
            />
          </div>
        </td>
      </tr>
    ));
  };

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

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
              <h2>Customers</h2>
            </div>
            {/* Search Input */}
            <div className={classes.search_container}>
              <input
                type="text"
                placeholder="Search for a customer using first name, last name, email address or phone number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={classes.search_input}
              />
              <span className={classes.search_icon}>
                <i className="fa fa-search"></i>
              </span>
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
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Added Date</th>
                  <th>Active</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>{renderCustomerRows()}</tbody>
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

export default CustomerList;

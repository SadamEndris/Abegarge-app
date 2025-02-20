import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import customerService from "../../../../services/customer.service";
import { FaEdit } from "react-icons/fa";
import styles from "./CustomerDetails.module.css";
import { useAuth } from "../../../../Context/AuthContext";

const CustomerDetails = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { employee } = useAuth();
  const token = employee?.employee_token || null;

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (!token || !customerId) {
        setError("Authentication or customer information is missing.");
        setLoading(false);
        return;
      }

      try {
        const res = await customerService.getCustomerById(customerId, token);
        if (!res.ok) {
          if (res.status === 401) {
            setError("Please login again.");
          } else if (res.status === 403) {
            setError("You are not authorized to view this page.");
          } else {
            setError("An error occurred. Please try again later.");
          }
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (data?.success && data?.data) {
          setCustomer(data.data);
          setVehicles(data.data.vehicles || []);
          setOrders(data.data.orders || []);
        } else {
          setError("Customer not found.");
        }
      } catch (err) {
        console.error("Error fetching customer details:", err);
        setError("Failed to fetch customer details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [token, customerId]);

  const handleEditClick = () => navigate(`/admin/edit-customer/${customerId}`);
  const handleAddVehicleClick = () =>
    navigate(`/admin/add-vehicle/${customerId}`);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className={styles.errorMessage}>{error}</div>;

  return (
    <div className={styles.customerDetailsContainer}>
      {/* Left Vertical Menu */}
      <div className={styles.verticalMenu}>
        <div className={styles.menuItem}>Info</div>
        <div className={styles.verticalLine}></div>
        <div className={styles.menuItem}>Cars</div>
        <div className={styles.verticalLine}></div>
        <div className={styles.menuItem}>Orders</div>
      </div>

      {/* Main Content */}
      <div className={styles.customerDetailsContent}>
        {/* Customer Info Section */}
        <div className={styles.customerInfo}>
          <h3>
            Customer: {customer.customer_first_name}{" "}
            {customer.customer_last_name}
          </h3>
          <p>
            <strong>Email:</strong> {customer.customer_email}
          </p>
          <p>
            <strong>Phone Number:</strong> {customer.customer_phone_number}
          </p>
          <p>
            <strong>Active Customer:</strong>{" "}
            {customer.active_customer_status ? "Yes" : "No"}
          </p>
          <p>
            <strong> Edit customer info:</strong>
            <FaEdit
              onClick={handleEditClick}
              className={styles.editIcon}
              title="Edit customer"
            />
          </p>
        </div>

        {/* Vehicles Section */}
        <div className={styles.customerVehicles}>
          <h4>Vehicles of {customer.customer_first_name}</h4>
          {vehicles.length > 0 ? (
            <ul className="list-group">
              {vehicles.map((vehicle) => (
                <li className="list-group-item" key={vehicle.vehicle_id}>
                  {vehicle.vehicle_make} {vehicle.vehicle_model} (
                  {vehicle.vehicle_year})
                </li>
              ))}
            </ul>
          ) : (
            <div className="card border-none">
              <div className="card-body text-sm-left text-muted font-weight-lighter pl-3 py-2">
                <small>No vehicle found</small>
              </div>
            </div>
          )}
          <button
            className="btn btn-danger mt-3"
            onClick={handleAddVehicleClick}
          >
            Add New Vehicle
          </button>
        </div>

        {/* Orders Section */}
        <div className={styles.customerOrders}>
          <h4>Orders of {customer.customer_first_name}</h4>
          {orders.length > 0 ? (
            <ul>
              {orders.map((order) => (
                <li key={order.order_id}>
                  Order #{order.order_id}: {order.order_description}
                </li>
              ))}
            </ul>
          ) : (
            <p>Orders will be displayed here</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;

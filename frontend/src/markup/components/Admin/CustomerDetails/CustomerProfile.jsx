import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import customerService from "../../../../services/customer.service";
import { FaEdit } from "react-icons/fa";
import styles from "./CustomerProfile.module.css";
import { useAuth } from "../../../../Context/AuthContext";
import { Button, Card, Modal, Form, Row, Col } from "react-bootstrap";
import { FcFullTrash } from "react-icons/fc";
import vehicleService from "../../../../services/vehicle.service";

const CustomerProfile = () => {
  const { customer_id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  //   const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [formData, setFormData] = useState({
    vehicle_make: "",
    vehicle_model: "",
    vehicle_year: "",
    vehicle_color: "",
    vehicle_tag: "",
    vehicle_mileage: "",
    vehicle_serial: "",
  });

  const { employee } = useAuth();
  const token = employee?.employee_token || null;

  // fetch customer details by ID
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (!token || !customer_id) {
        setError("Authentication or customer information is missing.");
        setLoading(false);
        return;
      }

      try {
        const res = await customerService.getCustomerById(customer_id, token);
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
          //   setVehicles(data.data.vehicles || []);
          //   setOrders(data.data.orders || []);
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
  }, [token, customer_id]);

  console.log(customer);

  //   fetch vehicles for the customer
  useEffect(() => {
    const fetchCustomerVehicles = async () => {
      try {
        const res = await vehicleService.getAllCustomerVehicles(
          token,
          customer_id
        );
        const data = await res.json();
        console.log("Vehicles data response:", data);

        if (data.status === "success") {
          setVehicles(data.data);
        } else {
          setVehicles([]);
        }
      } catch (error) {
        console.error("Error fetching customer vehicles", error);
      }
    };

    fetchCustomerVehicles();
  }, [token, customer_id]);

  console.log(vehicles);

  const handleEditClick = (customerId) => {
    navigate(`/admin/edit-customer/${customerId}`);
  };

  const handleAddVehicleClick = () => {
    setShowAddVehicleForm(true);
  };

  //   const handleVehicleAdded = (newVehicle) => {
  //     setVehicles((prevVehicles) => [...prevVehicles, newVehicle]);
  //     setShowAddVehicleForm(false);
  //   };

  if (!customer) {
    return <div>Loading...</div>;
  }
  if (error) return <div className={styles.errorMessage}>{error}</div>;

  return (
    <div className="container mt-4">
      <Row>
        <Col md={2}>
          <div className="d-flex flex-column align-items-center position-relative">
            <div
              style={{
                position: "absolute",
                top: "50px",
                bottom: "50px",
                width: "2px",
                backgroundColor: "#e0e0e0",
                zIndex: 0,
              }}
            ></div>

            <Button
              variant="danger"
              className="mb-5 rounded-circle"
              style={{
                width: "100px",
                height: "100px",
                position: "relative",
                zIndex: 1,
              }}
            >
              Info
            </Button>
            <Button
              variant="danger"
              className="mb-5 rounded-circle"
              style={{
                width: "100px",
                height: "100px",
                position: "relative",
                zIndex: 1,
              }}
            >
              Cars
            </Button>
            <Button
              variant="danger"
              className="rounded-circle"
              style={{
                width: "100px",
                height: "100px",
                position: "relative",
                zIndex: 1,
              }}
            >
              Orders
            </Button>
          </div>
        </Col>
        <Col md={10}>
          {/* customer details */}
          <div className="my-3 ">
            <h3 className="text-2xl font-bold text-blue-800 mb-3">
              Customer: {customer.customer_first_name}{" "}
              {customer.customer_last_name}
            </h3>
            <p className="mb-0">
              <strong>Email:</strong>{" "}
              <span className="text-gray-400">{customer.customer_email}</span>
            </p>
            <p className="mb-0">
              <strong>Phone Number:</strong>
              <span className="text-gray-400">
                {" "}
                {customer.customer_phone_number}
              </span>
            </p>
            <p className="mb-0">
              <strong>Active Customer:</strong>{" "}
              <span className="text-gray-400">
                {customer.active_customer ? "Yes" : "No"}
              </span>
            </p>
            <p className="flex items-center gap-2 mb-0">
              <strong>Edit Customer info:</strong>{" "}
              <FaEdit
                className="text-red-400 me-3"
                style={{ cursor: "pointer" }}
                // onclick give handleEdit pass customer_id
                onClick={() => handleEditClick(customer.customer_id)}
                title="Edit customer"
              />
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-blue-800">
              Vehicles of {customer.customer_first_name}
            </h3>

            {vehicles.length > 0 ? (
              <div className="flex-wrap gap-3 d-flex">
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.vehicle_id}
                    className="p-3 my-2 bg-white rounded shadow card"
                    style={{ width: "18rem" }}
                  >
                    <div className="card-body">
                      <h5 className="card-title">
                        {vehicle.vehicle_make} {vehicle.vehicle_model}
                      </h5>
                      <p className="card-text">
                        <strong>Vehicle color:</strong>{" "}
                        <span className="text-gray-400">
                          {vehicle.vehicle_color}
                        </span>
                      </p>
                      <p className="card-text">
                        <strong>Vehicle tag:</strong>{" "}
                        <span className="text-gray-400">
                          {vehicle.vehicle_tag}
                        </span>
                      </p>
                      <p className="card-text">
                        <strong>Vehicle year:</strong>{" "}
                        <span className="text-gray-400">
                          {vehicle.vehicle_year}
                        </span>
                      </p>
                      <p className="card-text">
                        <strong>Vehicle mileage:</strong>{" "}
                        <span className="text-gray-400">
                          {vehicle.vehicle_mileage}
                        </span>
                      </p>
                      <p className="card-text">
                        <strong>Vehicle serial:</strong>{" "}
                        <span className="text-gray-400">
                          {vehicle.vehicle_serial}
                        </span>
                      </p>
                      <div className="d-flex justify-content-between">
                        <Button
                          variant="link"
                          //   onClick={() => handleEditVehicleClick(vehicle)}
                        >
                          <i className="fa fa-edit"></i> Edit
                        </Button>
                        <Button
                          className="border-0 bg-inherit"
                          //   onClick={() =>
                          //     handleDeleteVehicle(vehicle.vehicle_id)
                          //   }
                        >
                          <FcFullTrash />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No vehicles found</p>
            )}

            {!showAddVehicleForm && (
              <Button variant="danger" onClick={handleAddVehicleClick}>
                Add New Vehicle
              </Button>
            )}
          </div>

          {showAddVehicleForm && (
            <Card className="mb-4">
              <Card.Body>
                {/* <AddVehicleForm
									customer_id={customer_id}
									onVehicleAdded={handleVehicleAdded}
								/> */}
                <h1>Vehicle forms </h1>
              </Card.Body>
            </Card>
          )}

          {/* orders */}
          {/* <div className="my-6">
						<h3 className="text-2xl font-bold text-blue-800">
							Orders of {customer.customer_first_name}
						</h3>
						{orders.length > 0 ? (
							<ul>
								{orders.map((order) => (
									<li key={order.order_id} className="mb-2">
										<div className="flex flex-row gap-4 ">
											<p className="mt-1 text-lg font-bold">
												Order #{order.order_id}{" "}
											</p>
											<Link to={`/admin/order/${order.order_id}`}>
												<button
													// variant="danger"
													className="px-2 py-1 text-white bg-gray-700 hover:bg-gray-500 hover:translate-x-2 "
												>
													View Order Details
												</button>
											</Link>
										</div>
									</li>
								))}
							</ul>
						) : (
							<p>Orders will be displayed here</p>
						)}
					</div> */}
        </Col>
      </Row>

      {/* Bootstrap Modal for editing vehicle */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Vehicle Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Vehicle Make</Form.Label>
              <Form.Control
                type="text"
                value={formData.vehicle_make}
                onChange={(e) =>
                  setFormData({ ...formData, vehicle_make: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Vehicle Model</Form.Label>
              <Form.Control
                type="text"
                value={formData.vehicle_model}
                onChange={(e) =>
                  setFormData({ ...formData, vehicle_model: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Vehicle Year</Form.Label>
              <Form.Control
                type="number"
                value={formData.vehicle_year}
                onChange={(e) =>
                  setFormData({ ...formData, vehicle_year: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Vehicle Color</Form.Label>
              <Form.Control
                type="text"
                value={formData.vehicle_color}
                onChange={(e) =>
                  setFormData({ ...formData, vehicle_color: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Vehicle Mileage</Form.Label>
              <Form.Control
                type="number"
                value={formData.vehicle_mileage}
                onChange={(e) =>
                  setFormData({ ...formData, vehicle_mileage: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Vehicle Serial</Form.Label>
              <Form.Control
                type="text"
                value={formData.vehicle_serial}
                onChange={(e) =>
                  setFormData({ ...formData, vehicle_serial: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary">Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomerProfile;

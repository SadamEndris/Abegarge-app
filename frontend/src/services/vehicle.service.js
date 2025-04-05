// a function to send the login request to the server
const api_url = import.meta.env.VITE_API_URL;

// a function to create a new vehicle
const createVehicle = async (formData, token) => {
  // Add token as a parameter
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  };

  const response = await fetch(
    `${api_url}/api/vehicle/add-vehicle`,
    requestOptions
  );
  return response;
};

// a function to get all vehicles
const getAllVehicles = async (token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${api_url}/api/vehicles`, requestOptions);
  return response;
};

// a function to get all vehicles for a specific customer
const getAllCustomerVehicles = async (token, customer_id) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(
    `${api_url}/api/vehicles/${customer_id}`,
    requestOptions
  );
  return response;
};

// a function to get a vehicle by vehicle_id
const getVehicleById = async (vehicle_id, token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(
    `${api_url}/api/vehicle/${vehicle_id}`,
    requestOptions
  );
  return response;
};

// a function to update a vehicle
const updateVehicle = async (vehicle_id, formData, token) => {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  };

  const response = await fetch(
    `${api_url}/api/vehicle/${vehicle_id}`,
    requestOptions
  );
  return response;
};

// a function to delete a vehicle
const deleteVehicle = async (vehicle_id, token) => {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(
    `${api_url}/api/vehicle/${vehicle_id}`,
    requestOptions
  );
  return response;
};

// Exporting the functions
const vehicleService = {
  createVehicle,
  getAllVehicles,
  getAllCustomerVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};

export default vehicleService;

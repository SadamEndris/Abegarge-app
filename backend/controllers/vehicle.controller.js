// vehicle.controller.js
const vehicleService = require("../services/vehicle.service");

// Function to add a new vehicle for a customer
const addVehicle = async (req, res) => {
  const vehicleData = req.body;

  // Validate required fields
  if (
    !vehicleData.customer_id ||
    !vehicleData.vehicle_model ||
    !vehicleData.vehicle_year ||
    !vehicleData.vehicle_make ||
    !vehicleData.vehicle_type ||
    !vehicleData.vehicle_mileage ||
    !vehicleData.vehicle_serial ||
    !vehicleData.vehicle_tag ||
    !vehicleData.vehicle_color
  ) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  try {
    // Verify that the customer_id exists in the customer_info table
    const isCustomerValid = await vehicleService.checkCustomerExists(
      vehicleData.customer_id
    );
    if (!isCustomerValid) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Invalid customer ID",
      });
    }

    // Add the new vehicle (without checking for an existing vehicle by this customer)
    await vehicleService.addVehicle(vehicleData);

    return res.status(201).json({
      message: "Vehicle created successfully",
      success: "true",
    });
  } catch (error) {
    console.error("Error in controller:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

// Function to get all vehicles for a specific customer by customer_id
const getAllCustomerVehicles = async (req, res) => {
  const customer_id = parseInt(req.params.customer_id, 10);

  if (isNaN(customer_id)) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Invalid customer ID",
    });
  }

  try {
    // Call the service to get all vehicles for the customer
    const vehicles = await vehicleService.getVehiclesByCustomerId(customer_id);

    return res.status(200).json({
      customer_id: customer_id,
      vehicles: vehicles,
    });
  } catch (error) {
    console.error("Error in controller:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

const getVehicleById = async (req, res) => {
  const customer_id = parseInt(req.params.customer_id, 10);
  const vehicle_id = parseInt(req.params.vehicle_id, 10);

  // Validate parameters
  if (isNaN(customer_id) || isNaN(vehicle_id)) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Invalid customer ID or vehicle ID",
    });
  }

  try {
    // Call service to retrieve the vehicle details
    const vehicle = await vehicleService.getVehicleById(
      customer_id,
      vehicle_id
    );

    if (!vehicle) {
      // If the vehicle is not found
      return res.status(404).json({
        error: "Not Found",
        message: "Vehicle not found",
      });
    }

    return res.status(200).json(vehicle);
  } catch (error) {
    console.error("Error in controller:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

const updateVehicle = async (req, res) => {
  const vehicleData = req.body;

  // Validate required fields
  if (
    !vehicleData.vehicle_id ||
    !vehicleData.customer_id ||
    !vehicleData.vehicle_model ||
    !vehicleData.vehicle_year ||
    !vehicleData.vehicle_make ||
    !vehicleData.vehicle_type ||
    !vehicleData.vehicle_mileage ||
    !vehicleData.vehicle_serial ||
    !vehicleData.vehicle_tag ||
    !vehicleData.vehicle_color
  ) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  try {
    // Verify that the vehicle exists
    const vehicleExists = await vehicleService.checkVehicleExists(
      vehicleData.vehicle_id,
      vehicleData.customer_id
    );
    if (!vehicleExists) {
      return res.status(404).json({
        error: "Not Found",
        message: "Vehicle not found",
      });
    }

    // Update the vehicle
    await vehicleService.updateVehicle(vehicleData);

    return res.status(200).json({
      message: "Vehicle updated successfully",
      success: "true",
    });
  } catch (error) {
    console.error("Error in controller:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

const deleteVehicle = async (req, res) => {
  const customer_id = parseInt(req.params.customer_id, 10);
  const vehicle_id = parseInt(req.params.vehicle_id, 10);

  // Validate parameters
  if (isNaN(customer_id) || isNaN(vehicle_id)) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Invalid customer ID or vehicle ID",
    });
  }

  try {
    // Check if the vehicle exists and belongs to the specified customer
    const vehicleExists = await vehicleService.checkVehicleBelongsToCustomer(
      vehicle_id,
      customer_id
    );
    if (!vehicleExists) {
      return res.status(404).json({
        error: "Not Found",
        message: "Vehicle not found for the specified customer",
      });
    }

    // Delete the vehicle
    await vehicleService.deleteVehicle(vehicle_id);

    return res.status(200).json({
      message: "Vehicle deleted successfully",
      success: "true",
    });
  } catch (error) {
    console.error("Error in controller:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

module.exports = {
  addVehicle,
  getAllCustomerVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};

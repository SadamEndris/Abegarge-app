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

// fuction to get all vehicles
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    return res.status(200).json({
      status: "success",
      vehicles,
    });
  } catch (error) {
    console.error("Error in controller:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

// Function to get a vehicle by vehicle_id
const getVehicleById = async (req, res) => {
  const vehicle_id = parseInt(req.params.vehicle_id, 10);

  try {
    // Call service to retrieve the vehicle details
    const vehicle = await vehicleService.getVehicleById(vehicle_id);

    if (!vehicle) {
      // If the vehicle is not found
      return res.status(404).json({
        error: "Not Found",
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      status: "success",
      vehicle,
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

  if (!customer_id) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Invalid customer ID",
    });
  }

  try {
    // Call the service to get all vehicles for the customer
    const vehicles = await vehicleService.getVehiclesByCustomerId(customer_id);

    // If no vehicles are found for the customer
    if (vehicles.length === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: "No vehicles found for this customer",
      });
    }

    return res.status(200).json({
      status: "success",
      customer_id: customer_id,
      data: vehicles,
    });
  } catch (error) {
    console.error("Error in controller:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

// Function to update a vehicle's details
const updateVehicle = async (req, res) => {
  const vehicleData = req.body;
  const vehicle_id = parseInt(req.params.vehicle_id, 10);

  try {
    // Verify that the vehicle exists
    const vehicleExists = await vehicleService.checkVehicleExists(
      vehicle_id,
      vehicleData.customer_id
    );
    if (!vehicleExists) {
      return res.status(404).json({
        error: "Not Found",
        message: "Vehicle not found",
      });
    }

    // Update the vehicle
    await vehicleService.updateVehicle(vehicle_id, vehicleData);

    return res.status(200).json({
      status: "success",
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

// Function to delete a vehicle by vehicle_id
const deleteVehicle = async (req, res) => {
  const vehicle_id = parseInt(req.params.vehicle_id, 10);

  // Validate parameters
  if (!vehicle_id) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Invalid vehicle ID, please provide a valid vehicle ID",
    });
  }

  try {
    // Check if the vehicle exists
    const vehicleExists = await vehicleService.checkVehicleExists(vehicle_id);
    if (!vehicleExists) {
      return res.status(404).json({
        error: "Not Found",
        message: "Vehicle not found",
      });
    }

    // Delete the vehicle
    await vehicleService.deleteVehicle(vehicle_id);

    return res.status(200).json({
      status: "success",
      success: "true",
      message: "Vehicle deleted successfully",
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
  getAllVehicles,
};

// vehicle.controller.js
const vehicleService = require("../services/vehicle.service");

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

module.exports = {
  addVehicle,
};

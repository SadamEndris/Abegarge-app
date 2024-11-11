// import service service
const serviceService = require("../services/service.service");

// Function to add a new service
const addService = async (req, res) => {
  const requestData = req.body;

  // Validate request body
  if (!requestData.service_name) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  try {
    // Call service to add the new service
    const newService = await serviceService.addService(requestData);

    if (newService === "EXISTS") {
      return res.status(400).json({
        error: "Bad Request",
        message: "Service with this name already exists",
      });
    }

    return res.status(201).json({
      message: "Service created successfully",
      success: "true",
    });
  } catch (error) {
    console.error("Error in controller:", error); // Log error for debugging
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

// Export the controller
module.exports = {
  addService,
};

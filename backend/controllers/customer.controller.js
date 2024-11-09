const customerService = require("../services/customer.service");

const createCustomer = async (req, res) => {
  // Check if the customer already exists in the database
  const customerExists = await customerService.checkCustomerExistence(
    req.body.customer_email
  );

  if (customerExists) {
    return res.status(409).json({
      error: "Conflict",
      message: "Customer with this email already exists",
    });
  } else {
    try {
      // Assuming that required fields are already validated on the frontend
      const customerData = req.body;
      // Call the service to add a customer
      const result = await customerService.createCustomer(customerData);

      // If a conflict occurs (e.g., duplicate email)
      if (result.error) {
        return res.status(result.statusCode).json({
          error: result.error,
          message: result.message,
        });
      }

      // Respond with success
      return res.status(201).json({
        message: "Customer created successfully",
        success: true,
      });
    } catch (error) {
      console.error("Error in controller:", error);
      return res.status(500).json({
        error: "Internal Server Error",
        message: "An unexpected error occurred.",
      });
    }
  }
};

module.exports = { createCustomer };

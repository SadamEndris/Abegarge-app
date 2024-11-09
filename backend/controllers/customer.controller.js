const customerService = require("../services/customer.service");

// Function to create a new customer in the database
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

// Function to get all customers from the database

const getAllCustomers = async (req, res) => {
  try {
    // Call service to retrieve all customers
    const customers = await customerService.getAllCustomers();

    if (customers) {
      // If customers found, send the data in response
      return res.status(200).json({
        success: true,
        message: "Customers fetched successfully",
        data: customers,
      });
    } else {
      // If no customers found
      return res.status(404).json({
        success: false,
        message: "No customers found",
      });
    }
  } catch (error) {
    console.error("Error in controller:", error); // Log detailed error for debugging
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred while fetching customers.",
    });
  }
};

module.exports = { createCustomer, getAllCustomers };

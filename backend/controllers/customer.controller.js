const customerService = require("../services/customer.service");

/**
 * @route POST /api/add-customer
 * @description Handles customer creation by checking if the email already exists, and if not, adds the new customer to the database.
 * @access Private - admin only
 */
const createCustomer = async (req, res) => {
  // Check if the customer already exists in the database
  /**
   * @description Step 1: Check if the customer already exists in the database by email.
   * @param {string} req.body.customer_email - Customer's email to be checked.
   * @returns {boolean} - Returns true if customer already exists.
   */
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
      if (!result || result.error) {
        return res.status(result?.statusCode).json({
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

/**
 * @route GET /api/all-customers
 * @description Fetch all customers from the database.
 * @access Private - Admin only
 */
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

// Function to get a single customer by ID
const getSingleCustomer = async (req, res) => {
  const customerId = parseInt(req.params.id, 10);

  // Validate the customer ID
  if (isNaN(customerId)) {
    return res.status(400).json({
      error: "Bad Request",
      message: "The customer ID provided is invalid or missing",
    });
  }

  try {
    // Call service to retrieve the single customer by ID
    const customer = await customerService.getSingleCustomer(customerId);

    if (customer) {
      // Send success response with customer data
      return res.status(200).json({
        success: true,
        message: "Customer fetched successfully",
        data: customer,
      });
    } else {
      // Send error response if customer not found
      return res.status(404).json({
        error: "Customer not found",
        message: "The customer ID provided does not exist.",
      });
    }
  } catch (error) {
    console.error("Error in controller:", error); // Log error for debugging
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred while fetching the customer.",
    });
  }
};

// Function to update a customer by ID
const updateCustomer = async (req, res) => {
  const customerId = parseInt(req.params.id, 10);

  // Validate customer_id parameter
  if (isNaN(customerId)) {
    return res.status(400).json({
      error: "Bad Request",
      message: "The customer ID provided is invalid or missing",
    });
  }

  // Keep request body in a variable to avoid destructuring
  const requestData = req.body;

  // Check if at least one field is provided for update
  if (
    !requestData.customer_first_name &&
    !requestData.customer_last_name &&
    !requestData.customer_phone_number &&
    requestData.active_customer_status == null
  ) {
    return res.status(400).json({
      error: "Bad Request",
      message: "No fields provided for update",
    });
  }

  try {
    // Call service to update the customer
    const updateResult = await customerService.updateCustomer(
      customerId,
      requestData
    );

    if (updateResult) {
      return res.status(200).json({
        success: true,
        message: "Customer updated successfully",
      });
    } else {
      // Customer ID not found
      return res.status(404).json({
        error: "Customer not found",
        message: "The customer ID provided does not exist.",
      });
    }
  } catch (error) {
    console.error("Error in controller:", error); // Log error for debugging
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred while updating the customer.",
    });
  }
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getSingleCustomer,
  updateCustomer,
};

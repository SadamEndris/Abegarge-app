// Import the query function from the db.config.js file
const db = require("../config/db.config");
const { v4: uuidv4 } = require("uuid"); // Import UUID for generating customer_hash

/**
 * @function checkCustomerExistence
 * @description Checks if a customer already exists in the database by email.
 * @param {string} customer_email - The email address of the customer to check.
 * @returns {boolean} - Returns true if the customer exists, otherwise false.
 */

async function checkCustomerExistence(customerEmail) {
  // SQL query to check if a customer with the provided email exists
  const query = "SELECT * FROM customer_identifier WHERE customer_email = ?";

  try {
    // Execute the query and store the result
    const result = await db.query(query, [customerEmail]);

    // Check if any rows are returned, meaning the customer exists
    if (result.length > 0) {
      // If the customer exists, return true
      return true;
    } else {
      // If no rows are returned, return false
      return false;
    }
  } catch (error) {
    // Log the error if any issue occurs while querying the database
    console.error("Error checking customer existence:", error);
    return false; // Return false in case of an error
  }
}

/**
 * @function createCustomer
 * @description Creates a new customer by inserting their data into the database.
 * @param {Object} customer - The customer object containing customer data.
 * @returns {Object} - Returns an object containing the customer ID, or an error message if the operation fails.
 */
async function createCustomer(customer) {
  try {
    // Step 1: Generate customer hash
    const customerHash = uuidv4();

    // Step 2: Insert into the `customer_identifier` table
    const insertQuery =
      "INSERT INTO customer_identifier (customer_email, customer_phone_number, customer_hash) VALUES (?, ?, ?)";
    const rows = await db.query(insertQuery, [
      customer.customer_email,
      customer.customer_phone_number,
      customerHash,
    ]);

    if (rows.affectedRows !== 1) {
      return false; // Return false if no rows were affected
    }

    // Step 3: Get the customer_id from the insert result
    const customer_id = rows.insertId;

    // Step 4: Insert into the `customer_info` table
    // Ensure active_customer_status is provided (we'll default it to 1 for active)
    const insertQuery2 =
      "INSERT INTO customer_info (customer_id, customer_first_name, customer_last_name, active_customer_status) VALUES (?, ?, ?, ?)";
    const rows2 = await db.query(insertQuery2, [
      customer_id,
      customer.customer_first_name,
      customer.customer_last_name,
      customer.active_customer_status || 1, // Default active status to 1 if not provided
    ]);
    // Check if the insert was successful (affectedRows should be 1)
    if (rows2.affectedRows !== 1) {
      return {
        error: "Failed to insert customer information", // Error message
        statusCode: 500, // Internal server error status code
      };
    }

    // Return the created customer object with the customer_id
    let createdCustomer = {
      customer_id: customer_id,
    };
    return createdCustomer;
  } catch (err) {
    console.log("Error while creating customer:", err); // Log the error for debugging
    return false; // Return false if an error occurred
  }
}

/**
 * @function getAllCustomers
 * @description Retrieves all customers from the database, including customer details and their associated information.
 * @returns {Array|null} - Returns an array of customers if found, or null if no customers exist.
 */

async function getAllCustomers() {
  try {
    const query = `
      SELECT * 
      FROM customer_identifier 
      LEFT JOIN customer_info 
      ON customer_identifier.customer_id = customer_info.customer_id 
      ORDER BY customer_identifier.customer_id DESC 
     
    `;
    const rows = await db.query(query); // Execute the query

    if (rows.length === 0) {
      return null; // Return null if no customers found
    }

    return rows; // Return the rows if customers are found
  } catch (error) {
    console.error("Error retrieving customers:", error);
    throw new Error("Internal Server Error"); // Throw error to be caught by controller
  }
}

// Function to fetch a single customer by ID
async function getSingleCustomer(customerId) {
  try {
    const query = `
      SELECT *
      FROM customer_identifier
      LEFT JOIN customer_info 
      ON customer_identifier.customer_id = customer_info.customer_id 
      WHERE customer_identifier.customer_id = ?;
    `;
    const rows = await db.query(query, [customerId]);

    // Check if any data is retrieved
    if (rows.length === 0) {
      return null; // Customer not found
    }

    return rows[0]; // Return the single customer data
  } catch (error) {
    console.error("Error retrieving customer:", error);
    throw new Error("Internal Server Error"); // Pass the error to the controller
  }
}

// Function to update a customer by ID with optional fields
async function updateCustomer(customerId, requestData) {
  const {
    customer_first_name,
    customer_last_name,
    customer_phone_number,
    active_customer_status,
  } = requestData;

  try {
    // Check if the customer exists
    const checkQuery = `SELECT customer_id FROM customer_identifier WHERE customer_id = ?`;
    const checkResult = await db.query(checkQuery, [customerId]);

    if (checkResult.length === 0) {
      return null; // Customer not found
    }

    // Build the update query dynamically based on provided fields
    const updateFields = [];
    const updateValues = [];

    if (customer_first_name) {
      updateFields.push("customer_first_name = ?");
      updateValues.push(customer_first_name);
    }
    if (customer_last_name) {
      updateFields.push("customer_last_name = ?");
      updateValues.push(customer_last_name);
    }
    if (customer_phone_number) {
      updateFields.push("customer_phone_number = ?");
      updateValues.push(customer_phone_number);
    }
    if (active_customer_status != null) {
      updateFields.push("active_customer_status = ?");
      updateValues.push(active_customer_status);
    }

    updateValues.push(customerId); // Add customerId for WHERE clause

    const updateQuery = `
      UPDATE customer_identifier
      LEFT JOIN customer_info ON customer_identifier.customer_id = customer_info.customer_id
      SET ${updateFields.join(", ")}
      WHERE customer_identifier.customer_id = ?;
    `;

    // Execute the update query
    const updateResult = await db.query(updateQuery, updateValues);
    return updateResult.affectedRows > 0;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw new Error("Internal Server Error");
  }
}

module.exports = {
  createCustomer,
  checkCustomerExistence,
  getAllCustomers,
  getSingleCustomer,
  updateCustomer,
};

// Import the query function from the db.config.js file
const db = require("../config/db.config");
const { v4: uuidv4 } = require("uuid"); // Import UUID for generating customer_hash

// Function to check if a customer already exists in the database based on their email
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

// Function to create a new customer
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
    const insertQuery2 =
      "INSERT INTO customer_info (customer_id, customer_first_name, customer_last_name, active_customer_status) VALUES (?, ?, ?, ?)";
    const rows2 = await db.query(insertQuery2, [
      customer_id,
      customer.customer_first_name,
      customer.customer_last_name,
      customer.active_customer_status,
    ]);

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

module.exports = {
  createCustomer,
  checkCustomerExistence,
};

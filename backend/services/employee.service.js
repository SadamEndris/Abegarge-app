// Import the query function from the db.config.js file
const db = require("../config/db.config");
// Import the bcrypt module
const bcrypt = require("bcrypt");
// a function to check if the employee exists in the database
async function checkIfEmployeeExists(email) {
  const query = "SELECT * FROM employee WHERE employee_email= ? ";
  // Execute the queries
  const rows = await db.query(query, [email]);
  console.log(rows);
  // Check if the employee exists
  if (rows.length > 0) {
    return true;
  } else {
    return false;
  }
}

// A function to create a new employee
async function createEmployee(employee) {
  let createdEmployee = {};
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(employee.employee_password, salt);

    const query =
      "INSERT INTO employee (employee_email, active_employee) VALUES (?, ?)";
    const rows = await db.query(query, [
      employee.employee_email,
      employee.active_employee,
    ]);
    console.log("Insert into employee result:", rows);

    if (rows.affectedRows !== 1) {
      return false;
    }

    const employee_id = rows.insertId;
    console.log("New employee ID:", employee_id);

    const query2 =
      "INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone) VALUES (?, ?, ?, ?)";
    const rows2 = await db.query(query2, [
      employee_id,
      employee.employee_first_name,
      employee.employee_last_name,
      employee.employee_phone,
    ]);
    console.log("Insert into employee_info result:", rows2);

    const query3 =
      "INSERT INTO employee_pass (employee_id, employee_password_hashed) VALUES (?, ?)";
    const rows3 = await db.query(query3, [employee_id, hashedPassword]);
    console.log("Insert into employee_pass result:", rows3);

    const query4 =
      "INSERT INTO employee_role (employee_id, company_role_id) VALUES (?, ?)";
    const rows4 = await db.query(query4, [
      employee_id,
      employee.company_role_id,
    ]);
    console.log("Insert into employee_role result:", rows4);

    createdEmployee = { employee_id };
  } catch (err) {
    console.error("Error in createEmployee:", err);
  }

  return createdEmployee;
}

// A function to get employee by email
async function getEmployeeByEmail(employee_email) {
  const query =
    "SELECT * FROM employee INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id INNER JOIN employee_pass ON employee.employee_id = employee_pass.employee_id INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id WHERE employee.employee_email = ?";
  const rows = await db.query(query, [employee_email]);
  return rows;
}
// A function to get all employees

async function getAllEmployees() {
  try {
    const query = `
      SELECT * 
      FROM employee 
      INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id 
      INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id 
      INNER JOIN company_roles ON employee_role.company_role_id = company_roles.company_role_id  
      ORDER BY employee.employee_id DESC 
      LIMIT 10
    `;

    // Await the query and get the rows
    const rows = await db.query(query);

    // Log the results for debugging purposes
    console.log("Fetched employees:", rows);

    // Return the fetched employees
    return rows;
  } catch (err) {
    // Log any errors for debugging
    console.error("Error fetching employees:", err);
    throw err; // Rethrow the error to be handled in the controller
  }
}

// Service function to get employee by ID
const getEmployeeById = async (employeeId) => {
  try {
    // Prepare the SQL query to fetch employee by ID
    const sql =
      "SELECT employee.employee_id, employee.employee_email, employee.active_employee, employee.added_date, employee_info.employee_first_name, employee_info.employee_last_name, employee_info.employee_phone FROM employee JOIN employee_info ON employee.employee_id = employee_info.employee_id WHERE employee.employee_id = ?";

    // Execute the query and get the result
    const rows = await db.query(sql, [employeeId]);

    // If no employee is found, return null
    if (rows.length === 0) {
      return null;
    }

    // Return the first result (as employee_id should be unique)
    return rows[0];
  } catch (error) {
    // Log the error and throw it to be handled by the controller
    console.error("Error in getEmployeeById service:", error);
    throw error;
  }
};

// Service to update employee details
const updateEmployeeDetails = async (
  employee_id,
  employee_first_name,
  employee_last_name,
  employee_phone,
  employee_email,
  hashedPassword
) => {
  try {
    // Check if the employee exists in the database
    const [rows] = await db.query(
      "SELECT * FROM employee WHERE employee_id = ?",
      [employee_id]
    );

    if (rows.length === 0) {
      return {
        error: "Not Found",
        message: "Employee not found",
        statusCode: 404,
      };
    }

    // Update employee details in the database
    await db.query(
      `UPDATE employee 
       SET employee_email = ?, active_employee = 1, added_date = CURRENT_TIMESTAMP
       WHERE employee_id = ?`,
      [employee_email, employee_id]
    );

    await db.query(
      `UPDATE employee_info 
       SET employee_first_name = ?, employee_last_name = ?, employee_phone = ?
       WHERE employee_id = ?`,
      [employee_first_name, employee_last_name, employee_phone, employee_id]
    );

    // Update the password securely (hashed password)
    await db.query(
      "UPDATE employee_pass SET employee_password_hashed = ? WHERE employee_id = ?",
      [hashedPassword, employee_id]
    );

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
      statusCode: 500,
    };
  }
};

// Service function to delete an employee

const deleteEmployee = async (id) => {
  try {
    // Step 1: Delete employee pass records associated with the employee
    await db.query("DELETE FROM employee_pass WHERE employee_id = ?", [id]);

    // Step 2: Delete employee role(s) associated with the employee
    await db.query("DELETE FROM employee_role WHERE employee_id = ?", [id]);

    // Step 3: Delete employee info (details like first name, last name, etc.)
    await db.query("DELETE FROM employee_info WHERE employee_id = ?", [id]);

    // Step 4: Delete the employee record itself
    const result = await db.query(
      "DELETE FROM employee WHERE employee_id = ?",
      [id]
    );

    // If no employee was found and deleted, return an error response
    if (result.affectedRows === 0) {
      return {
        error: true,
        statusCode: 404,
        message: "Employee not found",
      };
    }

    // Return success if the employee was deleted
    return {
      success: true,
      message: "Employee deleted successfully",
    };
  } catch (error) {
    // Log the error with more details
    console.error("Error deleting employee:", error.message, error.stack);

    return {
      error: true,
      statusCode: 500,
      message: "Internal Server Error",
    };
  }
};

// Export the functions for use in the controller
module.exports = {
  checkIfEmployeeExists,
  createEmployee,
  getEmployeeByEmail,
  getAllEmployees,
  getEmployeeById,
  updateEmployeeDetails,
  deleteEmployee,
};

// Import the query function from the db.config.js file
const db = require("../config/db.config");
// Import the bcrypt module
const bcrypt = require("bcrypt");

/**
 * Checks if an employee exists in the database by email.
 *
 * @param {string} email - The email of the employee to check.
 * @returns {Promise<boolean>} - True if the employee exists, otherwise false.
 */
async function checkIfEmployeeExists(email) {
  const query = "SELECT * FROM employee WHERE employee_email = ?";
  const rows = await db.query(query, [email]);
  return rows.length > 0;
}

/**
 * Creates a new employee in the database.
 *
 * @param {object} employee - The details of the employee to create.
 * @returns {Promise<void>} - Resolves if the employee is created successfully.
 */
const createEmployee = async (employee) => {
  try {
    // Hash the employee's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(employee.employee_password, salt);

    // Insert into `employee` table
    const query1 = `
      INSERT INTO employee (employee_email, active_employee)
      VALUES (?, ?);
    `;
    const rows1 = await db.query(query1, [
      employee.employee_email,
      employee.active_employee,
    ]);

    if (!rows1 || rows1.affectedRows !== 1) {
      throw new Error("Failed to insert employee into the `employee` table.");
    }

    const employee_id = rows1.insertId;

    // Insert into `employee_info` table
    const query2 = `
      INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone)
      VALUES (?, ?, ?, ?);
    `;
    const rows2 = await db.query(query2, [
      employee_id,
      employee.employee_first_name,
      employee.employee_last_name,
      employee.employee_phone,
    ]);

    if (!rows2 || rows2.affectedRows !== 1) {
      throw new Error(
        "Failed to insert employee into the `employee_info` table."
      );
    }

    // Insert into `employee_pass` table
    const query3 = `
      INSERT INTO employee_pass (employee_id, employee_password_hashed)
      VALUES (?, ?);
    `;
    const rows3 = await db.query(query3, [employee_id, hashedPassword]);

    if (!rows3 || rows3.affectedRows !== 1) {
      throw new Error(
        "Failed to insert hashed password into the `employee_pass` table."
      );
    }

    // Insert into `employee_role` table
    const query4 = `
      INSERT INTO employee_role (employee_id, company_role_id)
      VALUES (?, ?);
    `;
    const rows4 = await db.query(query4, [
      employee_id,
      employee.company_role_id,
    ]);

    if (!rows4 || rows4.affectedRows !== 1) {
      throw new Error("Failed to assign role in the `employee_role` table.");
    }

    console.log("Employee created successfully with ID:", employee_id);
  } catch (error) {
    console.error("Error in createEmployee:", error.message);
    throw error; // Re-throw the error for the controller to handle
  }
};

/**
 * Fetches an employee's details from the database using their email.
 *
 * @param {string} employee_email - The email of the employee to search for.
 * @returns {Promise<object[]>} - An array of employee records matching the email.
 * @throws {Error} - Throws an error if the database query fails.
 */
async function getEmployeeByEmail(employee_email) {
  // SQL query to fetch the employee's details from multiple joined tables
  const query = `
    SELECT * 
    FROM employee 
    INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id 
    INNER JOIN employee_pass ON employee.employee_id = employee_pass.employee_id 
    INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id 
    WHERE employee.employee_email = ?;
  `;

  try {
    // Execute the query with the provided email parameter
    const rows = await db.query(query, [employee_email]);

    // Return the result set (an array of rows matching the query)
    return rows;
  } catch (error) {
    // Log any errors for debugging purposes
    console.error("Error in getEmployeeByEmail function:", error.message);

    // Re-throw the error for further handling in the calling function
    throw new Error("Database error occurred while fetching employee details.");
  }
}

/**
 * Fetches the details of all employees from the database, including their roles and associated info.
 *
 * @returns {Promise<object[]>} - A promise that resolves to an array of employee records.
 * @throws {Error} - Throws an error if the database query fails.
 */
async function getAllEmployees() {
  try {
    const query = `
      SELECT * 
      FROM employee 
      INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id 
      INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id 
      INNER JOIN company_roles ON employee_role.company_role_id = company_roles.company_role_id  
      ORDER BY employee.employee_id DESC 
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

/**
 * Service function to retrieve an employee by their ID.
 *
 * @param {number} employeeId - The ID of the employee to fetch.
 * @returns {Promise<object|null>} - A promise resolving to the employee details or null if not found.
 * @throws {Error} - Throws an error if the query fails.
 */
const getEmployeeById = async (employeeId) => {
  try {
    // SQL query to fetch employee details by ID
    const sql = `
      SELECT 
        employee.employee_id, 
        employee.employee_email, 
        employee.active_employee, 
        employee.added_date, 
        employee_info.employee_first_name, 
        employee_info.employee_last_name, 
        employee_info.employee_phone, 
        employee_role.company_role_id, 
        company_roles.company_role_name
      FROM employee
      JOIN employee_info ON employee.employee_id = employee_info.employee_id
      JOIN employee_role ON employee.employee_id = employee_role.employee_id
      JOIN company_roles ON employee_role.company_role_id = company_roles.company_role_id
      WHERE employee.employee_id = ?
    `;

    // Execute the query
    const rows = await db.query(sql, [employeeId]);

    // Return null if no employee is found
    if (rows.length === 0) {
      return null;
    }

    // Return the first row as employee_id is unique
    return rows[0];
  } catch (error) {
    // Log the error and rethrow it for the controller to handle
    console.error("Error in getEmployeeById service:", error.message);
    throw new Error(
      "Database error occurred while retrieving employee details."
    );
  }
};

/**
 * Service function to update an employee's details by their ID.
 *
 * @param {number} employeeId - The ID of the employee to update.
 * @param {object} updatedData - The updated employee data.
 * @returns {Promise<boolean>} - Returns true if the update was successful, false otherwise.
 */
const updateEmployeeById = async (employeeId, updatedData) => {
  try {
    // Update the `employee_info` table
    const updateInfoQuery = `
      UPDATE employee_info
      SET 
        employee_first_name = ?,
        employee_last_name = ?,
        employee_phone = ?
      WHERE employee_id = ?
    `;
    const infoResult = await db.query(updateInfoQuery, [
      updatedData.employee_first_name,
      updatedData.employee_last_name,
      updatedData.employee_phone,
      employeeId,
    ]);

    if (infoResult.affectedRows === 0) {
      return false; // Employee not found
    }

    // Update the `employee` table for active status
    const updateEmployeeQuery = `
      UPDATE employee
      SET active_employee = ?
      WHERE employee_id = ?
    `;
    await db.query(updateEmployeeQuery, [
      updatedData.active_employee,
      employeeId,
    ]);

    // Update the `employee_role` table
    const updateRoleQuery = `
      UPDATE employee_role
      SET company_role_id = ?
      WHERE employee_id = ?
    `;
    await db.query(updateRoleQuery, [updatedData.company_role_id, employeeId]);

    return true; // Update successful
  } catch (error) {
    console.error("Error in updateEmployeeById service:", error.message);
    throw error; // Rethrow the error to be handled by the controller
  }
};

/**
 * Service function to delete an employee by their ID.
 *
 * @param {number} employeeId - The ID of the employee to delete.
 * @returns {object} - An object indicating success or an error with a status code.
 */
const deleteEmployee = async (employeeId) => {
  try {
    // Check if the employee exists
    const rows = await db.query(
      `SELECT * FROM employee WHERE employee_id = ?`,
      [employeeId]
    );
    if (rows.length === 0) {
      return { error: true, message: "Employee not found", status: 404 };
    }

    // Handle dependent records in the 'orders' table
    const orders = await db.query(
      `SELECT * FROM orders WHERE employee_id = ?`,
      [employeeId]
    );

    if (orders.length > 0) {
      return {
        error: true,
        message: "Cannot delete employee with active orders.",
        status: 400,
      };
    }

    // Delete from related tables
    await db.query(`DELETE FROM employee_pass WHERE employee_id = ?`, [
      employeeId,
    ]);
    await db.query(`DELETE FROM employee_role WHERE employee_id = ?`, [
      employeeId,
    ]);
    await db.query(`DELETE FROM employee_info WHERE employee_id = ?`, [
      employeeId,
    ]);

    // Delete from the employee table
    const employeeResult = await db.query(
      `DELETE FROM employee WHERE employee_id = ?`,
      [employeeId]
    );

    // Return success response
    return { success: true, message: "Employee deleted successfully." };
  } catch (error) {
    console.error("Error in deleteEmployeeById service:", error);
    return {
      error: "Internal Server Error",
      message: "Failed to delete employee",
      status: 500,
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
  updateEmployeeById,
  deleteEmployee,
};

// Import the query function from the db.config.js file
const db = require("../config/db.config");
// Import the bcrypt module to handle password comparison
const bcrypt = require("bcrypt");
// Import the employee service to get employee by email
const employeeService = require("./employee.service");

/**
 * Handles employee login by validating email and password.
 *
 * @param {object} employeeData - The login credentials provided by the employee.
 * @returns {Promise<object>} - A result object containing status and relevant data or message.
 */
async function logIn(employeeData) {
  try {
    // Check if employee exists
    const employee = await employeeService.getEmployeeByEmail(
      employeeData.employee_email
    );

    if (employee.length === 0) {
      return {
        status: "fail",
        message: "Employee does not exist",
      };
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(
      employeeData.employee_password,
      employee[0].employee_password_hashed
    );

    if (!passwordMatch) {
      return {
        status: "fail",
        message: "Incorrect password",
      };
    }

    // Return success if credentials are valid
    return {
      status: "success",
      data: employee[0],
    };
  } catch (error) {
    console.error("Error in login service:", error);
    return {
      status: "fail",
      message: "An error occurred during the login process.",
    };
  }
}

// Export the function
module.exports = {
  logIn,
};

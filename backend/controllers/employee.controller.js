// Import the employee service
const employeeService = require("../services/employee.service");
// Import bcrypt
const bcrypt = require("bcrypt");

/**
 * Handles adding a new employee.
 *
 * @param {object} req - HTTP request object.
 * @param {object} res - HTTP response object.
 */
const addEmployee = async (req, res) => {
  try {
    const {
      employee_email,
      employee_password,
      active_employee = 1,
      employee_first_name,
      employee_last_name,
      employee_phone,
      company_role_id,
    } = req.body;

    // Validate required fields
    if (
      !employee_email ||
      !employee_password ||
      !employee_first_name ||
      !employee_last_name ||
      !employee_phone ||
      !company_role_id
    ) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Please provide all required fields",
      });
    }

    // Check if the employee already exists
    const employeeExists = await employeeService.checkIfEmployeeExists(
      employee_email
    );
    if (employeeExists) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Employee with this email already exists",
      });
    }

    // Call the service to create the employee
    await employeeService.createEmployee({
      employee_email,
      employee_password,
      active_employee,
      employee_first_name,
      employee_last_name,
      employee_phone,
      company_role_id,
    });

    res.status(201).json({
      message: "Employee created successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in addEmployee:", error.message);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

/**
 * Controller to retrieve all employees from the database.
 *
 * @param {object} req - HTTP request object.
 * @param {object} res - HTTP response object.
 * @param {function} next - Callback to the next middleware.
 */
async function getAllEmployees(req, res, next) {
  try {
    // Fetch all employees from the service
    const employees = await employeeService.getAllEmployees();

    // Check if employees exist
    if (!employees || employees.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No employees found!",
      });
    }

    // Respond with the list of employees
    res.status(200).json({
      status: "success",
      message: "Employees retrieved successfully.",
      data: employees,
    });
  } catch (error) {
    console.error("Error in getAllEmployees controller:", error.message);

    // Handle unexpected server errors
    res.status(500).json({
      status: "fail",
      message: "An unexpected error occurred while retrieving employees.",
    });
  }
}

/**
 * Controller to retrieve an employee by their ID.
 *
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 */
const getEmployeeById = async (req, res) => {
  try {
    // Retrieve and validate the employee ID from request parameters
    const employeeId = parseInt(req.params.id, 10);
    if (isNaN(employeeId)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid Employee ID.",
      });
    }

    // Call the service to fetch the employee details
    const employee = await employeeService.getEmployeeById(employeeId);

    // If employee is not found, send a 404 response
    if (!employee) {
      return res.status(404).json({
        status: "fail",
        message: "Employee not found.",
      });
    }

    // Respond with the employee details if found
    return res.status(200).json({
      status: "success",
      message: "Employee retrieved successfully.",
      data: employee,
    });
  } catch (error) {
    // Log and handle unexpected errors
    console.error("Error in getEmployeeById controller:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "An unexpected error occurred while retrieving the employee.",
    });
  }
};

/**
 * Controller to update an employee's details by their ID.
 *
 * @param {object} req - HTTP request object.
 * @param {object} res - HTTP response object.
 */
const updateEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id; // Extract employee ID from the request params

    // Destructure the request body for updated employee data
    const {
      employee_first_name,
      employee_last_name,
      employee_phone,
      active_employee,
      company_role_id,
    } = req.body;

    // Validate required fields
    if (
      !employee_first_name ||
      !employee_last_name ||
      !employee_phone ||
      active_employee === undefined ||
      !company_role_id
    ) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide all required fields.",
      });
    }

    // Call the service to update the employee details
    const result = await employeeService.updateEmployeeById(employeeId, {
      employee_first_name,
      employee_last_name,
      employee_phone,
      active_employee: active_employee ? 1 : 0, // Convert to numeric value for the database
      company_role_id,
    });

    // If the employee doesn't exist, return a 404 error
    if (!result) {
      return res.status(404).json({
        status: "fail",
        message: "Employee not found.",
      });
    }

    // Respond with a success message
    return res.status(200).json({
      status: "success",
      message: "Employee updated successfully.",
    });
  } catch (error) {
    console.error("Error in updateEmployee controller:", error.message);
    return res.status(500).json({
      status: "fail",
      message: "An unexpected error occurred while updating the employee.",
    });
  }
};

/**
 * Controller to delete an employee by ID.
 *
 * @param {object} req - HTTP request object.
 * @param {object} res - HTTP response object.
 */
const deleteEmployee = async (req, res) => {
  const { id } = req.params; // Extract the employee ID from the path parameter

  try {
    // Call the service function to delete the employee
    const result = await employeeService.deleteEmployee(id);

    // Check if the service returned an error
    if (result.error) {
      // Ensure the response always has a valid status code
      const statusCode = result.status || 400;
      return res.status(statusCode).json({
        error: "fail",
        message: result.message,
      });
    }

    // Return success response if the employee was deleted
    return res.status(200).json({
      message: result.message,
      success: true,
    });
  } catch (error) {
    console.error("Error in deleteEmployee controller:", error.message);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred while deleting the employee.",
    });
  }
};

// Export the createEmployee controller
module.exports = {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};

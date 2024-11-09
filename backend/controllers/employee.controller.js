// Import the employee service
const employeeService = require("../services/employee.service");
// Import bcrypt
const bcrypt = require("bcrypt");
// Create the add employee controller
async function createEmployee(req, res, next) {
  // check the header
  // console.log(req.headers);
  // check if the employee exists in the database
  const employeeExists = await employeeService.checkIfEmployeeExists(
    req.body.employee_email
  );
  //   if employee exists, send a response to the client
  if (employeeExists) {
    return res.status(400).json({
      error: "This email address is already associated with another employee!",
    });
  } else {
    try {
      const employeeData = req.body;
      // Create the employee
      const employee = await employeeService.createEmployee(employeeData);
      if (!employee) {
        return res.status(400).json({
          error: "Failed to add the employee!",
        });
      } else {
        return res.status(200).json({
          status: "Employee added successfully",
          // data: employee,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        error: "Something went wrong!",
      });
    }
  }
}

// create the getAllEmployees controller
async function getAllEmployees(req, res, next) {
  try {
    // Call the getAllEmployees method from the employee service
    const employees = await employeeService.getAllEmployees();

    if (!employees || employees.length === 0) {
      return res.status(404).json({
        error: "No employees found!",
      });
    }

    // Respond with the employees data
    res.status(200).json({
      status: "Employees retrieved successfully",
      data: employees,
    });
  } catch (error) {
    console.error("Error in getAllEmployees controller:", error);
    res.status(500).json({
      error: "Failed to get employees!",
    });
  }
}

// Controller for updating employee details
const updateEmployee = async (req, res) => {
  // Extract employee_id from the URL params
  const { employee_id } = req.params;
  const {
    employee_first_name,
    employee_last_name,
    employee_phone,
    employee_email,
    employee_password,
  } = req.body;

  // Validate the request body
  if (
    !employee_first_name ||
    !employee_last_name ||
    !employee_phone ||
    !employee_email ||
    !employee_password
  ) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Please provide all required fields",
    });
  }

  try {
    // Encrypt the new password securely using bcrypt
    const hashedPassword = await bcrypt.hash(employee_password, 10); // 10 is the salt rounds for bcrypt

    // Call the service function to update the employee details
    const result = await employeeService.updateEmployeeDetails(
      employee_id,
      employee_first_name,
      employee_last_name,
      employee_phone,
      employee_email,
      hashedPassword
    );

    if (result.error) {
      return res.status(result.statusCode).json(result);
    }

    // Return success response
    return res.status(200).json({
      message: "Employee updated successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

// Controller to handle getting an employee by their ID
const getEmployeeById = async (req, res) => {
  try {
    // Retrieve the employee ID from the route parameters
    const employeeId = req.params.id;

    // Call the service function to fetch the employee from the database
    const employee = await employeeService.getEmployeeById(employeeId);

    // If no employee is found, send a 404 response with an error message
    if (!employee) {
      return res.status(404).json({
        error: "Not Found", // Error type
        message: "Employee not found", // Specific message about the missing employee
      });
    }

    // If the employee is found, send a 200 OK response with the employee data
    return res.status(200).json(employee);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching employee:", error);

    // Handle any unexpected errors by sending a 500 response
    return res.status(500).json({
      error: "Internal Server Error", // Error type indicating a server issue
      message: "An unexpected error occurred.", // General message about the failure
    });
  }
};

// employeeController.js
const deleteEmployee = async (req, res) => {
  const { id } = req.params; // Extract the employee ID from the path parameter

  try {
    // Call the service function to delete the employee
    const result = await employeeService.deleteEmployee(id);

    if (result.error) {
      return res.status(result.statusCode).json(result); // Return error if any
    }

    // Return success response if the employee was deleted
    return res.status(200).json({
      message: "Employee deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

// Export the createEmployee controller
module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};

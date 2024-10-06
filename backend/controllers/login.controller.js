// Import the login service
const loginService = require("../services/login.service");
// Import the jsonwebtoken module
const jwt = require("jsonwebtoken");
// Import the secret key from the environment variables
const jwtSecret = process.env.JWT_SECRET;

// Handle employee login
async function logIn(req, res, next) {
  try {
    console.log(req.body);
    const employeeData = req.body;
    // Call the logIn method from the login service
    const employee = await loginService.logIn(employeeData);
    // If the employee is not found
    if (employee.status === "fail") {
      return res.status(403).json({
        status: employee.status,
        message: employee.message,
      });
      //   console.log(employee.message);
    }
    // If successful, send a response to the client
    // prepare the payload object
    const payload = {
      employee_id: employee.data.employee_id,
      employee_email: employee.data.employee_email,
      employee_role: employee.data.employee_role_id,
      employee_first_name: employee.data.employee_first_name,
      employee_last_name: employee.data.employee_last_name,
    };
    // encrypt the payload object
    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: "30d",
    });
    console.log("Generated token:", token);
    const sendBack = {
      employee_token: token,
    };
    return res.status(200).json({
      status: "success",
      message: "Employee logged in successfully",
      data: sendBack,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Something went wrong! Please try agin later.",
    });
  }
}

// Export the functions
module.exports = {
  logIn,
};

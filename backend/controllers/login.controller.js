// Import the login service
const loginService = require("../services/login.service");
// Import the jsonwebtoken module
const jwt = require("jsonwebtoken");
// Import the secret key from the environment variables
const jwtSecret = process.env.JWT_SECRET;

/**
 * Handles employee login and token generation.
 *
 * @param {object} req - HTTP request object.
 * @param {object} res - HTTP response object.
 * @param {function} next - Callback to the next middleware.
 */
async function logIn(req, res, next) {
  try {
    console.log("Login request received:", req.body);

    const { employee_email, employee_password } = req.body;

    // Validate input
    if (!employee_email || !employee_password) {
      return res.status(400).json({
        status: "fail",
        message: "Email and password are required.",
      });
    }

    // Call the login service
    const employee = await loginService.logIn({
      employee_email,
      employee_password,
    });

    // If the employee is not found or authentication fails
    if (employee.status === "fail") {
      return res.status(403).json({
        status: "fail",
        message: employee.message || "Invalid credentials.",
      });
    }

    // Prepare the JWT payload
    const payload = {
      employee_id: employee.data.employee_id,
      employee_email: employee.data.employee_email,
      employee_role: employee.data.company_role_id,
      employee_first_name: employee.data.employee_first_name,
      employee_last_name: employee.data.employee_last_name,
      employee_phone: employee.data.employee_phone,
      active_employee: employee.data.active_employee,
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: "30d" });
    console.log("Generated token:", token);

    // Respond with the token
    return res.status(200).json({
      status: "success",
      message: "Employee logged in successfully.",
      data: {
        employee_token: token,
      },
    });
  } catch (error) {
    console.error("Error during login:", error.message);

    return res.status(500).json({
      status: "fail",
      message: "Something went wrong! Please try again later.",
    });
  }
}

// Export the functions
module.exports = {
  logIn,
};

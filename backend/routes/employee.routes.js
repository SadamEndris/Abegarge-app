const express = require("express");
// Import the router module
const router = express.Router();
// Import the employee controller
const employeeController = require("../controllers/employee.controller");
// Import the authentication middleware
const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");

/**
 * @route POST /api/employee
 * @description Add a new employee. Requires admin privileges.
 * @access Private - admin only
 */
router.post(
  "/api/employee",
  verifyToken,
  isAdmin,
  employeeController.addEmployee
);

/**
 * @route GET /api/employee
 * @description Get all employees. Requires admin privileges.
 * @access Private - admin only
 */
router.get(
  "/api/employees",
  verifyToken,
  isAdmin,
  employeeController.getAllEmployees
);

/**
 * @route GET /api/employees/:id
 * @description Retrieve employee details by ID
 * @access Admin-only
 */
router.get(
  "/api/employee/:id",
  verifyToken,
  isAdmin,
  employeeController.getEmployeeById
);

/**
 * @route PUT /api/employee/:employee_id
 * @description Update employee details by ID
 * @access Admin-only
 */
router.put(
  "/api/employee/:id",
  verifyToken,
  isAdmin,
  employeeController.updateEmployee
);

/**
 * @route DELETE /api/employee/:id
 * @description Delete employee by ID
 * @access Admin-only
 */
router.delete(
  "/api/employee/:id",
  verifyToken,
  isAdmin,
  employeeController.deleteEmployee
);

// Export the router
module.exports = router;

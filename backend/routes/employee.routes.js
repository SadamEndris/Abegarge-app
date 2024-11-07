// Import express module
const express = require("express");
// Import the router module
const router = express.Router();
// Import the employee controller
const employeeController = require("../controllers/employee.controller");
// Import the middleWare
const authMiddleware = require("../middlewares/auth.middleware");
// Create a route to handle the add employee request on post
router.post(
  "/api/employee",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  employeeController.createEmployee
);
// Create a route to handle the get all employees on get
router.get(
  "/api/employee",
  [authMiddleware.verifyToken, authMiddleware.isAdmin],
  employeeController.getAllEmployees
);

// Create a route to handle updating an employee by ID
router.put(
  "/api/employee/:id",
  [authMiddleware.verifyToken, authMiddleware.isAdmin], // You can adjust middleware as needed
  employeeController.updateEmployee
);

// Export the router
module.exports = router;

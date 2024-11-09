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

// params are variables in the URL example
// router.get("/api/employees/:id", (req, res) => {
//   const employeeId = req.params.id; // Access the 'id' parameter
//   res.send(`Employee ID: ${employeeId}`);
// });

router.get("/api/employees/:id", employeeController.getEmployeeById);

// Route for updating employee details
router.put("/api/employee/:employee_id", employeeController.updateEmployee);

// DELETE request to delete employee
router.delete("/api/employee/:id", employeeController.deleteEmployee);

// Export the router
module.exports = router;

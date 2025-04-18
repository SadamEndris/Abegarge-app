// import express
const express = require("express");
// create a router
const router = express.Router();
// import customer controller
const customerController = require("../controllers/customer.controller");
// Import the authentication middleware
const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");

/**
 * @route POST /api/add-customer
 * @description Add a new customer to the database. Requires admin privileges.
 * @access Private - Admin only
 */
router.post(
  "/api/add-customer",
  verifyToken,
  isAdmin,
  customerController.createCustomer
);

/**
 * @route GET /api/all-customers
 * @description Fetch all customers from the database. Requires admin privileges.
 * @access Private - Admin only
 */
router.get(
  "/api/all-customers",
  verifyToken,
  isAdmin,
  customerController.getAllCustomers
);

// Define the route for fetching a single customer by ID
router.get(
  "/api/customers/:id",
  verifyToken,
  isAdmin,
  customerController.getSingleCustomer
);

// Define the route for updating a customer by ID
router.put(
  "/api/update-customer/:id",
  verifyToken,
  isAdmin,
  customerController.updateCustomer
);

// export router
module.exports = router;

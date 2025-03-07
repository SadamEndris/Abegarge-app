// import express
const express = require("express");
// create a router
const router = express.Router();
// import service controller
const serviceController = require("../controllers/service.controller");
// Import the authentication middleware
const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");

// Define the route for adding a new service
router.post("/api/service", verifyToken, isAdmin, serviceController.addService);

// Define the route to get all services
router.get(
  "/api/services",
  verifyToken,
  isAdmin,
  serviceController.getAllServices
);

// Define the route to get a service by ID
router.get(
  "/api/service/:id",
  verifyToken,
  isAdmin,
  serviceController.getServiceById
);

// Define the route to update a service by ID
router.put(
  "/api/service/:id",
  verifyToken,
  isAdmin,
  serviceController.updateService
);

// Define the route to delete a service by ID
router.delete(
  "/api/service/:id",
  verifyToken,
  isAdmin,
  serviceController.deleteService
);

// Export the router
module.exports = router;

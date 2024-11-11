// import express
const express = require("express");
// create a router
const router = express.Router();
// import service controller
const serviceController = require("../controllers/service.controller");

// Define the route for adding a new service
router.post("/api/service", serviceController.addService);

// Define the route to get all services
router.get("/api/services", serviceController.getAllServices);

// Define the route to get a service by ID
router.get("/api/service/:id", serviceController.getServiceById);

// Export the router
module.exports = router;

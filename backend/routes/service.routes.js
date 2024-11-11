// import express
const express = require("express");
// create a router
const router = express.Router();
// import service controller
const serviceController = require("../controllers/service.controller");

// Define the route for adding a new service
router.post("/api/service", serviceController.addService);

// Export the router
module.exports = router;

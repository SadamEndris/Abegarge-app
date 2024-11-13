// import express
const express = require("express");
// create express router
const router = express.Router();

// import vehicle controller
const vehicleController = require("../controllers/vehicle.controller");

// Define the route to add a new vehicle
router.post("/api/add-vehicle", vehicleController.addVehicle);

// Define the route to get all vehicles for a specific customer
router.get(
  "/api/vehicles/:customer_id",
  vehicleController.getAllCustomerVehicles
);

// Define the route to get a specific vehicle by customer_id and vehicle_id
router.get(
  "/api/vehicles/:customer_id/:vehicle_id",
  vehicleController.getVehicleById
); 

// export the router
module.exports = router;

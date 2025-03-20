// import express
const express = require("express");
// create express router
const router = express.Router();

// import vehicle controller
const vehicleController = require("../controllers/vehicle.controller");
// Import the authentication middleware
const { verifyToken, isAdmin } = require("../middlewares/auth.middleware");

// Define the route to add a new vehicle
router.post(
  "/api/add-vehicle",
  verifyToken,
  isAdmin,
  vehicleController.addVehicle
);

// Define the route to get all vehicles
router.get(
  "/api/vehicles",
  verifyToken,
  isAdmin,
  vehicleController.getAllVehicles
);

// Define the route to get a vehicle by vehicle_id
router.get(
  "/api/vehicle/:vehicle_id",
  verifyToken,
  isAdmin,
  vehicleController.getVehicleById
);

// Define the route to get all vehicles for a specific customer
router.get(
  "/api/vehicles/:customer_id",
  verifyToken,
  isAdmin,
  vehicleController.getAllCustomerVehicles
);

// Define the route to update a vehicle's details
router.put(
  "/api/vehicle/:vehicle_id",
  verifyToken,
  isAdmin,
  vehicleController.updateVehicle
);

// Define the route to delete a vehicle by customer_id and vehicle_id
router.delete(
  "/api/vehicle/:vehicle_id",
  verifyToken,
  isAdmin,
  vehicleController.deleteVehicle
);

// export the router
module.exports = router;

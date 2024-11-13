// import express
const express = require("express");
// create express router
const router = express.Router();

// import vehicle controller
const vehicleController = require("../controllers/vehicle.controller");

// Define the route to add a new vehicle
router.post("/api/add-vehicle", vehicleController.addVehicle);

// export the router
module.exports = router;

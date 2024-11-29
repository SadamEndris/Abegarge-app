const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

// Define the route to create a new order
router.post("/api/order", orderController.createOrder);

module.exports = router;

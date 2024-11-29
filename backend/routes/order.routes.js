const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

// Define the route to create a new order
router.post("/api/order", orderController.createOrder);

// Define the route to get all orders
router.get("/api/orders", orderController.getAllOrders);

module.exports = router;

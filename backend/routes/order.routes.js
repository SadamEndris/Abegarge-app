const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");

// Define the route to create a new order
router.post("/api/order", orderController.createOrder);

// Define the route to get all orders
router.get("/api/orders", orderController.getAllOrders);

// Define the route to get a specific order by ID
router.get("/api/order/:id", orderController.getOrderById);

// define the route to update a specific order by ID
router.put("/api/order", orderController.updateOrderController);

module.exports = router;

// import express
const express = require("express");
// create a router
const router = express.Router();
// import customer controller
const customerController = require("../controllers/customer.controller");

// post request for creating a new customer
router.post("/api/add-customer", customerController.createCustomer);

// get request for getting all customers from the database
router.get("/api/all-customers", customerController.getAllCustomers);

// export router
module.exports = router;

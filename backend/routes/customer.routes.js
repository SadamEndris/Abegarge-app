// import express
const express = require("express");
// create a router
const router = express.Router();
// import customer controller
const customerController = require("../controllers/customer.controller");

// post request for creating a new customer
router.post("/api/add-customer", customerController.createCustomer);

// export router
module.exports = router;

// Import the express module
const express = require("express");
// Call the router method from express to create the router
const router = express.Router();

// import the install router
const installRouter = require("./install.routes");
// Add the install router to the main router
router.use(installRouter);

// import the employee routes
const employeeRouter = require("./employee.routes");
// Add the employee routes to the main router
router.use(employeeRouter);
// Import the login routes
const loginRoutes = require("./login.routes");
// Add the login routes to the main router
router.use(loginRoutes);

// Import the customer routes and add them to the main router
const customerRoutes = require("./customer.routes");
router.use(customerRoutes);

// Import the service routes and add them to the main router
const serviceRoutes = require("./service.routes");
router.use(serviceRoutes);

// Import the vehicle routes and add them to the main router
const vehicleRoutes = require("./vehicle.routes");
router.use(vehicleRoutes);

// import the order routes and add them to the main router
const orderRoutes = require("./order.routes");
router.use(orderRoutes);

// Export the router for use in the application
module.exports = router;

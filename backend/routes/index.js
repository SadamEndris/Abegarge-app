// Import the express module
const express = require('express');
// Call the router method from express to create the router
const router = express.Router();

// import the install router
const installRouter = require('./install.routes');
// Add the install router to the main router
router.use(installRouter);

// import the employee routes
const employeeRouter = require('./employee.routes');
// Add the employee routes to the main router
router.use(employeeRouter);
// Import the login routes
const loginRoutes = require('./login.routes');
// Add the login routes to the main router
router.use(loginRoutes);

// Export the router for use in the application
module.exports = router;

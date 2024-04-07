// Import the express module
const express = require('express');
// Call the router method from express to create the router
const router = express.Router();

// import the install router
const installRouter = require('./install.routes');
// Add the install router to the main router
router.use(installRouter);

// Export the router for use in the application
module.exports = router;

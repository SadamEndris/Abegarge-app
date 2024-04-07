// Import the express module
const express = require('express');
// Import the dotenv module and call the config() method
require('dotenv').config();
// create the webserver
const app = express();
// Add the express.json() middleware
app.use(express.json());

// import the routes
const router = require('./routes');
// Add the routes to the application as middleware
app.use(router);

// create a variable to hold our port number
const PORT = process.env.PORT;
//  start the webserver
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// export the webserver for use in the application
module.exports = app;

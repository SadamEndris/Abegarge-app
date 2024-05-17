// Import the express module
const express = require('express');
// Import the dotenv module and call the config() method
require('dotenv').config();
// import the sanitize module
const sanitize = require('sanitize');
// Import the CORS module
const cors = require('cors');
// Set up the CORS options to allow requests from our front-end
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200,
};
// create the webserver
const app = express();
// Add the cors middleware
app.use(cors(corsOptions));
// Add the express.json() middleware
app.use(express.json());
// Add the sanitizer to the express middleware
app.use(sanitize.middleware);
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



// used to generate hashed password
// const bcrypt = require('bcrypt');
// const saltRounds = 10;  // data processing time
// var password = '12345678';

// Combined function to generate salt and hash
// bcrypt.hash(password, saltRounds, function (err, hash) {
//   console.log(`Hash: ${hash}`);
// });

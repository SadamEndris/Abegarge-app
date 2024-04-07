//  import the mysql2 module promise wrapper
const mysql = require('mysql2/promise');
// define the connection parameters for the database
const dbConfig = {
  connectionLimit: 10,
  password: process.env.DB_PASS,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
};

// create teh connection pool
const pool = mysql.createPool(dbConfig);

// prepare a function that will execute the SQL queries asynchronously
async function query(sql, params) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}
// export the query function for use in the application
module.exports = {
  query,
};

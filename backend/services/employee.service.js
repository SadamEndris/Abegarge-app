// Import the query function from the db.config.js file
const conn = require("../config/db.config");
// Import the bcrypt module
const bcrypt = require("bcrypt");
// a function to check if the employee exists in the database
async function checkIfEmployeeExists(email) {
  const query = "SELECT * FROM employee WHERE employee_email= ? ";
  // Execute the queries
  const rows = await conn.query(query, [email]);
  console.log(rows);
  // Check if the employee exists
  if (rows.length > 0) {
    return true;
  } else {
    return false;
  }
}

// A function to create a new employee
async function createEmployee(employee) {
  let createdEmployee = {};
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(employee.employee_password, salt);

    const query =
      "INSERT INTO employee (employee_email, active_employee) VALUES (?, ?)";
    const rows = await conn.query(query, [
      employee.employee_email,
      employee.active_employee,
    ]);
    console.log("Insert into employee result:", rows);

    if (rows.affectedRows !== 1) {
      return false;
    }

    const employee_id = rows.insertId;
    console.log("New employee ID:", employee_id);

    const query2 =
      "INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone) VALUES (?, ?, ?, ?)";
    const rows2 = await conn.query(query2, [
      employee_id,
      employee.employee_first_name,
      employee.employee_last_name,
      employee.employee_phone,
    ]);
    console.log("Insert into employee_info result:", rows2);

    const query3 =
      "INSERT INTO employee_pass (employee_id, employee_password_hashed) VALUES (?, ?)";
    const rows3 = await conn.query(query3, [employee_id, hashedPassword]);
    console.log("Insert into employee_pass result:", rows3);

    const query4 =
      "INSERT INTO employee_role (employee_id, company_role_id) VALUES (?, ?)";
    const rows4 = await conn.query(query4, [
      employee_id,
      employee.company_role_id,
    ]);
    console.log("Insert into employee_role result:", rows4);

    createdEmployee = { employee_id };
  } catch (err) {
    console.error("Error in createEmployee:", err);
  }

  return createdEmployee;
}

// A function to get employee by email
async function getEmployeeByEmail(employee_email) {
  const query =
    "SELECT * FROM employee INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id INNER JOIN employee_pass ON employee.employee_id = employee_pass.employee_id INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id WHERE employee.employee_email = ?";
  const rows = await conn.query(query, [employee_email]);
  return rows;
}
// A function to get all employees

async function getAllEmployees() {
  try {
    const query = `
      SELECT * 
      FROM employee 
      INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id 
      INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id 
      INNER JOIN company_roles ON employee_role.company_role_id = company_roles.company_role_id  
      ORDER BY employee.employee_id DESC 
      LIMIT 10
    `;

    // Await the query and get the rows
    const rows = await conn.query(query);

    // Log the results for debugging purposes
    console.log("Fetched employees:", rows);

    // Return the fetched employees
    return rows;
  } catch (err) {
    // Log any errors for debugging
    console.error("Error fetching employees:", err);
    throw err; // Rethrow the error to be handled in the controller
  }
}

// Export the functions for use in the controller
module.exports = {
  checkIfEmployeeExists,
  createEmployee,
  getEmployeeByEmail,
  getAllEmployees,
};

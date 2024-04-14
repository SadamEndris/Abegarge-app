// Import the employee service
const employeeService = require('../services/employee.service');
// Create the add employee controller
async function createEmployee(req, res, next) {
  // check if the employee exists in the database
  const employeeExists = await employeeService.checkIfEmployeeExists(
    req.body.employee_email
  );
  //   if employee exists, send a response to the client
  if (employeeExists) {
    return res.status(400).json({
      error: 'This email address is already associated with another employee!',
    });
  } else {
    try {
      const employeeData = req.body;
      // Create the employee
      const employee = await employeeService.createEmployee(employeeData);
      if (!employee) {
        return res.status(400).json({
          error: 'Failed to add the employee!',
        });
      } else {
        return res.status(200).json({
          status: 'Employee added successfully',
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        error: 'Something went wrong!',
      });
    }
  }
}

// Export the createEmployee controller
module.exports = {
  createEmployee,
};

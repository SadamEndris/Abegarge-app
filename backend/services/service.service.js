// import the database connection
const db = require("../config/db.config");

// Function to add a new service
async function addService(requestData) {
  const { service_name, service_description } = requestData;

  try {
    // Check if service already exists
    const checkQuery = `SELECT service_id FROM common_services WHERE service_name = ?`;
    const existingService = await db.query(checkQuery, [service_name]);

    if (existingService.length > 0) {
      return "EXISTS"; // Service with the same name already exists
    }

    // Insert the new service if it doesn't exist
    const insertQuery = `
      INSERT INTO common_services (service_name, service_description)
      VALUES (?, ?);
    `;
    const result = await db.query(insertQuery, [
      service_name,
      service_description,
    ]);
    return result.insertId; // Return the ID of the new service
  } catch (error) {
    console.error("Error adding service:", error);
    throw new Error("Internal Server Error");
  }
}

const getAllServices = async () => {
  try {
    const query = `SELECT service_id, service_name, service_description FROM common_services;`;
    const services = await db.query(query);
    return services;
  } catch (error) {
    console.error("Error retrieving services:", error);
    throw new Error("Internal Server Error");
  }
};
// Export the service functions
module.exports = {
  addService,
  getAllServices,
};

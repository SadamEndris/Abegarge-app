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

const getServiceById = async (serviceId) => {
  try {
    const query = `SELECT service_id, service_name, service_description FROM common_services WHERE service_id = ?;`;
    const [service] = await db.query(query, [serviceId]); // Destructure to get single service

    return service || null; // Return service if found, otherwise null
  } catch (error) {
    console.error("Error retrieving service by ID:", error);
    throw new Error("Internal Server Error");
  }
};

const updateService = async (serviceId, updateData) => {
  const { service_name, service_description } = updateData;

  try {
    // Check if the service exists
    const checkQuery = `SELECT service_id FROM common_services WHERE service_id = ?`;
    const existingService = await db.query(checkQuery, [serviceId]);

    if (existingService.length === 0) {
      return "NOT_FOUND"; // Service with the specified ID not found
    }

    // Update the service with new data
    const updateQuery = `
      UPDATE common_services 
      SET service_name = ?, service_description = ?
      WHERE service_id = ?;
    `;
    await db.query(updateQuery, [service_name, service_description, serviceId]);
    return true;
  } catch (error) {
    console.error("Error updating service:", error);
    throw new Error("Internal Server Error");
  }
};

// Export the service functions
module.exports = {
  addService,
  getAllServices,
  getServiceById,
  updateService,
};

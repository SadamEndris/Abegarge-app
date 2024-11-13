// vehicle.service.js
const db = require("../config/db.config"); // Adjust according to your setup

// Function to check if a customer exists in the customer_info table
const checkCustomerExists = async (customer_id) => {
  try {
    const query = `SELECT customer_id FROM customer_info WHERE customer_id = ?`;
    const [customer] = await db.query(query, [customer_id]);

    if (customer) {
      return true; // Customer exists
    } else {
      return false; // Customer does not exist
    }
  } catch (error) {
    console.error("Error checking customer:", error);
    throw new Error("Internal Server Error");
  }
};

// Function to check if a customer already has a vehicle in the customer_vehicle_info table
const checkCustomerHasVehicle = async (customer_id) => {
  try {
    const query = `SELECT vehicle_id FROM customer_vehicle_info WHERE customer_id = ?`;
    const [vehicle] = await db.query(query, [customer_id]);

    if (vehicle) {
      return true; // Customer has an existing vehicle
    } else {
      return false; // Customer does not have an existing vehicle
    }
  } catch (error) {
    console.error("Error checking customer vehicle:", error);
    throw new Error("Internal Server Error");
  }
};

// Function to add a new vehicle
const addVehicle = async (vehicleData) => {
  const {
    customer_id,
    vehicle_model,
    vehicle_year,
    vehicle_make,
    vehicle_type,
    vehicle_mileage,
    vehicle_serial,
    vehicle_tag,
    vehicle_color,
  } = vehicleData;

  try {
    const query = `
      INSERT INTO customer_vehicle_info 
      (customer_id, vehicle_model, vehicle_year, vehicle_make, vehicle_type, 
      vehicle_mileage, vehicle_serial, vehicle_tag, vehicle_color)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    await db.query(query, [
      customer_id,
      vehicle_model,
      vehicle_year,
      vehicle_make,
      vehicle_type,
      vehicle_mileage,
      vehicle_serial,
      vehicle_tag,
      vehicle_color,
    ]);
  } catch (error) {
    console.error("Error adding vehicle:", error);
    throw new Error("Internal Server Error");
  }
};

module.exports = {
  checkCustomerExists,
  checkCustomerHasVehicle,
  addVehicle,
};

// vehicle.service.js
const db = require("../config/db.config");

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

// Function to retrieve all vehicles for a specific customer
const getVehiclesByCustomerId = async (customer_id) => {
  try {
    const query = `
      SELECT vehicle_id, customer_id, vehicle_year, vehicle_make, vehicle_model,
      vehicle_type, vehicle_mileage, vehicle_tag, vehicle_serial, vehicle_color
      FROM customer_vehicle_info
      WHERE customer_id = ?;
    `;
    const vehicles = await db.query(query, [customer_id]);
    return vehicles;
  } catch (error) {
    console.error("Error retrieving vehicles:", error);
    throw new Error("Internal Server Error");
  }
};

// Function to retrieve a specific vehicle by customer_id and vehicle_id
const getVehicleById = async (customer_id, vehicle_id) => {
  try {
    const query = `
      SELECT vehicle_id, customer_id, vehicle_year, vehicle_make, vehicle_model,
             vehicle_type, vehicle_mileage, vehicle_tag, vehicle_serial, vehicle_color
      FROM customer_vehicle_info
      WHERE customer_id = ? AND vehicle_id = ?;
    `;
    const [vehicle] = await db.query(query, [customer_id, vehicle_id]);
    return vehicle || null; // Return vehicle if found, otherwise null
  } catch (error) {
    console.error("Error retrieving vehicle:", error);
    throw new Error("Internal Server Error");
  }
};

// Function to check if a vehicle exists for a specific customer_id and vehicle_id
const checkVehicleExists = async (vehicle_id, customer_id) => {
  try {
    const query = `SELECT vehicle_id FROM customer_vehicle_info WHERE vehicle_id = ? AND customer_id = ?`;
    const [vehicle] = await db.query(query, [vehicle_id, customer_id]);
    return !!vehicle; // Return true if vehicle exists, otherwise false
  } catch (error) {
    console.error("Error checking vehicle:", error);
    throw new Error("Internal Server Error");
  }
};

// Function to update an existing vehicle
const updateVehicle = async (vehicleData) => {
  const {
    vehicle_id,
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
      UPDATE customer_vehicle_info
      SET vehicle_model = ?, vehicle_year = ?, vehicle_make = ?, 
          vehicle_type = ?, vehicle_mileage = ?, vehicle_serial = ?, 
          vehicle_tag = ?, vehicle_color = ?
      WHERE vehicle_id = ? AND customer_id = ?;
    `;

    await db.query(query, [
      vehicle_model,
      vehicle_year,
      vehicle_make,
      vehicle_type,
      vehicle_mileage,
      vehicle_serial,
      vehicle_tag,
      vehicle_color,
      vehicle_id,
      customer_id,
    ]);
  } catch (error) {
    console.error("Error updating vehicle:", error);
    throw new Error("Internal Server Error");
  }
};
module.exports = {
  checkCustomerExists,
  addVehicle,
  getVehiclesByCustomerId,
  getVehicleById,
  checkVehicleExists,
  updateVehicle,
};

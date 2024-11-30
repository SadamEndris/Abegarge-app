const conn = require("../config/db.config");
const { v4: uuidv4 } = require("uuid");

/**
 * Service to create a new order
 * @param {Object} body - Request body containing order details
 * @returns {number} - The ID of the newly created order
 * @throws {Error} - Throws an error if any operation fails
 */
const createOrder = async (body) => {
  try {
    // Step 1: Validate employee_id, customer_id, and vehicle_id
    const validateQuery = `
      SELECT EXISTS(
        SELECT 1 FROM employee WHERE employee_id = ?
      ) AS valid_employee,
      EXISTS(
        SELECT 1 FROM customer_identifier WHERE customer_id = ?
      ) AS valid_customer,
      EXISTS(
        SELECT 1 FROM customer_vehicle_info WHERE vehicle_id = ?
      ) AS valid_vehicle;
    `;
    const [validationResult] = await conn.query(validateQuery, [
      body.employee_id,
      body.customer_id,
      body.vehicle_id,
    ]);

    if (
      !validationResult.valid_employee ||
      !validationResult.valid_customer ||
      !validationResult.valid_vehicle
    ) {
      throw new Error("Invalid employee_id, customer_id, or vehicle_id.");
    }

    // Step 2: Insert into orders table
    const orderHash = uuidv4();
    const orderQuery = `
      INSERT INTO orders (employee_id, customer_id, vehicle_id, order_date, active_order, order_hash)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?, ?);
    `;
    const orderResult = await conn.query(orderQuery, [
      body.employee_id,
      body.customer_id,
      body.vehicle_id,
      body.order_completed ? 1 : 0,
      orderHash,
    ]);

    const order_id = orderResult.insertId;

    // Step 3: Insert into order_info table
    const orderInfoQuery = `
      INSERT INTO order_info (order_id, estimated_completion_date, completion_date, additional_request, notes_for_internal_use, additional_requests_completed)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
    await conn.query(orderInfoQuery, [
      order_id,
      body.estimated_completion_date,
      body.completion_date || null,
      body.order_description,
      null,
      0,
    ]);

    // Step 4: Insert into order_services table
    let orderServicesQuery = `
      INSERT INTO order_services (order_id, service_id, service_completed) VALUES
    `;
    const orderServicesValues = body.order_services
      .map((service) => `(${order_id}, ${service.service_id}, 0)`)
      .join(", ");

    orderServicesQuery += orderServicesValues;
    await conn.query(orderServicesQuery);

    // Step 5: Insert initial order status
    const orderStatusQuery = `
      INSERT INTO order_status (order_id, order_status)
      VALUES (?, 0); -- 0 = Pending
    `;
    await conn.query(orderStatusQuery, [order_id]);

    // Return the created order_id
    return order_id;
  } catch (err) {
    console.error("Error in createOrder service:", err.message);
    throw err;
  }
};

/**
 * Service to retrieve all orders from the database
 * @returns {Array<Object>} - List of orders with their details
 * @throws {Error} - Throws an error if any operation fails
 */
const getAllOrders = async () => {
  try {
    // Query to fetch all orders and their details with descriptive aliases
    const query = `
                SELECT 
  orders.order_id,
  orders.employee_id,
  orders.customer_id,
  orders.vehicle_id,
  order_info.additional_request AS order_description,
  orders.order_date,
  order_info.estimated_completion_date,
  order_info.completion_date,
  order_info.additional_requests_completed AS order_completed,
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'order_service_id', order_services.order_service_id,
      'order_id', order_services.order_id,
      'service_id', order_services.service_id
    )
  ) AS order_services
FROM orders
JOIN order_info ON orders.order_id = order_info.order_id
LEFT JOIN order_services ON orders.order_id = order_services.order_id
GROUP BY orders.order_id
ORDER BY orders.order_date DESC;

    `;

    // Execute the query
    const rows = await conn.query(query);

    return rows;
  } catch (err) {
    console.error("Error in getAllOrders service:", err.message);
    throw err;
  }
};

/**
 * Service to retrieve a single order by ID from the database
 * @param {number} orderId - ID of the order to retrieve
 * @returns {Object|null} - Order details or null if not found
 * @throws {Error} - Throws an error if database operation fails
 */
const getOrderById = async (orderId) => {
  try {
    // Query to fetch a specific order by ID with related data
    const query = `
      SELECT 
        orders.order_id,
        orders.employee_id,
        orders.customer_id,
        orders.vehicle_id,
        customer_info.customer_first_name,
        customer_info.customer_last_name,
        customer_vehicle_info.vehicle_make,
        customer_vehicle_info.vehicle_model,
        customer_vehicle_info.vehicle_year,
        order_info.additional_request AS order_description,
        orders.order_date,
        order_info.estimated_completion_date,
        order_info.completion_date,
        order_info.additional_requests_completed AS order_completed,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'order_service_id', order_services.order_service_id,
            'order_id', order_services.order_id,
            'service_id', order_services.service_id,
            'service_completed', order_services.service_completed
          )
        ) AS order_services
      FROM orders
      JOIN order_info ON orders.order_id = order_info.order_id
      LEFT JOIN order_services ON orders.order_id = order_services.order_id
      JOIN customer_info ON orders.customer_id = customer_info.customer_id
      JOIN customer_vehicle_info ON orders.vehicle_id = customer_vehicle_info.vehicle_id
      WHERE orders.order_id = ?
      GROUP BY orders.order_id;
    `;

    // Execute the query with the provided orderId
    const [rows, fields] = await conn.query(query, [orderId]);

    // if no rows are returned, the order does not exist in the database
    if (rows.length === 0) {
      return null;
    }

    // access the row of the result
    const order = rows;
    // console.log("order details", order);

    // If order exists, return the order details
    return order;
  } catch (err) {
    console.error("Error in getOrderById service:", err.message);
    throw new Error("Failed to retrieve order from the database.");
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
};

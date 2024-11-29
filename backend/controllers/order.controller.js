const orderService = require("../services/order.service");

/**
 * Controller to handle order creation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createOrder = async (req, res) => {
  const {
    employee_id,
    customer_id,
    vehicle_id,
    order_description,
    estimated_completion_date,
    completion_date,
    order_completed,
    order_services,
  } = req.body;

  // Validate required fields
  if (
    !employee_id ||
    !customer_id ||
    !vehicle_id ||
    !order_description ||
    !estimated_completion_date ||
    !order_services ||
    !Array.isArray(order_services) ||
    order_services.length === 0
  ) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Missing or invalid required fields.",
    });
  }

  try {
    // Call service function to handle database operations
    const orderId = await orderService.createOrder({
      employee_id,
      customer_id,
      vehicle_id,
      order_description,
      estimated_completion_date,
      completion_date,
      order_completed,
      order_services,
    });

    return res.status(201).json({
      message: "Order created successfully.",
      success: true,
      order_id: orderId, // Return the ID of the newly created order
    });
  } catch (error) {
    console.error("Error in createOrder controller:", error.message);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred while creating the order.",
    });
  }
};

module.exports = {
  createOrder,
};

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

/**
 * Controller to handle retrieving all orders
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllOrders = async (req, res) => {
  try {
    // Call the service function to fetch all orders
    const orders = await orderService.getAllOrders();

    // Return the retrieved orders
    return res.status(200).json({
      message: "Orders retrieved successfully.",
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error in getAllOrders controller:", error.message);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred while retrieving orders.",
    });
  }
};

/**
 * Controller to handle retrieving a single order by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
// Controller for handling the response
const getOrderById = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await orderService.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order retrieved successfully.",
      data: order,
    });
  } catch (error) {
    console.error("Error in getOrderById controller:", error.message);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: "An unexpected error occurred while retrieving the order.",
    });
  }
};

/**
 * Controller to update an order
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateOrderController = async (req, res) => {
  try {
    const {
      order_id,
      customer_id,
      employee_id,
      vehicle_id,
      order_date,
      estimated_completion_date,
      completion_date,
      order_description,
      order_completed,
      order_services,
    } = req.body;

    // Validate required fields
    const requiredFields = [
      "order_id",
      "customer_id",
      "employee_id",
      "vehicle_id",
      "order_date",
      "estimated_completion_date",
      "completion_date",
      "order_description",
      "order_completed",
      "order_services",
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          error: "Bad Request",
          message: `Please provide all required fields. Missing: ${field}`,
        });
      }
    }

    // Call service to update the order
    const isUpdated = await orderService.updateOrderService(req.body);

    if (!isUpdated) {
      return res.status(404).json({
        error: "Not Found",
        message: "Order not found",
      });
    }

    return res.status(200).json({
      message: "Order updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in updateOrderController:", error.message);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
};

// Export the controller functions
module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderController,
};

const express = require("express");
const {
  handelCreateOrder,
  handelGetOrdersByUserId,
  handelGetOrderById,
  handelUpdateOrderStatus,
  handelGetAllOrders,
} = require("../controllers/orderController");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

const router = express.Router();

// Create order
router.post("/create", verifyToken, handelCreateOrder);

// Get all orders (admin only)
router.get("/all", verifyToken, verifyAdmin, handelGetAllOrders);

// Get orders by user
router.get("/user/:userId", verifyToken, handelGetOrdersByUserId);

// Get single order
router.get("/:orderId", verifyToken, handelGetOrderById);
router.get("/details/:orderId", verifyToken, handelGetOrderById);

// Update order status (admin only)
router.put("/update/:orderId", verifyToken, verifyAdmin, handelUpdateOrderStatus);

module.exports = router;

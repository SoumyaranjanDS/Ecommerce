import express from "express";
import {
  handelCreateOrder,
  handelGetOrdersByUserId,
  handelGetOrderById,
  handelUpdateOrderStatus,
  handelGetAllOrders,
} from "../controllers/orderController.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

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

export default router;

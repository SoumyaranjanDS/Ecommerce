import express from "express";
import {
  handelGetDashboardStats,
  handelGetSalesData,
} from "../controllers/dashboardController.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// Get dashboard stats (admin only)
router.get("/stats", verifyToken, verifyAdmin, handelGetDashboardStats);

// Get sales data (admin only)
router.get("/sales", verifyToken, verifyAdmin, handelGetSalesData);

export default router;

const express = require("express");
const {
  handelGetDashboardStats,
  handelGetSalesData,
} = require("../controllers/dashboardController");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

const router = express.Router();

// Get dashboard stats (admin only)
router.get("/stats", verifyToken, verifyAdmin, handelGetDashboardStats);

// Get sales data (admin only)
router.get("/sales", verifyToken, verifyAdmin, handelGetSalesData);

module.exports = router;

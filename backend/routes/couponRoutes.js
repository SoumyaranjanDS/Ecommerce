const express = require("express");
const {
  handelCreateCoupon,
  handelValidateCoupon,
  handelUseCoupon,
  handelGetAllCoupons,
  handelDeleteCoupon,
} = require("../controllers/couponController");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

const router = express.Router();

// Create coupon (admin only)
router.post("/create", verifyToken, verifyAdmin, handelCreateCoupon);

// Validate coupon
router.post("/validate", handelValidateCoupon);

// Use coupon
router.post("/use", handelUseCoupon);

// Get all coupons (admin only)
router.get("/", verifyToken, verifyAdmin, handelGetAllCoupons);

// Delete coupon (admin only)
router.delete("/:couponId", verifyToken, verifyAdmin, handelDeleteCoupon);

module.exports = router;

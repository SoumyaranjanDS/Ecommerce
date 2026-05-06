import express from "express";
import {
  handelCreateCoupon,
  handelValidateCoupon,
  handelUseCoupon,
  handelGetAllCoupons,
  handelDeleteCoupon,
} from "../controllers/couponController.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

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

export default router;

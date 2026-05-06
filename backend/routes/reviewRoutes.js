import express from "express";
import {
  handelCreateReview,
  handelGetProductReviews,
  handelGetUserReviews,
  handelUpdateReview,
  handelDeleteReview,
} from "../controllers/reviewController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Create review
router.post("/create", verifyToken, handelCreateReview);

// Get product reviews
router.get("/product/:productId", handelGetProductReviews);

// Get user reviews
router.get("/user", verifyToken, handelGetUserReviews);

// Update review
router.put("/:reviewId", verifyToken, handelUpdateReview);

// Delete review
router.delete("/:reviewId", verifyToken, handelDeleteReview);

export default router;

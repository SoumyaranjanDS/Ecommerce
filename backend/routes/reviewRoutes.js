const express = require("express");
const {
  handelCreateReview,
  handelGetProductReviews,
  handelGetUserReviews,
  handelUpdateReview,
  handelDeleteReview,
} = require("../controllers/reviewController");
const { verifyToken } = require("../middleware/auth");

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

module.exports = router;

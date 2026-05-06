import mongoose from "mongoose";
import Review from "../models/review.js";
import Product from "../models/product.js";
import Order from "../models/order.js";

export const handelCreateReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.userId;
    const { orderId } = req.body;

    if (!productId || !rating || !orderId) {
      return res
        .status(400)
        .json({ message: "Product ID, Order ID, and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Check if user has purchased this product
    const order = await Order.findById(orderId);
    if (!order || order.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You can only review products from your orders" });
    }

    // Check if product exists in order
    const productInOrder = order.products.some(
      (p) => p.productId.toString() === productId
    );
    if (!productInOrder) {
      return res
        .status(403)
        .json({ message: "Product not found in your order" });
    }

    // Create review
    const review = await Review.create({
      productId,
      userId,
      orderId,
      rating,
      comment: comment || "",
    });

    res.status(201).json({
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const handelGetProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { limit = 10, page = 1 } = req.query;

    const skip = (page - 1) * limit;

    const reviews = await Review.find({ productId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const totalReviews = await Review.countDocuments({ productId });
    const avgRating =
      (await Review.aggregate([
        { $match: { productId: new mongoose.Types.ObjectId(productId) } },
        { $group: { _id: null, avg: { $avg: "$rating" } } },
      ])) || [];

    res.status(200).json({
      reviews,
      totalReviews,
      averageRating: avgRating.length > 0 ? avgRating[0].avg : 0,
      pages: Math.ceil(totalReviews / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const handelGetUserReviews = async (req, res) => {
  try {
    const userId = req.userId;
    const { limit = 10, page = 1 } = req.query;

    const skip = (page - 1) * limit;

    const reviews = await Review.find({ userId })
      .populate("productId", "title image price")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const totalReviews = await Review.countDocuments({ userId });

    res.status(200).json({
      reviews,
      totalReviews,
      pages: Math.ceil(totalReviews / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const handelUpdateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.userId;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (rating) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
      }
      review.rating = rating;
    }

    if (comment !== undefined) {
      review.comment = comment;
    }

    await review.save();

    res.status(200).json({
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const handelDeleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.userId;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

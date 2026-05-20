import mongoose from "mongoose";
import Product from "../models/product.js";

export const handelCreateProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error", error });
  }
};

export const handelGetAllProducts = async (req, res) => {
  try {
    const { search, category, limit = 10, page = 1, sort = "newest", minPrice, maxPrice, rating } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    if (category) {
      query.category = category;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price-low") sortOption = { price: 1 };
    else if (sort === "price-high") sortOption = { price: -1 };
    else if (sort === "rating") sortOption = { rating: -1, totalRatings: -1 };
    else if (sort === "popular") sortOption = { totalRatings: -1, rating: -1 };

    const skip = (page - 1) * limit;
    
    const products = await Product.find(query)
      .sort(sortOption)
      .limit(Number(limit))
      .skip(Number(skip));

    const totalProducts = await Product.countDocuments(query);

    res.json({
      products,
      totalProducts,
      pages: Math.ceil(totalProducts / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error", error });
  }
};

export const handelGetProductById = async (req, res) => {
  try {
    const oneProduct = await Product.findById(req.params.id);

    if (!oneProduct) {
      return res.status(404).json({ message: "product does not exist" });
    }

    return res.status(200).json({ oneProduct });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const handelUpdateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "product not found" });
    }

    res
      .status(200)
      .json({ message: "product updated successfully", updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

export const handelDeleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

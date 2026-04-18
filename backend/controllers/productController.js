const mongoose = require("mongoose");
const Product = require("../models/poduct");

const handelCreateProduct = async (req, res) => {
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

const handelGetAllProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    if (category) {
      query.category = category;
    } 

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "internal server error", error });
  }
};

const handelGetProductById = async (req, res) => {
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

const handelUpdateProduct = async (req, res) => {
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

const handelDeleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

module.exports = {
  handelCreateProduct,
  handelGetAllProducts,
  handelGetProductById,
  handelUpdateProduct,
  handelDeleteProduct,
};

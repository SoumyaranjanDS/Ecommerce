const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Product = mongoose.model("product", productSchema);

module.exports = Product;

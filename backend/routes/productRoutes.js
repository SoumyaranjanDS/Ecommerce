const express = require("express");

const {
  handelCreateProduct,
  handelGetAllProducts,
  handelGetProductById,
  handelUpdateProduct,
  handelDeleteProduct,
} = require("../controllers/productController");

const router = express.Router();

router.post("/create", handelCreateProduct);
router.get("/", handelGetAllProducts);
router.get("/:id", handelGetProductById);
router.post("/update/:id", handelUpdateProduct);
router.put("/update/:id", handelUpdateProduct);
router.delete("/delete/:id", handelDeleteProduct);

module.exports = router;

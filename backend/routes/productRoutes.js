const express = require("express");

const {
  handelCreateProduct,
  handelGetAllProducts,
  handelGetProductById,
  handelUpdateProduct,
  handelDeleteProduct,
} = require("../controllers/productController");

const { verifyToken, verifyAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/create", verifyToken, verifyAdmin, handelCreateProduct);
router.get("/", handelGetAllProducts);
router.get("/:id", handelGetProductById);
router.post("/update/:id", verifyToken, verifyAdmin, handelUpdateProduct);
router.put("/update/:id", verifyToken, verifyAdmin, handelUpdateProduct);
router.delete("/delete/:id", verifyToken, verifyAdmin, handelDeleteProduct);

module.exports = router;

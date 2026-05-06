import express from "express";
import {
  handelCreateProduct,
  handelGetAllProducts,
  handelGetProductById,
  handelUpdateProduct,
  handelDeleteProduct,
} from "../controllers/productController.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", verifyToken, verifyAdmin, handelCreateProduct);
router.get("/", handelGetAllProducts);
router.get("/:id", handelGetProductById);
router.post("/update/:id", verifyToken, verifyAdmin, handelUpdateProduct);
router.put("/update/:id", verifyToken, verifyAdmin, handelUpdateProduct);
router.delete("/delete/:id", verifyToken, verifyAdmin, handelDeleteProduct);

export default router;

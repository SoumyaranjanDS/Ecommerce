import express from "express";
import {
  handelAddToCart,
  handelRemoveFromCart,
  handelUpdateCart,
  handelGetCartByUserId,
} from "../controllers/cartController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/add", verifyToken, handelAddToCart);
router.post("/remove", verifyToken, handelRemoveFromCart);
router.post("/update", verifyToken, handelUpdateCart);
router.get("/:userId", verifyToken, handelGetCartByUserId);

export default router;

import express from "express";
import {
  handelAddToWishlist,
  handelRemoveFromWishlist,
  handelGetWishlist,
} from "../controllers/wishlistController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, handelGetWishlist);
router.post("/add", verifyToken, handelAddToWishlist);
router.delete("/remove/:productId", verifyToken, handelRemoveFromWishlist);

export default router;

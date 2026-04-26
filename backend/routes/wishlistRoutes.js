const express = require("express");
const {
  handelAddToWishlist,
  handelRemoveFromWishlist,
  handelGetWishlist,
} = require("../controllers/wishlistController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.get("/", verifyToken, handelGetWishlist);
router.post("/add", verifyToken, handelAddToWishlist);
router.delete("/remove/:productId", verifyToken, handelRemoveFromWishlist);

module.exports = router;

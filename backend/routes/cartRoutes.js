const express = require("express");
const {
  handelAddToCart,
  handelRemoveFromCart,
  handelUpdateCart,
  handelGetCartByUserId,
} = require("../controllers/cartController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.post("/add", verifyToken, handelAddToCart);
router.post("/remove", verifyToken, handelRemoveFromCart);
router.post("/update", verifyToken, handelUpdateCart);
router.get("/:userId", verifyToken, handelGetCartByUserId);

module.exports = router;

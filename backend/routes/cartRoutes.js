const express = require("express");
const {
  handelAddToCart,
  handelRemoveFromCart,
  handelUpdateCart,
  handelGetCartByUserId,
} = require("../controllers/cartController");

const router = express.Router();

router.post("/add", handelAddToCart);
router.post("/remove", handelRemoveFromCart);
router.post("/update", handelUpdateCart);
router.get("/:userId", handelGetCartByUserId);

module.exports = router;

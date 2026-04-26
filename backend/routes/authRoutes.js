const express = require("express");
const { 
  handelSignupUser, 
  handelLoginUser, 
  handelRefreshToken, 
  handelLogoutUser 
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", handelSignupUser);
router.post("/login", handelLoginUser);
router.post("/refresh", handelRefreshToken);
router.post("/logout", handelLogoutUser);

module.exports = router;
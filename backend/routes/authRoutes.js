const express = require("express");
const { handelSignupUser, handelLoginUser } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", handelSignupUser);
router.post("/login", handelLoginUser);

module.exports = router;
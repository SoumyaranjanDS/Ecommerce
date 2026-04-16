const express = require("express");
const { handelSignupUser } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", handelSignupUser);

module.exports = router;
const express = require("express");
const {
  handelSaveAddress,
  handelGetSavedAddress,
} = require("../controllers/addressController");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.post("/save", verifyToken, handelSaveAddress);
router.get("/get/:userid", verifyToken, handelGetSavedAddress);

module.exports = router
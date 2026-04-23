const express = require("express");
const {
  handelSaveAddress,
  handelGetSavedAddress,
} = require("../controllers/addressController");

const router = express.Router();

router.post("/save", handelSaveAddress);
router.get("/get/:userid", handelGetSavedAddress);

module.exports = router
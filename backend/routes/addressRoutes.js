import express from "express";
import {
  handelSaveAddress,
  handelGetSavedAddress,
} from "../controllers/addressController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/save", verifyToken, handelSaveAddress);
router.get("/get/:userid", verifyToken, handelGetSavedAddress);

export default router;
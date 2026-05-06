import express from "express";
import { 
  handelSignupUser, 
  handelLoginUser, 
  handelRefreshToken, 
  handelLogoutUser 
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", handelSignupUser);
router.post("/login", handelLoginUser);
router.post("/refresh", handelRefreshToken);
router.post("/logout", handelLogoutUser);

export default router;
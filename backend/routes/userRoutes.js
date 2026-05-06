import express from "express";
import {
  handelGetUserProfile,
  handelUpdateUserProfile,
  handelChangePassword,
  handelGetAllUsers,
  handelDeleteUser,
  handelUpdateUserRole,
} from "../controllers/userController.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// Get profile
router.get("/profile", verifyToken, handelGetUserProfile);

// Update profile
router.put("/profile", verifyToken, handelUpdateUserProfile);

// Change password
router.post("/change-password", verifyToken, handelChangePassword);

// Admin only routes
router.get("/", verifyToken, verifyAdmin, handelGetAllUsers);
router.delete("/:id", verifyToken, verifyAdmin, handelDeleteUser);
router.put("/role/:id", verifyToken, verifyAdmin, handelUpdateUserRole);

export default router;

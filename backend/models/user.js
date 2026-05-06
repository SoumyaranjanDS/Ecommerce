import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  }],
  loyaltyPoints: {
    type: Number,
    default: 0,
  },
  loyaltyTier: {
    type: String,
    enum: ["bronze", "silver", "gold", "platinum"],
    default: "bronze",
  },
  referralCode: {
    type: String,
    unique: true,
  },
  referredBy: {
    type: String,
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;

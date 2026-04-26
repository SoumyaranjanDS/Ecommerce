const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const Coupon = require("./models/coupon");

dotenv.config({ path: path.join(__dirname, ".env") });

const seedCoupon = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const code = "COMEBACK10";
    const existing = await Coupon.findOne({ code });

    if (existing) {
      console.log("Coupon COMEBACK10 already exists");
    } else {
      await Coupon.create({
        code,
        discountType: "percentage",
        discountValue: 10,
        minOrderAmount: 0,
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year expiry
        isActive: true
      });
      console.log("Coupon COMEBACK10 created successfully");
    }

    process.exit(0);
  } catch (err) {
    console.error("Error seeding coupon:", err);
    process.exit(1);
  }
};

seedCoupon();

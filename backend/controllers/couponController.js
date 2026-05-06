import Coupon from "../models/coupon.js";

export const handelCreateCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, maxUses, expiryDate } =
      req.body;

    if (!code || !discountType || !discountValue || !expiryDate) {
      return res.status(400).json({
        message:
          "Code, discount type, discount value, and expiry date are required",
      });
    }

    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minOrderAmount: minOrderAmount || 0,
      maxUses: maxUses || null,
      expiryDate,
    });

    res.status(201).json({
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const handelValidateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code || !orderAmount) {
      return res.status(400).json({ message: "Code and order amount are required" });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ message: "Coupon is inactive" });
    }

    if (new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
    }

    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        message: `Minimum order amount for this coupon is Rs. ${coupon.minOrderAmount}`,
      });
    }

    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (orderAmount * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    res.status(200).json({
      message: "Coupon is valid",
      coupon,
      discountAmount,
      finalAmount: Math.max(0, orderAmount - discountAmount),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const handelUseCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Coupon code is required" });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    coupon.usedCount += 1;
    await coupon.save();

    res.status(200).json({
      message: "Coupon used successfully",
      coupon,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const handelGetAllCoupons = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const coupons = await Coupon.find()
      .limit(Number(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const totalCoupons = await Coupon.countDocuments();

    res.status(200).json({
      coupons,
      totalCoupons,
      pages: Math.ceil(totalCoupons / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const handelDeleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;

    const coupon = await Coupon.findByIdAndDelete(couponId);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json({
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

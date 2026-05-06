import Order from "../models/order.js";
import Cart from "../models/cart.js";
import Product from "../models/product.js";
import Coupon from "../models/coupon.js";
import User from "../models/user.js";
import { sendOrderConfirmation } from "../utils/emailService.js";

export const handelCreateOrder = async (req, res) => {
  try {
    const { userId, addressId, paymentMethod, couponCode, discountAmount } = req.body;

    if (!userId || !addressId) {
      return res.status(400).json({ message: "User ID and Address ID are required" });
    }

    // Get user's cart
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Validate stock availability
    for (const item of cart.products) {
      const product = item.productId;
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.title}. Available: ${product.stock}, Requested: ${item.quantity}`,
          product: product.title,
          available: product.stock,
          requested: item.quantity,
        });
      }
    }

    // Calculate total price and prepare order items
    let subtotal = 0;
    const orderProducts = [];

    for (const item of cart.products) {
      const product = item.productId;
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderProducts.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      // Reduce stock
      await Product.findByIdAndUpdate(
        product._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    const tax = Math.round(subtotal * 0.18);
    const finalPrice = subtotal + tax - (discountAmount || 0);

    // Create order
    const order = await Order.create({
      userId,
      products: orderProducts,
      addressId,
      totalPrice: finalPrice,
      tax,
      discount: discountAmount || 0,
      couponCode: couponCode || null,
      paymentMethod: paymentMethod || "cod",
      paymentStatus: "pending",
    });

    // If coupon was used, update coupon usage
    if (couponCode) {
      await Coupon.findOneAndUpdate({ code: couponCode }, { $inc: { usedCount: 1 } });
    }

    // Update user points and tier
    const user = await User.findById(userId);
    if (user) {
      const pointsEarned = Math.floor(finalPrice / 100);
      user.loyaltyPoints += pointsEarned;
      
      // Tier thresholds: Silver (500), Gold (2000), Platinum (5000)
      if (user.loyaltyPoints >= 5000) user.loyaltyTier = "platinum";
      else if (user.loyaltyPoints >= 2000) user.loyaltyTier = "gold";
      else if (user.loyaltyPoints >= 500) user.loyaltyTier = "silver";
      
      await user.save();

      // Referral Reward Logic: If first order and user was referred
      if (user.referredBy) {
        const orderCount = await Order.countDocuments({ userId: user._id });
        if (orderCount === 1) {
          const referrer = await User.findOne({ referralCode: user.referredBy });
          if (referrer) {
            referrer.loyaltyPoints += 200;
            await referrer.save();
          }
        }
      }

      // Send email confirmation
      if (user.email) {
        sendOrderConfirmation(user.email, order);
      }
    }

    // Clear cart after order creation
    await Cart.findOneAndUpdate({ userId }, { products: [] });

    res.status(201).json({
      message: "Order created successfully",
      order,
      pointsEarned: Math.floor(finalPrice / 100),
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const handelGetOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ userId })
      .populate("products.productId", "title price image")
      .populate("addressId")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const totalOrders = await Order.countDocuments({ userId });

    res.status(200).json({
      orders,
      totalOrders,
      pages: Math.ceil(totalOrders / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const handelGetOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("products.productId", "title price image")
      .populate("addressId")
      .populate("userId", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const handelUpdateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, paymentStatus } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(orderId, updateData, { new: true })
      .populate("userId", "email name");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Send status update email if necessary
    // (Could implement a more specific sendOrderStatusUpdate function)

    res.status(200).json({
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const handelGetAllOrders = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("products.productId", "title price")
      .populate("addressId")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip));

    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      orders,
      totalOrders,
      pages: Math.ceil(totalOrders / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


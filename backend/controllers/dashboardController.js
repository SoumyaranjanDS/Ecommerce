const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/poduct");
const Review = require("../models/review");

const handelGetDashboardStats = async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments({ role: "user" });

    // Total products
    const totalProducts = await Product.countDocuments();

    // Total orders
    const totalOrders = await Order.countDocuments();

    // Total revenue
    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: "completed" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Top products
    const topProducts = await Order.aggregate([
      { $unwind: "$products" },
      { $group: { _id: "$products.productId", count: { $sum: "$products.quantity" } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate("userId", "name email")
      .populate("products.productId", "title")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
      },
      ordersByStatus,
      topProducts,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const handelGetSalesData = async (req, res) => {
  try {
    // Sales by month
    const salesByMonth = await Order.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalSales: { $sum: "$totalPrice" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    // Category-wise sales
    const categoryWiseSales = await Order.aggregate([
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.category",
          totalRevenue: { $sum: { $multiply: ["$products.quantity", "$products.price"] } },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    res.status(200).json({
      salesByMonth,
      categoryWiseSales,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  handelGetDashboardStats,
  handelGetSalesData,
};

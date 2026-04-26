const User = require("../models/user");
const bcrypt = require("bcryptjs");

const handelGetUserProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const handelUpdateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({ message: "At least one field is required" });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      updateData.email = email;
    }

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select(
      "-password"
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const handelChangePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Old password and new password are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const handelGetAllUsers = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password")
      .limit(Number(limit))
      .skip(Number(skip))
      .sort({ createdAt: -1 });

    const totalUsers = await User.countDocuments();

    res.status(200).json({
      users,
      totalUsers,
      pages: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const handelDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const handelUpdateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");
    res.status(200).json({ message: "User role updated", user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  handelGetUserProfile,
  handelUpdateUserProfile,
  handelChangePassword,
  handelGetAllUsers,
  handelDeleteUser,
  handelUpdateUserRole,
};



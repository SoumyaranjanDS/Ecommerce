const User = require("../models/user");

const handelAddToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({ message: "Added to wishlist", wishlist: user.wishlist });
  } catch (error) {
    console.error("Wishlist Add Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const handelRemoveFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();

    res.status(200).json({ message: "Removed from wishlist", wishlist: user.wishlist });
  } catch (error) {
    console.error("Wishlist Remove Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const handelGetWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate("wishlist");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    console.error("Wishlist Get Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  handelAddToWishlist,
  handelRemoveFromWishlist,
  handelGetWishlist,
};

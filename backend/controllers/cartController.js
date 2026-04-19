const Cart = require("../models/cart");

// add to cart
const handelAddToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ message: "userId and productId are required" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        products: [{ productId, quantity: 1 }],
      });
    } else {
      const productIndex = cart.products.findIndex(
        (p) => p.productId.toString() === productId,
      );
      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ productId, quantity: 1 });
      }
    }
    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// remove from cart
const handelRemoveFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ message: "userId and productId are required" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    cart.products = cart.products.filter(
      (p) => p.productId.toString() !== productId,
    );
    await cart.save();
    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// update cart
const handelUpdateCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity == null) {
      return res
        .status(400)
        .json({ message: "userId, productId, and quantity are required" });
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res
        .status(400)
        .json({ message: "quantity must be an integer greater than 0" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.products.find((i) => i.productId.toString() === productId);

    if (!item) {
      return res.status(404).json({ message: "Product not found in cart" });
    }
    item.quantity = quantity;
    await cart.save();
    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// get cart by user id
const handelGetCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate("products.productId");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = {
  handelAddToCart,
  handelRemoveFromCart,
  handelUpdateCart,
  handelGetCartByUserId,
};

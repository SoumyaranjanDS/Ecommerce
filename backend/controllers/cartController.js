import Cart from "../models/cart.js";

// add to cart
export const handelAddToCart = async (req, res) => {
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
export const handelRemoveFromCart = async (req, res) => {
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

    // Use Mongoose pull to remove the item with the matching productId
    cart.products = cart.products.filter(
      (p) => p.productId && p.productId.toString() !== productId.toString()
    );

    await cart.save();
    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// update cart
export const handelUpdateCart = async (req, res) => {
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

    const item = cart.products.find(
      (i) => i.productId && i.productId.toString() === productId.toString()
    );

    if (!item) {
      return res.status(404).json({ message: "Product not found in cart" });
    }
    item.quantity = quantity;
    await cart.save();
    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// get cart by user id
export const handelGetCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    let cart = await Cart.findOne({ userId }).populate("products.productId");

    if (!cart) {
      return res.status(200).json({ cart: { userId, products: [] } });
    }

    // Auto-clean: Remove products that were deleted from the DB (null after populate)
    const originalLength = cart.products.length;
    cart.products = cart.products.filter((p) => p.productId !== null);

    if (cart.products.length !== originalLength) {
      await cart.save();
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

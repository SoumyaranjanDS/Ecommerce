const Cart = require("../models/cart");
const User = require("../models/user");
const { sendAbandonedCartEmail } = require("./emailService");

const runAbandonedCartCheck = async () => {
  console.log("Running abandoned cart check...");
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    // Find carts updated more than 1 hour ago that are not empty
    const abandonedCarts = await Cart.find({
      updatedAt: { $lt: oneHourAgo },
      "products.0": { $exists: true }
    }).populate("userId");

    for (const cart of abandonedCarts) {
      const user = cart.userId;
      if (user && user.email) {
        // Here we could also check if a recovery email was already sent recently
        // For simplicity, we just send it
        await sendAbandonedCartEmail(user.email, user.name, cart.products.length);
        console.log(`Sent abandoned cart recovery email to ${user.email}`);
      }
    }
  } catch (error) {
    console.error("Error in abandoned cart recovery:", error);
  }
};

// Start the periodic check every hour
const startAbandonedCartRecovery = () => {
  setInterval(runAbandonedCartCheck, 60 * 60 * 1000);
};

module.exports = { startAbandonedCartRecovery };

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, ArrowRight } from "lucide-react";

const CartDrawer = ({ isOpen, onClose }) => {
  const [cart, setCart] = useState({ products: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const loadCart = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const response = await api.get(`/cart/${userId}`);
      setCart(response.data?.cart || { products: [] });
    } catch (err) {
      console.error("Cart Drawer Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCart();
    }
  }, [isOpen]);

  // Listen for cart updates from other components
  useEffect(() => {
    const handleUpdate = () => loadCart();
    window.addEventListener("cartUpdate", handleUpdate);
    return () => window.removeEventListener("cartUpdate", handleUpdate);
  }, []);

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) {
      await removeItem(productId);
      return;
    }
    try {
      await api.post("/cart/update", { userId, productId, quantity });
      loadCart();
      window.dispatchEvent(new Event("cartUpdate"));
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.post("/cart/remove", { userId, productId });
      loadCart();
      window.dispatchEvent(new Event("cartUpdate"));
    } catch (err) {
      console.error(err);
    }
  };

  const total = cart.products.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
    0
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-black" />
                <h2 className="text-sm font-black uppercase tracking-widest">Shopping Bag ({cart.products.length})</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {!userId ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <p className="text-sm font-medium text-gray-500">Please login to view your bag.</p>
                  <button onClick={() => { onClose(); navigate("/login"); }} className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1">Login Now</button>
                </div>
              ) : cart.products.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-2xl">🛍️</div>
                  <p className="text-sm font-medium text-gray-500">Your bag is currently empty.</p>
                  <button onClick={onClose} className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1">Continue Browsing</button>
                </div>
              ) : (
                cart.products.map((item) => (
                  <div key={item._id} className="flex gap-4 group">
                    <div className="w-20 h-24 bg-gray-50 rounded-sm overflow-hidden border border-gray-100">
                      <img src={item.productId?.image} alt={item.productId?.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col py-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-xs font-bold text-black line-clamp-2">{item.productId?.title}</h3>
                        <button onClick={() => removeItem(item.productId?._id)} className="text-gray-300 hover:text-black transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-3">{item.productId?.category}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-gray-100 rounded-sm">
                          <button onClick={() => updateQuantity(item.productId?._id, item.quantity - 1)} className="p-1 px-2 hover:bg-gray-50"><Minus size={10} /></button>
                          <span className="text-[10px] font-bold w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.productId?._id, item.quantity + 1)} className="p-1 px-2 hover:bg-gray-50"><Plus size={10} /></button>
                        </div>
                        <span className="text-xs font-black">₹{(item.productId?.price * item.quantity).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.products.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-black/40">Subtotal</span>
                  <span className="text-xl font-bold">₹{total.toLocaleString("en-IN")}</span>
                </div>
                <button
                  onClick={() => { onClose(); navigate("/cart"); }}
                  className="w-full bg-black text-white py-4 rounded-sm text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 group transition-all hover:bg-(--staky-green)"
                >
                  Checkout Process
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </button>
                <p className="text-[9px] text-center mt-4 text-gray-400 font-bold uppercase tracking-widest">Shipping & Taxes calculated at next step</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;

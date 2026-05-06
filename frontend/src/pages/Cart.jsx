import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Cart = () => {
  const [cart, setCart] = useState({ products: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const navigate = useNavigate();

  const loadCart = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setCart({ products: [] });
      setLoading(false);
      setError("");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/cart/${userId}`);
      setCart(response.data?.cart || { products: [] });
    } catch (err) {
      if (err.response?.status === 404) {
        setCart({ products: [] });
        setError("");
      } else {
        console.error(err);
        setError("Unable to load cart right now.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const removeItem = async (productId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      await api.post("/cart/remove", { userId, productId });
      await loadCart();
      window.dispatchEvent(new Event("cartUpdate"));
    } catch (err) {
      setError("Unable to remove item.");
    }
  };

  const updateQuantity = async (productId, quantity, stock) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    if (quantity > stock) {
      setError(`Only ${stock} units available in stock.`);
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (quantity < 1) {
      await removeItem(productId);
      return;
    }

    try {
      await api.post("/cart/update", { userId, productId, quantity });
      await loadCart();
      window.dispatchEvent(new Event("cartUpdate"));
    } catch (err) {
      setError("Unable to update quantity.");
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponError("");
    setValidatingCoupon(true);

    try {
      const response = await api.post("/coupon/validate", {
        code: couponCode,
        orderAmount: total,
      });
      setAppliedCoupon(response.data);
      localStorage.setItem("appliedCoupon", JSON.stringify(response.data));
    } catch (err) {
      setCouponError(err.response?.data?.message || "Invalid coupon code");
      setAppliedCoupon(null);
      localStorage.removeItem("appliedCoupon");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const products = cart?.products || [];
  const total = products.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
    0,
  );
  const tax = Math.round(total * 0.18);
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = total + tax - discountAmount;
  const userId = localStorage.getItem("userId");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--color-background-primary)">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-(--midnight) border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--color-background-secondary) py-12 px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        
        {/* Header Section */}
        <div className="mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-(--color-text-tertiary) mb-2">Shopping Bag</p>
          <div className="flex items-end justify-between">
            <h1 className="text-4xl font-bold tracking-tight text-(--midnight)">
              Order Review
            </h1>
            <p className="text-sm font-medium text-(--color-text-secondary)">
              {products.length} {products.length === 1 ? 'item' : 'items'} in total
            </p>
          </div>
        </div>

        {!userId ? (
          <div className="bg-white border border-(--color-border-tertiary) rounded-(--border-radius-xl) p-20 text-center shadow-sm">
            <p className="text-4xl mb-6">🔒</p>
            <h2 className="text-2xl font-bold text-(--midnight)">Privacy & Access</h2>
            <p className="mt-4 text-(--color-text-secondary) max-w-sm mx-auto font-medium">Please authenticate your account to view and manage your shopping bag.</p>
            <button 
              onClick={() => navigate('/login')} 
              className="mt-10 bg-(--midnight) text-white px-10 py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all hover:opacity-90 shadow-xl shadow-black/5"
            >
              Log In to Proceed
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white border border-(--color-border-tertiary) rounded-(--border-radius-xl) p-20 text-center shadow-sm">
            <p className="text-4xl mb-6">🛍️</p>
            <h2 className="text-2xl font-bold text-(--midnight)">Your bag is empty</h2>
            <p className="mt-4 text-(--color-text-secondary) max-w-sm mx-auto font-medium">Explore our curated collection and find something that speaks to your style.</p>
            <button 
              onClick={() => navigate('/')} 
              className="mt-10 bg-(--midnight) text-white px-10 py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all hover:opacity-90 shadow-xl shadow-black/5"
            >
              Browse Shop
            </button>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1fr_400px] items-start">
            
            {/* Cart Items Column */}
            <div className="space-y-6">
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-100 p-5 text-red-600 text-[11px] font-bold uppercase tracking-widest text-center">
                  {error}
                </div>
              )}
              {products.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-(--color-border-tertiary) rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-8 shadow-sm group hover:border-(--color-border-primary) transition-all"
                >
                  <div className="h-32 w-32 shrink-0 overflow-hidden rounded-xl bg-(--color-background-secondary) border border-(--color-border-tertiary)">
                    <img
                      src={item.productId?.image}
                      alt={item.productId?.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-1">
                      {item.productId?.category}
                    </p>
                    <h2 className="text-lg font-bold text-black truncate mb-2">
                      {item.productId?.title}
                    </h2>
                    <p className="text-sm font-black text-black">
                      ₹{item.productId?.price.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center bg-(--color-background-secondary) border border-(--color-border-tertiary) rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(item.productId?._id, item.quantity - 1, item.productId?.stock)}
                        className="h-10 w-10 text-lg font-light text-(--midnight) hover:bg-white rounded-lg transition-all"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-xs font-bold text-(--midnight)">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId?._id, item.quantity + 1, item.productId?.stock)}
                        className="h-10 w-10 text-lg font-light text-(--midnight) hover:bg-white rounded-lg transition-all"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId?._id)}
                      className="h-10 w-10 flex items-center justify-center text-(--color-text-tertiary) hover:text-(--accent-crimson) transition-colors"
                    >
                      <span className="text-xl">✕</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Column */}
            <div className="sticky top-32 space-y-8">
              
              {/* Promotion Code */}
              <div className="bg-white border border-(--color-border-tertiary) rounded-2xl p-8 shadow-sm">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-(--midnight) mb-6">Promotional Code</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 bg-(--color-background-secondary) border border-(--color-border-tertiary) rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-(--midnight)"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={validatingCoupon || !couponCode}
                    className="bg-(--midnight) text-white rounded-xl px-6 py-3 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30 transition-all hover:opacity-90"
                  >
                    {validatingCoupon ? "Wait" : "Apply"}
                  </button>
                </div>
                {couponError && <p className="mt-3 text-[10px] font-bold text-red-500 uppercase tracking-widest">{couponError}</p>}
                {appliedCoupon && (
                  <div className="mt-6 flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-600 text-lg">✨</span>
                      <div>
                        <p className="text-[9px] font-black uppercase text-emerald-800 tracking-tighter">Coupon Active</p>
                        <p className="text-xs font-bold text-emerald-900">{appliedCoupon.coupon?.code}</p>
                      </div>
                    </div>
                    <button onClick={() => {setAppliedCoupon(null); setCouponCode(""); localStorage.removeItem("appliedCoupon")}} className="text-emerald-900 opacity-40 hover:opacity-100 transition-opacity font-bold">✕</button>
                  </div>
                )}
              </div>

              {/* Cost Calculation */}
              <div className="bg-white border border-(--color-border-tertiary) text-black rounded-2xl p-10 shadow-sm">
                <h3 className="text-[11px] font-black uppercase tracking-[0.25em] mb-10 opacity-40">Order Analysis</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="opacity-60 font-medium">Subtotal</span>
                    <span className="font-bold">₹{total.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="opacity-60 font-medium">Estimated Tax (18%)</span>
                    <span className="font-bold">₹{tax.toLocaleString("en-IN")}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between items-center text-sm text-(--accent-crimson)">
                      <span className="font-medium">Discount Applied</span>
                      <span className="font-bold">− ₹{discountAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm">
                    <span className="opacity-60 font-medium">Shipping</span>
                    <span className="font-bold uppercase tracking-widest text-[10px] bg-black/5 px-3 py-1 rounded-full">Complimentary</span>
                  </div>
                  
                  <div className="pt-8 mt-4 border-t border-black/10 flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-black uppercase tracking-widest opacity-40">Total Value</span>
                      <span className="text-3xl font-bold tracking-tighter">
                        ₹{finalTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-[10px] opacity-40 uppercase tracking-tighter font-medium">All taxes and duties included</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/address')}
                  className="mt-10 w-full bg-black text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:bg-(--staky-green) active:scale-[0.98] shadow-lg shadow-black/10"
                >
                  Proceed to Logistics
                </button>
                <div className="mt-6 flex items-center justify-center gap-2 opacity-30">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Global Express Delivery</span>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default Cart;


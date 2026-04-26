import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await api.get("/wishlist");
      setWishlist(res.data.wishlist || []);
    } catch (err) {
      console.error("Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/remove/${productId}`);
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
    } catch (err) {
      console.error("Failed to remove item");
    }
  };

  const addToCart = async (productId) => {
    const userId = localStorage.getItem("userId");
    try {
      await api.post("/cart/add", { userId, productId });
      window.dispatchEvent(new Event("cartUpdate"));
    } catch (err) {
      console.error("Failed to add to cart");
    }
  };

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
        
        {/* Header */}
        <div className="mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-(--color-text-tertiary) mb-2">Saved Items</p>
          <div className="flex items-end justify-between">
            <h1 className="text-4xl font-bold tracking-tight text-(--midnight)">My Wishlist</h1>
            <p className="text-sm font-medium text-(--color-text-secondary)">
              {wishlist.length} curated {wishlist.length === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white border border-(--color-border-tertiary) rounded-3xl p-24 text-center shadow-sm">
            <p className="text-4xl mb-8">🖤</p>
            <h2 className="text-2xl font-bold text-(--midnight)">Your wishlist is empty</h2>
            <p className="mt-4 text-(--color-text-secondary) font-medium max-w-xs mx-auto">Build your collection by saving items you admire. They'll wait for you here.</p>
            <Link to="/" className="mt-10 inline-block bg-(--midnight) text-white px-12 py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all hover:opacity-90 shadow-xl shadow-black/5">
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((product) => (
              <div key={product._id} className="bg-white border border-(--color-border-tertiary) rounded-2xl p-6 group hover:border-(--color-border-primary) transition-all shadow-sm">
                <div className="aspect-[4/5] overflow-hidden rounded-xl bg-(--color-background-secondary) border border-(--color-border-tertiary) mb-6">
                  <img src={product.image} alt={product.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-(--color-text-tertiary) mb-1">{product.category}</p>
                    <Link to={`/product/${product._id}`}>
                      <h3 className="text-md font-bold text-(--midnight) line-clamp-1 group-hover:text-(--accent-crimson) transition-colors">{product.title}</h3>
                    </Link>
                    <p className="text-sm font-bold text-(--midnight) mt-1">₹{product.price.toLocaleString("en-IN")}</p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => addToCart(product._id)}
                      className="flex-1 bg-(--midnight) text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-black/5 transition-all hover:opacity-90 active:scale-95"
                    >
                      Add to Bag
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="h-10 w-10 flex items-center justify-center rounded-xl border border-(--color-border-tertiary) text-(--color-text-tertiary) hover:text-red-500 hover:border-red-500 transition-all"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Cart = () => {
  const [cart, setCart] = useState({ products: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

    if (!userId) {
      return;
    }

    try {
      await api.post("/cart/remove", { userId, productId });
      await loadCart();
      window.dispatchEvent(new Event("cartUpdate"));
    } catch (err) {
      console.error(err);
      setError("Unable to remove this item right now.");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
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
      console.error(err);
      setError("Unable to update quantity right now.");
    }
  };

  const products = cart?.products || [];
  const total = products.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
    0,
  );
  const userId = localStorage.getItem("userId");

  if (loading) {
    return (
      <div className="theme-page flex min-h-screen items-center justify-center px-4">
        <p className="text-sm text-(--text-muted) sm:text-base">
          Loading cart...
        </p>
      </div>
    );
  }

  return (
    <div className="theme-page min-h-screen">
      <div className="mx-auto max-w-5xl px-3 py-5 sm:px-5 sm:py-8 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-(--text) sm:text-3xl">
              🛒
            </h1>
            <p className="mt-1 text-sm text-(--text-muted)">
              Review your selected products before checkout.
            </p>
          </div>
          <span className="rounded-full bg-(--surface-soft) px-3 py-1 text-xs font-medium text-(--primary) sm:text-sm">
            {products.length} items
          </span>
        </div>

        {error ? (
          <div className="mb-4 rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-red-600 border border-gray-100">
            {error}
          </div>
        ) : null}

        {!userId ? (
          <div className="theme-card rounded-2xl px-5 py-10 text-center">
            <h2 className="text-lg font-semibold text-(--text)">
              Please log in to view your cart
            </h2>
            <p className="mt-2 text-sm text-(--text-muted)">
              Sign in to save products and manage your cart.
            </p>
            <Link
              to="/login"
              className="theme-btn-primary mt-5 inline-flex rounded-xl px-5 py-3 text-sm font-semibold"
            >
              Go to Login
            </Link>
          </div>
        ) : products.length === 0 ? (
          <div className="theme-card rounded-2xl px-5 py-10 text-center">
            <h2 className="text-lg font-semibold text-(--text)">
              Your cart is empty
            </h2>
            <p className="mt-2 text-sm text-(--text-muted)">
              Add some products from the store to see them here.
            </p>
            <Link
              to="/"
              className="theme-btn-primary mt-5 inline-flex rounded-xl px-5 py-3 text-sm font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="space-y-4">
              {products.map((item) => (
                <div
                  key={item.productId?._id || item._id}
                  className="theme-card flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center"
                >
                  <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl bg-(--surface-soft) sm:w-24">
                    <img
                      src={item.productId?.image}
                      alt={item.productId?.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="line-clamp-2 text-base font-semibold text-(--text) sm:text-lg">
                      {item.productId?.title}
                    </h2>
                    <p className="mt-1 text-sm text-(--text-muted)">
                      Rs. {item.productId?.price}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                    <div className="flex items-center rounded-xl border border-(--border) bg-(--surface-soft)">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.productId?._id,
                            item.quantity - 1,
                          )
                        }
                        className="px-3 py-2 text-sm font-semibold text-(--text)"
                      >
                        -
                      </button>
                      <span className="min-w-10 text-center text-sm font-medium text-(--text)">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.productId?._id,
                            item.quantity + 1,
                          )
                        }
                        className="px-3 py-2 text-sm font-semibold text-(--text)"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.productId?._id)}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-gray-100"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="theme-card h-fit rounded-2xl p-5">
              <h2 className="text-lg font-semibold text-(--text)">
                Order Summary
              </h2>
              <div className="mt-4 space-y-3 text-sm text-(--text-muted)">
                <div className="flex items-center justify-between">
                  <span>Items</span>
                  <span>{products.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total</span>
                  <span className="text-base font-semibold text-(--text)">
                    Rs. {total.toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/address')}
                className="theme-btn-primary mt-5 w-full rounded-xl px-4 py-3 text-sm font-semibold"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

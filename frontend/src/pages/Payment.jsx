import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Payment = () => {
  const [cart, setCart] = useState({ products: [] });
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const selectedAddress = location.state?.selectedAddress;
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId || !selectedAddress) {
      navigate("/cart");
      return;
    }

    const loadCart = async () => {
      try {
        const response = await api.get(`/cart/${userId}`);
        setCart(response.data?.cart || { products: [] });
      } catch (err) {
        console.error("Failed to load cart for payment:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [userId, selectedAddress, navigate]);

  const handlePay = () => {
    alert("Payment Successful! Dummy payment flow completed.");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="theme-page flex min-h-screen items-center justify-center">
        <p className="text-(--text-muted)">Loading payment details...</p>
      </div>
    );
  }

  const products = cart.products || [];
  const total = products.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="theme-page min-h-screen py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-(--text)">
          Checkout
        </h1>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Main Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="theme-card rounded-2xl p-6">
              <h2 className="mb-4 text-xl font-semibold text-(--text)">
                Delivery Address
              </h2>
              {selectedAddress ? (
                <div className="min-w-0">
                  <p className="font-semibold">{selectedAddress.fullname}</p>
                  <p className="text-(--text-muted) text-sm mt-1">{selectedAddress.phone}</p>
                  <p className="mt-2 text-sm wrap-break-words">{selectedAddress.adressLine}</p>
                  <p className="text-sm wrap-break-words">
                    {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                  </p>
                </div>
              ) : (
                <p className="text-red-600 text-sm font-medium">No address selected.</p>
              )}
            </div>

            {/* Order Items */}
            <div className="theme-card rounded-2xl p-6">
              <h2 className="mb-4 text-xl font-semibold text-(--text)">
                Order Items ({products.length})
              </h2>
              <div className="space-y-4">
                {products.map((item) => (
                  <div key={item.productId?._id} className="flex gap-4 border-b border-(--border) pb-4 last:border-0 last:pb-0">
                    <img 
                      src={item.productId?.image} 
                      alt={item.productId?.title} 
                      className="h-16 w-16 shrink-0 rounded-lg object-cover bg-(--surface-soft)"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-(--text) line-clamp-1">{item.productId?.title}</p>
                      <p className="text-sm text-(--text-muted)">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold whitespace-nowrap shrink-0">Rs. {item.productId?.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="space-y-6">
            <div className="theme-card rounded-2xl p-6 sticky top-24">
              <h2 className="mb-4 text-xl font-semibold text-(--text)">
                Payment Summary
              </h2>
              
              <div className="space-y-3 text-sm text-(--text-muted) mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs. {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-primary font-medium">Free</span>
                </div>
                <div className="border-t border-(--border) pt-3 mt-3 flex justify-between text-base font-bold text-(--text)">
                  <span>Total</span>
                  <span>Rs. {total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handlePay}
                className="theme-btn-primary w-full rounded-xl px-4 py-3 font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

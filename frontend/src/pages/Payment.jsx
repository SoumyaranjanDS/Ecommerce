import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Payment = () => {
  const [cart, setCart] = useState({ products: [] });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const selectedAddress = location.state?.selectedAddress;
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId || !selectedAddress) {
      navigate("/cart");
      return;
    }

    const coupon = localStorage.getItem("appliedCoupon");
    if (coupon) {
      setAppliedCoupon(JSON.parse(coupon));
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

  const handleConfirmOrder = async () => {
    if (!selectedAddress) return;

    setProcessing(true);
    try {
      const orderResponse = await api.post("/order/create", {
        userId,
        addressId: selectedAddress._id,
        paymentMethod: "cod",
        couponCode: appliedCoupon?.coupon?.code,
        discountAmount: appliedCoupon?.discountAmount,
      });

      if (orderResponse.data?.order) {
        localStorage.removeItem("appliedCoupon");
        navigate("/", { state: { orderPlaced: true } });
      }
    } catch (err) {
      console.error("Failed to create order:", err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--color-background-primary)">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-(--midnight) border-t-transparent"></div>
      </div>
    );
  }

  const products = cart.products || [];
  const subtotal = products.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.18);
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = subtotal + tax - discountAmount;

  return (
    <div className="min-h-screen bg-(--color-background-secondary) py-12 px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-(--color-text-tertiary) mb-2">Checkout Process</p>
          <div className="flex items-end justify-between">
            <h1 className="text-4xl font-bold tracking-tight text-(--midnight)">Final Review</h1>
            <p className="text-sm font-medium text-(--color-text-secondary)">Securely finalize your procurement.</p>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_400px] items-start">
          
          <div className="space-y-10">
            {/* Step 1: Logistics */}
            <div className="bg-white border border-(--color-border-tertiary) rounded-3xl p-10 shadow-sm">
              <div className="flex items-center gap-4 mb-10">
                <span className="h-8 w-8 rounded-full bg-(--midnight) text-white flex items-center justify-center text-xs font-bold">01</span>
                <div>
                  <h2 className="text-lg font-bold text-(--midnight)">Logistic Details</h2>
                  <p className="text-[9px] font-bold text-(--color-text-tertiary) uppercase tracking-widest mt-0.5">Shipping Destination</p>
                </div>
              </div>
              
              <div className="bg-(--color-background-secondary) border border-(--color-border-tertiary) rounded-2xl p-8 relative">
                <div className="space-y-4">
                  <div>
                    <p className="text-lg font-bold text-(--midnight)">{selectedAddress?.fullname}</p>
                    <p className="text-xs font-medium text-(--color-text-tertiary) mt-1">{selectedAddress?.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-(--color-text-secondary) leading-relaxed">{selectedAddress?.adressLine}</p>
                    <p className="text-sm font-bold text-(--midnight)">{selectedAddress?.city}, {selectedAddress?.state} — {selectedAddress?.pincode}</p>
                  </div>
                </div>
                <button onClick={() => navigate('/address')} className="absolute top-8 right-8 text-[10px] font-black uppercase tracking-widest text-(--color-text-tertiary) hover:text-(--midnight) transition-colors border-b border-transparent hover:border-(--midnight)">Change</button>
              </div>
            </div>

            {/* Step 2: Method */}
            <div className="bg-white border border-(--color-border-tertiary) rounded-3xl p-10 shadow-sm">
              <div className="flex items-center gap-4 mb-10">
                <span className="h-8 w-8 rounded-full bg-(--midnight) text-white flex items-center justify-center text-xs font-bold">02</span>
                <div>
                  <h2 className="text-lg font-bold text-(--midnight)">Settlement Method</h2>
                  <p className="text-[9px] font-bold text-(--color-text-tertiary) uppercase tracking-widest mt-0.5">Payment Selection</p>
                </div>
              </div>

              <div className="flex items-center gap-6 p-8 rounded-2xl border-2 border-(--midnight) bg-(--color-background-secondary) relative">
                <div className="h-6 w-6 rounded-full border-4 border-(--midnight) flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-(--midnight)"></div>
                </div>
                <div>
                  <p className="text-sm font-bold text-(--midnight) uppercase tracking-widest">Post-Delivery Settlement (COD)</p>
                  <p className="text-[10px] font-medium text-(--color-text-tertiary) mt-1">Settle the registry value upon physical acquisition.</p>
                </div>
                <span className="absolute top-1/2 -translate-y-1/2 right-8 text-xl opacity-20">💵</span>
              </div>
            </div>

            {/* Step 3: Contents */}
            <div className="bg-white border border-(--color-border-tertiary) rounded-3xl p-10 shadow-sm">
              <div className="flex items-center gap-4 mb-10">
                <span className="h-8 w-8 rounded-full bg-(--midnight) text-white flex items-center justify-center text-xs font-bold">03</span>
                <div>
                  <h2 className="text-lg font-bold text-(--midnight)">Registry Contents</h2>
                  <p className="text-[9px] font-bold text-(--color-text-tertiary) uppercase tracking-widest mt-0.5">Items to be acquired</p>
                </div>
              </div>

              <div className="space-y-6">
                {products.map((item) => (
                  <div key={item.productId?._id} className="flex items-center gap-6 group">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-(--color-background-secondary) border border-(--color-border-tertiary)">
                      <img 
                        src={item.productId?.image} 
                        alt={item.productId?.title} 
                        className="h-full w-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-(--midnight) truncate">{item.productId?.title}</h3>
                      <p className="text-[10px] font-bold text-(--color-text-tertiary) uppercase tracking-widest mt-1">Quantity: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-(--midnight)">₹{(item.productId?.price * item.quantity).toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Order Summary */}
          <div className="sticky top-32">
            <div className="bg-(--midnight) text-white rounded-3xl p-10 shadow-2xl shadow-black/20">
              <h3 className="text-[11px] font-black uppercase tracking-[0.25em] mb-12 opacity-50">Settlement Analysis</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="opacity-40 font-medium">Registry Value</span>
                  <span className="font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="opacity-40 font-medium">Logistic Tax (18%)</span>
                  <span className="font-bold">₹{tax.toLocaleString("en-IN")}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between items-center text-sm text-(--gold-dust)">
                    <span className="font-medium">Applied Promotion</span>
                    <span className="font-bold">− ₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm">
                  <span className="opacity-40 font-medium">Expedited Shipping</span>
                  <span className="font-bold uppercase tracking-widest text-[10px] bg-white/10 px-3 py-1 rounded-full">Complimentary</span>
                </div>
                
                <div className="pt-10 mt-6 border-t border-white/10 flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-40">Final Value</span>
                    <span className="text-3xl font-bold tracking-tighter">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="text-[10px] opacity-30 uppercase tracking-tighter">Authenticated & Secured Transaction</p>
                </div>
              </div>

              <button
                onClick={handleConfirmOrder}
                disabled={processing}
                className="mt-12 w-full bg-white text-(--midnight) py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] transition-all hover:bg-(--silver-mist) active:scale-[0.98] shadow-lg shadow-black/10 flex items-center justify-center gap-3"
              >
                {processing ? (
                  <>
                    <span className="h-4 w-4 border-2 border-(--midnight) border-t-transparent rounded-full animate-spin"></span>
                    Authenticating
                  </>
                ) : (
                  "Finalize Order"
                )}
              </button>
              
              <div className="mt-8 flex flex-col items-center gap-4 opacity-20">
                <div className="h-px w-full bg-white/20"></div>
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-center">Encrypted Settlement Gateway</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Payment;

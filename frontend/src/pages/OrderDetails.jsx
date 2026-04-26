import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await api.get(`/order/details/${id}`);
      setOrder(response.data);
    } catch (err) {
      setError("Order registry retrieval failed.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-100 text-amber-700",
      confirmed: "bg-blue-100 text-blue-700",
      shipped: "bg-purple-100 text-purple-700",
      delivered: "bg-emerald-100 text-emerald-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${styles[status] || "bg-gray-100 text-gray-700"}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--color-background-primary)">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-(--midnight) border-t-transparent"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--color-background-secondary) p-6">
        <div className="bg-white border border-(--color-border-tertiary) rounded-3xl p-12 text-center max-w-md w-full shadow-2xl shadow-black/5">
          <p className="text-3xl mb-6">🔍</p>
          <h2 className="text-xl font-bold text-(--midnight) mb-2">Record Not Found</h2>
          <p className="text-sm text-(--color-text-secondary) font-medium mb-8">{error || "The requested procurement ID does not exist in our registry."}</p>
          <button onClick={() => navigate('/order-history')} className="w-full bg-(--midnight) text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest">Return to Records</button>
        </div>
      </div>
    );
  }

  const subtotal = order.totalPrice + (order.discount || 0);
  const tax = Math.round(order.totalPrice * 0.18);

  return (
    <div className="min-h-screen bg-(--color-background-secondary) py-12 px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-12 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-(--color-text-tertiary) hover:text-(--midnight) transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to History
        </button>

        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-(--accent-crimson) mb-3">Registry Details</p>
            <div className="flex flex-wrap items-center gap-6">
              <h1 className="text-4xl font-bold tracking-tighter text-(--midnight)">ID #{order._id.toUpperCase()}</h1>
              {getStatusBadge(order.status)}
            </div>
          </div>
          <div className="flex items-center gap-8 text-right">
             <div>
               <p className="text-[9px] font-black text-(--color-text-tertiary) uppercase tracking-widest mb-1">Acquisition Date</p>
               <p className="text-sm font-bold text-(--midnight)">{new Date(order.createdAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
             </div>
             <div className="h-10 w-px bg-(--color-border-tertiary)"></div>
             <div>
               <p className="text-[9px] font-black text-(--color-text-tertiary) uppercase tracking-widest mb-1">Settlement</p>
               <p className="text-sm font-bold text-emerald-600 uppercase">{order.paymentStatus}</p>
             </div>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_400px] items-start">
          
          <div className="space-y-10">
            {/* Logistic Point */}
            <div className="bg-white border border-(--color-border-tertiary) rounded-3xl p-10 shadow-sm">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-(--midnight) mb-10 opacity-40">Logistic Point</h2>
              <div className="bg-(--color-background-secondary) border border-(--color-border-tertiary) rounded-2xl p-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-lg font-bold text-(--midnight)">{order.addressId?.fullname}</p>
                    <p className="text-xs font-medium text-(--color-text-tertiary) mt-1">{order.addressId?.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-(--color-text-secondary) leading-relaxed">{order.addressId?.adressLine}</p>
                    <p className="text-sm font-bold text-(--midnight)">{order.addressId?.city}, {order.addressId?.state} — {order.addressId?.pincode}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Procurement Units */}
            <div className="bg-white border border-(--color-border-tertiary) rounded-3xl p-10 shadow-sm">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-(--midnight) mb-10 opacity-40">Procurement Units</h2>
              <div className="space-y-8">
                {order.products.map((item, i) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-(--color-background-secondary) border border-(--color-border-tertiary)">
                      <img 
                        src={item.productId?.image} 
                        alt={item.productId?.title} 
                        className="h-full w-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                      />
                    </div>
                    <div className="flex-1 py-1">
                      <h3 className="text-lg font-bold text-(--midnight) mb-2">{item.productId?.title}</h3>
                      <div className="flex items-center gap-6">
                        <p className="text-[10px] font-bold text-(--color-text-tertiary) uppercase tracking-widest">Qty: {item.quantity}</p>
                        <p className="text-[10px] font-bold text-(--color-text-tertiary) uppercase tracking-widest">Unit: ₹{item.price.toLocaleString()}</p>
                      </div>
                      <p className="text-md font-bold text-(--midnight) mt-6">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Settlement Analysis */}
          <div className="sticky top-32">
            <div className="bg-(--midnight) text-white rounded-3xl p-10 shadow-2xl shadow-black/20">
              <h3 className="text-[11px] font-black uppercase tracking-[0.25em] mb-12 opacity-50">Settlement Analysis</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="opacity-40 font-medium">Gross Registry</span>
                  <span className="font-bold">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="opacity-40 font-medium">Logistic Tax</span>
                  <span className="font-bold">₹{tax.toLocaleString("en-IN")}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between items-center text-sm text-(--gold-dust)">
                    <span className="font-medium">Registry Deduction</span>
                    <span className="font-bold">− ₹{order.discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm">
                  <span className="opacity-40 font-medium">Logistic Mode</span>
                  <span className="font-bold uppercase tracking-widest text-[10px] bg-white/10 px-3 py-1 rounded-full">Complimentary</span>
                </div>
                
                <div className="pt-10 mt-6 border-t border-white/10 flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-40">Final Settlement</span>
                    <span className="text-3xl font-bold tracking-tighter">
                      ₹{order.totalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="text-[10px] opacity-30 uppercase tracking-tighter">Authenticated Transaction Record</p>
                </div>
              </div>

              <div className="mt-12 p-6 rounded-2xl border border-white/10 bg-white/5">
                <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-3">Settlement Path</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider">{order.paymentMethod}</p>
                  <span className="text-xl">💳</span>
                </div>
              </div>
              
              <div className="mt-8 flex flex-col items-center gap-4 opacity-20">
                <div className="h-px w-full bg-white/20"></div>
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-center">Verified Registry Archive</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

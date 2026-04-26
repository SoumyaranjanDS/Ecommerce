import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const response = await api.get(`/order/user/${userId}`);
      setOrders(response.data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Unable to load procurement records.");
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
      <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${styles[status] || "bg-gray-100 text-gray-700"}`}>
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

  return (
    <div className="min-h-screen bg-(--color-background-secondary) py-12 px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        
        {/* Header */}
        <div className="mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-(--color-text-tertiary) mb-2">Registry Logs</p>
          <div className="flex items-end justify-between">
            <h1 className="text-4xl font-bold tracking-tight text-(--midnight)">Procurement History</h1>
            <p className="text-sm font-medium text-(--color-text-secondary)">
              Tracking your curated collection.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-10 p-5 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold uppercase tracking-widest text-center animate-fadeIn">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white border border-(--color-border-tertiary) rounded-3xl p-24 text-center shadow-sm">
            <p className="text-4xl mb-8">📦</p>
            <h2 className="text-2xl font-bold text-(--midnight)">No records found</h2>
            <p className="mt-4 text-(--color-text-secondary) font-medium max-w-xs mx-auto">You haven't initiated any procurements yet. Your acquisition history will appear here.</p>
            <button onClick={() => navigate('/')} className="mt-10 inline-block bg-(--midnight) text-white px-12 py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-black/5 transition-all hover:opacity-90">
              Begin Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-(--color-border-tertiary) rounded-2xl p-8 shadow-sm hover:border-(--color-border-primary) transition-all group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold text-(--color-text-tertiary) uppercase tracking-widest">ID #{order._id.slice(-8).toUpperCase()}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-(--midnight)">Logged on {new Date(order.createdAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      <p className="text-[10px] font-bold text-(--color-text-tertiary) uppercase tracking-widest mt-1">{order.products.length} curated units</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-12">
                    <div className="text-right">
                      <p className="text-[9px] font-black text-(--color-text-tertiary) uppercase tracking-widest mb-1">Acquisition Value</p>
                      <p className="text-xl font-bold text-(--midnight)">₹{order.totalPrice.toLocaleString("en-IN")}</p>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="h-14 w-14 rounded-xl border border-(--color-border-tertiary) flex items-center justify-center text-(--midnight) hover:border-(--midnight) transition-all group-hover:bg-(--midnight) group-hover:text-white"
                    >
                      →
                    </button>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-(--color-border-tertiary) flex items-center gap-4">
                   <div className="flex -space-x-4 overflow-hidden">
                      {order.products.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="inline-block h-10 w-10 rounded-full ring-4 ring-white overflow-hidden bg-(--color-background-secondary) border border-(--color-border-tertiary)">
                          <img src={item.productId?.image} alt="" className="h-full w-full object-cover grayscale opacity-50" />
                        </div>
                      ))}
                      {order.products.length > 3 && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--color-background-secondary) ring-4 ring-white text-[10px] font-bold text-(--color-text-tertiary) border border-(--color-border-tertiary)">
                          +{order.products.length - 3}
                        </div>
                      )}
                   </div>
                   <p className="text-[10px] font-bold text-(--color-text-tertiary) uppercase tracking-widest">
                     {order.products.slice(0, 2).map(p => p.productId?.title).join(", ")}
                     {order.products.length > 2 && " ..."}
                   </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modern Order Details Drawer/Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-fadeIn">
          <div className="bg-white max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-3xl p-10 shadow-2xl relative animate-slideUp">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-8 right-8 h-10 w-10 flex items-center justify-center rounded-full border border-(--color-border-tertiary) text-(--color-text-tertiary) hover:text-(--midnight) hover:border-(--midnight) transition-all"
            >
              ✕
            </button>

            <div className="mb-12">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-(--accent-crimson) mb-2">Detailed Log</p>
              <h2 className="text-3xl font-bold tracking-tight text-(--midnight)">Procurement Analytics</h2>
              <div className="flex items-center gap-4 mt-4">
                <span className="text-[11px] font-bold text-(--color-text-tertiary) uppercase tracking-widest">Registry ID: {selectedOrder._id.toUpperCase()}</span>
                {getStatusBadge(selectedOrder.status)}
              </div>
            </div>

            <div className="grid gap-12 md:grid-cols-2">
              <div className="space-y-10">
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-(--midnight) mb-6 opacity-40">Logistic Point</h3>
                  {selectedOrder.addressId && (
                    <div className="space-y-3">
                      <p className="text-md font-bold text-(--midnight)">{selectedOrder.addressId.fullname}</p>
                      <p className="text-xs font-medium text-(--color-text-secondary) leading-relaxed">
                        {selectedOrder.addressId.adressLine}<br />
                        {selectedOrder.addressId.city}, {selectedOrder.addressId.state} — {selectedOrder.addressId.pincode}
                      </p>
                      <p className="text-xs font-bold text-(--midnight) pt-2">Contact: {selectedOrder.addressId.phone}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-(--midnight) mb-6 opacity-40">Registry Metadata</h3>
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[9px] font-black text-(--color-text-tertiary) uppercase tracking-widest mb-1">Status</p>
                      <p className="text-sm font-bold text-(--midnight) capitalize">{selectedOrder.status}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-(--color-text-tertiary) uppercase tracking-widest mb-1">Settlement</p>
                      <p className="text-sm font-bold text-emerald-600 capitalize">{selectedOrder.paymentStatus}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-(--color-text-tertiary) uppercase tracking-widest mb-1">Method</p>
                      <p className="text-sm font-bold text-(--midnight) uppercase tracking-wider">{selectedOrder.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-(--color-text-tertiary) uppercase tracking-widest mb-1">Timestamp</p>
                      <p className="text-sm font-bold text-(--midnight)">{new Date(selectedOrder.createdAt).toLocaleDateString("en-GB")}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-black uppercase tracking-widest text-(--midnight) mb-6 opacity-40">Acquisition Details</h3>
                <div className="space-y-5 bg-(--color-background-secondary) rounded-2xl p-6 border border-(--color-border-tertiary)">
                  {selectedOrder.products.map((product) => (
                    <div key={product._id} className="flex gap-4 items-center">
                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-white border border-(--color-border-tertiary) shrink-0">
                        <img src={product.productId?.image} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-(--midnight) truncate">{product.productId?.title}</p>
                        <p className="text-[9px] font-medium text-(--color-text-tertiary) uppercase tracking-widest">₹{product.price.toLocaleString()} × {product.quantity}</p>
                      </div>
                      <p className="text-xs font-bold text-(--midnight)">₹{(product.price * product.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                  <div className="pt-5 mt-5 border-t border-(--color-border-tertiary) flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-40">Final Value</span>
                    <span className="text-xl font-bold text-(--midnight)">₹{selectedOrder.totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-(--midnight) text-white px-10 py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:opacity-90 transition-all"
              >
                Acknowledge Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;

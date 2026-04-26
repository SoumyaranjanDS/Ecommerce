import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfile();
    fetchOrders();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/user/profile/profile");
      setUser(response.data);
      setFormData({ name: response.data.name, email: response.data.email });
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
      const response = await api.get(`/order/user/${userId}`);
      setOrders(response.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.put("/user/profile/profile", formData);
      setSuccess("Profile successfully updated");
      setEditing(false);
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await api.post("/user/profile/change-password", {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess("Security credentials updated");
      setChangingPassword(false);
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update security");
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
      <div className="mx-auto max-w-5xl">
        
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
          <div className="flex items-center gap-8">
            <div className="h-28 w-28 rounded-3xl bg-(--midnight) text-white flex items-center justify-center text-4xl font-bold shadow-2xl shadow-black/10 border border-white/10 ring-8 ring-black/5">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-(--accent-crimson) mb-2">Member Account</p>
              <h1 className="text-4xl font-bold tracking-tight text-(--midnight)">{user?.name}</h1>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-[10px] font-bold text-(--color-text-tertiary) uppercase tracking-widest bg-black/5 px-3 py-1 rounded-full">{user?.role}</span>
                <span className="text-[10px] font-bold text-(--color-text-tertiary) uppercase tracking-widest">ID: #{user?._id?.slice(-8)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl border border-(--color-border-tertiary)">
            <button
              onClick={() => setActiveTab("info")}
              className={`px-8 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${
                activeTab === "info" ? "bg-(--midnight) text-white shadow-xl shadow-black/5" : "text-(--color-text-tertiary) hover:text-(--midnight)"
              }`}
            >
              Account Info
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-8 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${
                activeTab === "orders" ? "bg-(--midnight) text-white shadow-xl shadow-black/5" : "text-(--color-text-tertiary) hover:text-(--midnight)"
              }`}
            >
              Order History
            </button>
          </div>
        </div>

        {/* Notifications */}
        {(error || success) && (
          <div className={`mb-10 p-5 rounded-2xl border flex items-center gap-4 transition-all animate-fadeIn ${
            error ? "bg-red-50 border-red-100 text-red-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"
          }`}>
            <span className="text-lg">{error ? "⚠️" : "✨"}</span>
            <p className="text-[11px] font-bold uppercase tracking-widest">{error || success}</p>
          </div>
        )}

        {activeTab === "info" && (
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            
            {/* Personal Details Column */}
            <div className="bg-white border border-(--color-border-tertiary) rounded-3xl p-10 shadow-sm">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-xl font-bold text-(--midnight)">Identity & Access</h2>
                  <p className="text-[10px] font-bold text-(--color-text-tertiary) uppercase tracking-widest mt-1">Personal profile management</p>
                </div>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="h-10 w-10 flex items-center justify-center rounded-xl border border-(--color-border-tertiary) text-(--midnight) hover:border-(--midnight) transition-all"
                  >
                    ✎
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-8">
                  <div className="grid gap-8 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-(--color-text-tertiary) ml-1">Full Identity</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-(--color-background-secondary) border border-(--color-border-tertiary) rounded-xl px-5 py-3.5 text-xs font-bold focus:outline-none focus:border-(--midnight)"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-(--color-text-tertiary) ml-1">Digital Mail</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-(--color-background-secondary) border border-(--color-border-tertiary) rounded-xl px-5 py-3.5 text-xs font-bold focus:outline-none focus:border-(--midnight)"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button type="submit" className="bg-(--midnight) text-white px-10 py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-xl shadow-black/10 transition-all hover:opacity-90">Update Registry</button>
                    <button type="button" onClick={() => setEditing(false)} className="px-10 py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest text-(--color-text-tertiary) hover:text-(--midnight)">Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="grid gap-12 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-(--color-text-tertiary)">Legal Name</p>
                    <p className="text-lg font-bold text-(--midnight)">{user?.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-(--color-text-tertiary)">Email Address</p>
                    <p className="text-lg font-bold text-(--midnight)">{user?.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-(--color-text-tertiary)">Member Since</p>
                    <p className="text-lg font-bold text-(--midnight)">{new Date(user?.createdAt).toLocaleDateString("en-GB", { month: 'long', year: 'numeric' })}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-(--color-text-tertiary)">Account Status</p>
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-lg mt-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Verified
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Security Column */}
            <div className="bg-(--midnight) text-white border border-white/5 rounded-3xl p-10 shadow-2xl shadow-black/20">
              <div className="mb-10">
                <h2 className="text-xl font-bold">Security & Keys</h2>
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">Cryptographic updates</p>
              </div>

              {!changingPassword ? (
                <div className="space-y-8">
                  <p className="text-xs opacity-50 leading-relaxed font-medium">Protect your account with a secure, unique password. We recommend updating your credentials every 90 days.</p>
                  <button
                    onClick={() => setChangingPassword(true)}
                    className="w-full bg-white text-(--midnight) py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-(--silver-mist) active:scale-[0.98]"
                  >
                    Change Access Key
                  </button>
                </div>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-5">
                  <input
                    type="password"
                    name="oldPassword"
                    placeholder="Existing Password"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-xs font-bold focus:outline-none focus:border-white/40"
                    required
                  />
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New Secure Key"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-xs font-bold focus:outline-none focus:border-white/40"
                    required
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Verify New Key"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-xs font-bold focus:outline-none focus:border-white/40"
                    required
                  />
                  <div className="flex flex-col gap-3 pt-4">
                    <button type="submit" className="bg-white text-(--midnight) py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-(--silver-mist)">Update Key</button>
                    <button type="button" onClick={() => setChangingPassword(false)} className="py-4 text-[10px] font-bold opacity-40 hover:opacity-100 transition-all uppercase tracking-widest">Discard Changes</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="bg-white border border-(--color-border-tertiary) rounded-3xl p-10 shadow-sm">
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-(--midnight)">Procurement History</h2>
              <p className="text-[10px] font-bold text-(--color-text-tertiary) uppercase tracking-widest mt-1">Review your historical acquisitions</p>
            </div>

            {orders.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-4xl mb-6">📦</p>
                <h3 className="text-xl font-bold text-(--midnight)">No history found</h3>
                <p className="mt-4 text-(--color-text-secondary) font-medium max-w-xs mx-auto">You haven't initiated any procurements yet. Explore the shop to start your collection.</p>
                <button onClick={() => navigate('/')} className="mt-10 bg-(--midnight) text-white px-10 py-4 rounded-xl text-[11px] font-bold uppercase tracking-widest">Start Procurement</button>
              </div>
            ) : (
              <div className="divide-y divide-(--color-border-tertiary)">
                {orders.map((order) => (
                  <div key={order._id} className="py-8 first:pt-0 last:pb-0 group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                      <div className="flex items-center gap-6">
                        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-xl shadow-inner ${
                          order.status === 'delivered' ? 'bg-emerald-50 text-emerald-500' :
                          order.status === 'cancelled' ? 'bg-red-50 text-red-500' :
                          'bg-amber-50 text-amber-500'
                        }`}>
                          {order.status === 'delivered' ? '✓' : order.status === 'cancelled' ? '✕' : '◈'}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                             <span className="text-sm font-bold text-(--midnight)">Order #{order._id.slice(-6).toUpperCase()}</span>
                             <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                              order.status === 'delivered' ? 'bg-emerald-500 text-white' :
                              order.status === 'cancelled' ? 'bg-red-500 text-white' :
                              'bg-amber-500 text-white'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-[10px] font-bold text-(--color-text-tertiary) uppercase tracking-widest">Logged on {new Date(order.createdAt).toLocaleDateString("en-GB")}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-16">
                        <div className="text-right hidden sm:block">
                          <p className="text-[9px] font-black text-(--color-text-tertiary) uppercase tracking-widest mb-1">Items</p>
                          <p className="text-sm font-bold text-(--midnight)">{order.products.length} Units</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-(--color-text-tertiary) uppercase tracking-widest mb-1">Acquisition Value</p>
                          <p className="text-lg font-bold text-(--midnight)">₹{order.totalPrice.toLocaleString("en-IN")}</p>
                        </div>
                        <button 
                          onClick={() => navigate(`/order-details/${order._id}`)}
                          className="h-12 w-12 rounded-xl border border-(--color-border-tertiary) flex items-center justify-center text-(--midnight) hover:border-(--midnight) transition-all"
                        >
                          →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default Profile;

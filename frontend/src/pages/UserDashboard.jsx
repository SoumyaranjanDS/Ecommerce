import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

// ── Tier config ──────────────────────────────────────────────────────────────
const TIER_CONFIG = {
  platinum: { bg: "var(--midnight)", accent: "var(--silver-mist)", label: "var(--color-text-tertiary)", icon: "◈" },
  gold:     { bg: "#1C1200", accent: "var(--gold-dust)", label: "#F59E0B", icon: "◆" },
  silver:   { bg: "#111318", accent: "var(--silver-mist)", label: "var(--color-text-tertiary)", icon: "◇" },
  bronze:   { bg: "var(--midnight)", accent: "var(--accent-crimson)", label: "var(--color-text-tertiary)", icon: "○" },
};

// ── Sub-components ───────────────────────────────────────────────────────────
const StatusPill = ({ status }) => {
  const map = {
    delivered:  { bg: "#052e16", color: "#4ade80", label: "Delivered" },
    cancelled:  { bg: "#2d0a0a", color: "#f87171", label: "Cancelled" },
    processing: { bg: "#1c1400", color: "#fbbf24", label: "Processing" },
    shipped:    { bg: "#0a1628", color: "#60a5fa", label: "Shipped" },
    pending:    { bg: "#1a100a", color: "#fb923c", label: "Pending" },
  };
  const s = map[status] || map.pending;
  return (
    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase"
      style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
};

const StatCard = ({ label, value, accent }) => (
  <div className="bg-(--color-background-primary) border border-(--color-border-tertiary) rounded-(--border-radius-lg) p-5 flex flex-col gap-1 shadow-sm transition-all hover:border-(--color-border-primary)">
    <span className="text-[11px] font-black uppercase tracking-wider text-(--color-text-tertiary)">
      {label}
    </span>
    <span className="text-3xl font-bold tracking-tight" style={{ color: accent || "var(--color-text-primary)" }}>
      {value}
    </span>
  </div>
);

const SectionHeading = ({ title, action, onAction }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-sm font-bold text-(--color-text-primary) uppercase tracking-wider">{title}</h2>
    {action && (
      <button
        onClick={onAction}
        className="text-[11px] font-black text-(--color-text-secondary) hover:text-(--color-text-primary) transition-colors uppercase tracking-widest"
      >
        {action} →
      </button>
    )}
  </div>
);

const EmptyState = ({ message, action, onAction }) => (
  <div className="bg-(--color-background-secondary) border border-dashed border-(--color-border-secondary) rounded-(--border-radius-lg) py-10 px-6 text-center">
    <p className="text-sm text-(--color-text-tertiary) mb-3 font-medium">{message}</p>
    {action && (
      <button onClick={onAction} className="text-xs font-bold text-(--color-text-primary) hover:underline">
        {action} →
      </button>
    )}
  </div>
);

// ── Main component ───────────────────────────────────────────────────────────
const UserDashboard = () => {
  const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, reviews: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) { navigate("/login"); return; }
    fetchDashboardData();
  }, [userId]);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, ordersRes, addressRes] = await Promise.all([
        api.get("/user/profile/profile"),
        api.get(`/order/user/${userId}`),
        api.get(`/user/address/get/${userId}`),
      ]);
      const profile = profileRes.data;
      const ordersData = ordersRes.data || {};
      const allOrders = ordersData.orders || [];
      const userAddresses = addressRes.data || [];
      setUser(profile);
      setRecentOrders(allOrders.slice(0, 3));
      setAddresses(userAddresses.slice(0, 2));
      setStats({
        totalOrders: ordersData.totalOrders || allOrders.length,
        pendingOrders: allOrders.filter(o => o.status !== "delivered" && o.status !== "cancelled").length,
        reviews: 0,
      });
      try {
        const reviewsRes = await api.get(`/review/user`);
        setStats(prev => ({ ...prev, reviews: reviewsRes.data?.length || 0 }));
      } catch (_) {}
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(user?.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tier = (user?.loyaltyTier || "bronze").toLowerCase();
  const tierCfg = TIER_CONFIG[tier] || TIER_CONFIG.bronze;

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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
          <div className="flex items-center gap-8">
            <div className="h-20 w-20 rounded-[32px] bg-white border border-(--color-border-tertiary) flex items-center justify-center text-2xl font-bold text-(--midnight) shadow-sm">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-(--accent-crimson) mb-3">
                Member Overview
              </p>
              <h1 className="text-4xl font-bold tracking-tighter text-(--midnight)">
                Welcome back, {user?.name?.split(' ')[0]}
              </h1>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/profile")}
              className="h-14 px-8 border border-(--color-border-tertiary) rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-(--midnight) hover:bg-(--midnight) hover:text-white transition-all flex items-center justify-center"
            >
              Registry Settings
            </button>
            <button
              onClick={() => navigate("/")}
              className="h-14 px-8 bg-(--midnight) text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10 transition-all hover:opacity-90 flex items-center justify-center"
            >
              Curation Archive
            </button>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-(--color-border-tertiary) rounded-[32px] p-8 shadow-sm">
            <p className="text-[9px] font-black uppercase tracking-widest text-(--color-text-tertiary) mb-4">Total Procurement</p>
            <p className="text-4xl font-bold tracking-tighter text-(--midnight)">{stats.totalOrders}</p>
          </div>
          <div className="bg-white border border-(--color-border-tertiary) rounded-[32px] p-8 shadow-sm">
            <p className="text-[9px] font-black uppercase tracking-widest text-(--color-text-tertiary) mb-4">In Transit</p>
            <p className="text-4xl font-bold tracking-tighter text-(--midnight)">{stats.pendingOrders}</p>
          </div>
          <div className="bg-white border border-(--color-border-tertiary) rounded-[32px] p-8 shadow-sm">
            <p className="text-[9px] font-black uppercase tracking-widest text-(--color-text-tertiary) mb-4">Registered Critiques</p>
            <p className="text-4xl font-bold tracking-tighter text-(--midnight)">{stats.reviews}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
          
          <div className="space-y-12">
            {/* Loyalty & Referral */}
            <div className="grid gap-6">
              <div 
                className="rounded-[40px] p-10 flex flex-col justify-between min-h-[300px] shadow-2xl relative overflow-hidden group transition-all"
                style={{ background: tierCfg.bg, border: `1px solid ${tierCfg.accent}15` }}
              >
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-60" style={{ color: tierCfg.label }}>Tier Identity</p>
                  <p className="text-6xl font-bold tracking-tighter uppercase" style={{ color: tierCfg.accent }}>{tier}</p>
                </div>
                
                <div className="relative z-10 flex items-end justify-between">
                  <div>
                    <p className="text-5xl font-bold tracking-tighter mb-2" style={{ color: tierCfg.accent }}>{user?.loyaltyPoints?.toLocaleString()}</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60" style={{ color: tierCfg.label }}>Loyalty Index</p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: tierCfg.label }}>Certified Member</span>
                </div>
                <div className="absolute top-0 right-0 p-12 text-7xl opacity-10 group-hover:scale-110 transition-transform duration-1000" style={{ color: tierCfg.accent }}>{tierCfg.icon}</div>
              </div>

              <div className="bg-white border border-(--color-border-tertiary) rounded-[40px] p-10 shadow-sm flex flex-col justify-between gap-10">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-(--accent-crimson) mb-4">Strategic Growth</p>
                  <h3 className="text-2xl font-bold tracking-tight text-(--midnight) mb-4">Referral Network</h3>
                  <p className="text-sm text-(--color-text-secondary) leading-relaxed">Expand the curation network. Refer associates to receive 200 index points, granting them ₹100 initial credit.</p>
                </div>
                <div className="flex items-center justify-between bg-(--color-background-secondary) border border-(--color-border-tertiary) rounded-2xl p-2 pl-6">
                  <span className="text-xs font-bold tracking-[0.3em] text-(--midnight) font-mono uppercase">{user?.referralCode || "PENDING"}</span>
                  <button onClick={handleCopy} className={`h-12 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${copied ? "bg-emerald-500 text-white" : "bg-(--midnight) text-white hover:opacity-90"}`}>
                    {copied ? "Synchronized" : "Copy Code"}
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-(--color-text-tertiary)">Procurement History</h2>
                <button onClick={() => navigate("/profile")} className="text-[10px] font-black uppercase tracking-[0.2em] text-(--midnight) hover:translate-x-1 transition-transform">Complete Archive →</button>
              </div>
              
              {recentOrders.length === 0 ? (
                <div className="p-16 text-center bg-(--color-background-secondary) rounded-[40px] border border-dashed border-(--color-border-tertiary)">
                  <p className="text-[10px] font-bold text-(--color-text-tertiary) uppercase tracking-[0.2em]">No procurement cycles recorded.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order._id}
                      onClick={() => navigate(`/order-details/${order._id}`)}
                      className="bg-white border border-(--color-border-tertiary) rounded-3xl p-6 flex items-center justify-between cursor-pointer hover:border-(--midnight) transition-all group"
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-4">
                          <StatusPill status={order.status} />
                          <span className="text-[10px] font-bold text-(--color-text-tertiary) font-mono uppercase">#{order._id.slice(-8).toUpperCase()}</span>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-(--color-text-tertiary)">{new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-(--midnight)">₹{order.totalPrice.toLocaleString()}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest text-(--color-text-tertiary) group-hover:text-(--midnight) transition-colors mt-1">View Analytics</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-12">
             {/* Addresses */}
             <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-(--color-text-tertiary)">Logistic Registry</h2>
                <button onClick={() => navigate("/address")} className="text-[10px] font-black uppercase tracking-[0.2em] text-(--midnight) hover:translate-x-1 transition-transform">Registry →</button>
              </div>
              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <div className="p-10 text-center bg-(--color-background-secondary) rounded-3xl border border-dashed border-(--color-border-tertiary)">
                    <p className="text-[9px] font-bold text-(--color-text-tertiary) uppercase tracking-widest">No logistics registered.</p>
                  </div>
                ) : (
                  addresses.map((addr) => (
                    <div key={addr._id} className="bg-white border border-(--color-border-tertiary) rounded-3xl p-6">
                      <p className="font-bold text-sm text-(--midnight) mb-2">{addr.fullname}</p>
                      <p className="text-xs text-(--color-text-secondary) leading-relaxed mb-4">{addr.addressLine}, {addr.city}</p>
                      <p className="text-[9px] font-bold text-(--color-text-tertiary) uppercase tracking-[0.2em]">Verified Logistic Point</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-(--color-text-tertiary) mb-8">Control Deck</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Collection", sub: "View Registry", onClick: () => navigate("/cart"), icon: "🛒" },
                  { label: "Curation", sub: "New Arrivals", onClick: () => navigate("/"), icon: "✨" },
                  { label: "Tracking", sub: "Parcel Logistics", onClick: () => navigate("/profile"), icon: "📦" },
                  { label: "Assistance", sub: "Strategic Support", onClick: () => {}, icon: "💬" },
                ].map((action) => (
                  <button
                    key={action.label}
                    onClick={action.onClick}
                    className="bg-white border border-(--color-border-tertiary) rounded-3xl p-6 text-left transition-all hover:bg-(--color-background-secondary) hover:border-(--midnight) group"
                  >
                    <span className="block text-2xl mb-4 group-hover:scale-110 transition-transform">{action.icon}</span>
                    <p className="text-xs font-bold text-(--midnight) mb-1">{action.label}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-(--color-text-tertiary)">{action.sub}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

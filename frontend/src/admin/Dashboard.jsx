import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [orderFilter, setOrderFilter] = useState("");
  const [error, setError] = useState("");
  
  // Pagination State
  const [orderPage, setOrderPage] = useState(1);
  const [orderTotalPages, setOrderTotalPages] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const navigate = useNavigate();

  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    if (userRole !== "admin") {
      navigate("/");
      return;
    }
    fetchDashboardData();
  }, [userRole]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, salesRes] = await Promise.all([
        api.get("/admin/dashboard/stats"),
        api.get("/admin/dashboard/sales"),
      ]);
      setStats(statsRes.data);
      setSalesData(salesRes.data);
      await Promise.all([fetchOrders(1), fetchUsers(1)]);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Strategic data retrieval failure.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (pageNum = 1) => {
    try {
      const res = await api.get(`/order/all?page=${pageNum}&limit=10`);
      setOrders(res.data.orders || []);
      setOrderTotalPages(res.data.pages || 1);
      setOrderPage(pageNum);
    } catch (err) {
      console.error("Failed to fetch orders");
    }
  };

  const fetchUsers = async (pageNum = 1) => {
    try {
      const res = await api.get(`/user/profile?page=${pageNum}&limit=12`);
      setUsers(res.data.users || []);
      setUserTotalPages(res.data.pages || 1);
      setUserPage(pageNum);
    } catch (err) {
      console.error("Failed to fetch users");
    }
  };

  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      await api.put(`/order/update/${selectedOrder._id}`, {
        status: newStatus,
      });

      setSelectedOrder(null);
      setNewStatus("");
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || "Registry update failed.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Terminate this user registry permanently?")) return;
    try {
      await api.delete(`/user/profile/${userId}`);
      fetchDashboardData();
    } catch (err) {
      setError("User termination failed.");
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await api.put(`/user/profile/role/${userId}`, { role: newRole });
      fetchDashboardData();
    } catch (err) {
      setError("Authorization update failed.");
    }
  };

  const filteredOrders = orderFilter 
    ? orders.filter(o => o.status === orderFilter)
    : orders;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--color-background-primary)">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-(--midnight) border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--color-background-secondary) py-12 px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-(--accent-crimson) mb-3">Administrative Hub</p>
            <h1 className="text-5xl font-bold tracking-tighter text-(--midnight)">Procurement Control</h1>
          </div>
          <div className="flex gap-4">
             <button onClick={() => navigate('/admin/products')} className="h-14 px-8 bg-white border border-(--color-border-tertiary) text-(--midnight) rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:border-(--midnight)">Inventory Archive</button>
             <button onClick={() => navigate('/admin/add-product')} className="h-14 px-8 bg-(--midnight) text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10 transition-all hover:opacity-90">Register Product</button>
          </div>
        </div>

        {error && (
          <div className="mb-10 p-5 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold uppercase tracking-widest text-center animate-fadeIn">
            {error}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-12 flex items-center gap-1 border-b border-(--color-border-tertiary) pb-0">
          {["overview", "orders", "users"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                activeTab === tab
                  ? "text-(--midnight)"
                  : "text-(--color-text-tertiary) hover:text-(--midnight)"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-(--midnight) animate-fadeIn"></div>
              )}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && stats && (
          <div className="space-y-12 animate-fadeIn">
            {/* High-Level Stats */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "User Registry", value: stats.stats.totalUsers, accent: "text-(--midnight)" },
                { label: "Product Units", value: stats.stats.totalProducts, accent: "text-(--midnight)" },
                { label: "Registry Logs", value: stats.stats.totalOrders, accent: "text-(--midnight)" },
                { label: "Net Settlement", value: `₹${stats.stats.totalRevenue.toLocaleString()}`, accent: "text-emerald-600" },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-white border border-(--color-border-tertiary) rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all"
                >
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-(--color-text-tertiary) mb-4">{card.label}</p>
                  <p className={`text-4xl font-bold tracking-tighter ${card.accent}`}>
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
              {/* Revenue Trends */}
              <div className="bg-white border border-(--color-border-tertiary) rounded-[40px] p-10 shadow-sm">
                <div className="flex items-center justify-between mb-12">
                  <h2 className="text-lg font-bold text-(--midnight)">Revenue Analytics</h2>
                  <p className="text-[10px] font-bold text-(--color-text-tertiary) uppercase tracking-widest">Growth Vector</p>
                </div>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={salesData?.salesByMonth?.map(month => ({
                        name: new Date(0, month._id.month - 1).toLocaleString('default', { month: 'short' }),
                        revenue: month.totalSales
                      }))}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 9, fontWeight: 700, fill: '#999'}} 
                        dy={15}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 9, fontWeight: 700, fill: '#999'}}
                        tickFormatter={(value) => `₹${value.toLocaleString()}`}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#000" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Performing Units */}
              <div className="bg-white border border-(--color-border-tertiary) rounded-[40px] p-10 shadow-sm">
                <h2 className="text-lg font-bold text-(--midnight) mb-10">High Velocity Units</h2>
                <div className="space-y-6">
                  {stats.topProducts.map((product, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-(--color-background-secondary) border border-transparent hover:border-(--color-border-tertiary) transition-all">
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-bold text-(--midnight)">
                          {product.productDetails?.[0]?.title || "Unknown Registry"}
                        </p>
                        <p className="text-[10px] font-medium text-(--color-text-tertiary) uppercase tracking-widest mt-1">
                          {product.productDetails?.[0]?.category}
                        </p>
                      </div>
                      <div className="ml-6 text-right">
                        <p className="text-[10px] font-black text-(--midnight) uppercase tracking-widest">{product.count}</p>
                        <p className="text-[8px] font-bold text-(--color-text-tertiary) uppercase tracking-widest">LOGS</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-10 animate-fadeIn">
            <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-(--color-text-tertiary) mr-4">Registry Filter:</span>
              {["", "pending", "confirmed", "shipped", "delivered", "cancelled"].map(status => (
                <button
                  key={status}
                  onClick={() => setOrderFilter(status)}
                  className={`whitespace-nowrap rounded-full px-6 py-2.5 text-[9px] font-black uppercase tracking-widest border transition-all ${
                    orderFilter === status
                      ? "bg-(--midnight) text-white border-(--midnight)"
                      : "bg-white text-(--color-text-tertiary) border-(--color-border-tertiary) hover:border-(--midnight) hover:text-(--midnight)"
                  }`}
                >
                  {status ? status : "ALL LOGS"}
                </button>
              ))}
            </div>

            <div className="grid gap-6">
              {filteredOrders.length === 0 ? (
                <div className="bg-white border border-dashed border-(--color-border-tertiary) rounded-[40px] py-32 text-center">
                  <p className="text-sm font-medium text-(--color-text-tertiary)">No records match current filter parameters.</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white border border-(--color-border-tertiary) rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all group"
                  >
                    <div className="flex flex-col gap-8 md:flex-row md:items-center">
                      <div className="flex-1 space-y-2">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-(--color-text-tertiary)">Registry #{order._id.slice(-8).toUpperCase()}</p>
                        <p className="text-xl font-bold text-(--midnight)">{order.userId?.name || "Terminated Profile"}</p>
                        <p className="text-xs font-medium text-(--color-text-tertiary)">Logged {new Date(order.createdAt).toLocaleString("en-GB")}</p>
                      </div>
                      
                      <div className="flex items-center gap-12">
                        <div className="text-right">
                          <p className="text-[9px] font-black uppercase tracking-widest text-(--color-text-tertiary) mb-1">Settlement</p>
                          <p className="text-xl font-bold text-(--midnight)">₹{order.totalPrice.toLocaleString()}</p>
                        </div>
                        <div className="text-right min-w-[120px]">
                          <p className="text-[9px] font-black uppercase tracking-widest text-(--color-text-tertiary) mb-2">Protocol Status</p>
                          <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' :
                            order.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                            'bg-amber-50 text-amber-600'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setNewStatus(order.status);
                        }}
                        className="h-14 px-8 bg-(--midnight) text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all hover:opacity-90 active:scale-95"
                      >
                        Control
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Order Pagination */}
            {orderTotalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <button
                  onClick={() => fetchOrders(orderPage - 1)}
                  disabled={orderPage === 1}
                  className="px-6 py-2 border border-(--color-border-tertiary) rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:border-(--midnight) transition-all"
                >
                  Prev
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: orderTotalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => fetchOrders(p)}
                      className={`h-10 w-10 flex items-center justify-center rounded-xl text-[10px] font-black transition-all ${
                        orderPage === p ? "bg-(--midnight) text-white" : "text-(--color-text-tertiary) hover:text-(--midnight)"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => fetchOrders(orderPage + 1)}
                  disabled={orderPage === orderTotalPages}
                  className="px-6 py-2 border border-(--color-border-tertiary) rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:border-(--midnight) transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-10 animate-fadeIn">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {users.length === 0 ? (
                <div className="col-span-full bg-white border border-dashed border-(--color-border-tertiary) rounded-[40px] py-32 text-center">
                  <p className="text-sm font-medium text-(--color-text-tertiary)">No profile registries identified.</p>
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user._id}
                    className="bg-white border border-(--color-border-tertiary) rounded-3xl p-10 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-8">
                      <div className="h-16 w-16 rounded-2xl bg-(--color-background-secondary) border border-(--color-border-tertiary) flex items-center justify-center text-2xl font-bold text-(--midnight) group-hover:bg-(--midnight) group-hover:text-white transition-all duration-500">
                        {user.name.charAt(0)}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-gray-50 text-gray-500'}`}>
                        {user.role}
                      </span>
                    </div>
                    
                    <div className="mb-10">
                      <p className="text-lg font-bold text-(--midnight) truncate">{user.name}</p>
                      <p className="text-xs font-medium text-(--color-text-tertiary) truncate mt-1">{user.email}</p>
                      <p className="mt-4 text-[9px] font-black text-(--color-text-tertiary) uppercase tracking-widest">Registered {new Date(user.createdAt).toLocaleDateString("en-GB")}</p>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleToggleRole(user._id, user.role)}
                        className="flex-1 h-12 bg-(--color-background-secondary) text-(--midnight) rounded-xl text-[9px] font-black uppercase tracking-widest transition-all hover:bg-(--midnight) hover:text-white"
                      >
                        Auth Swap
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user._id)}
                        className="h-12 w-12 flex items-center justify-center bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* User Pagination */}
            {userTotalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <button
                  onClick={() => fetchUsers(userPage - 1)}
                  disabled={userPage === 1}
                  className="px-6 py-2 border border-(--color-border-tertiary) rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:border-(--midnight) transition-all"
                >
                  Prev
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: userTotalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => fetchUsers(p)}
                      className={`h-10 w-10 flex items-center justify-center rounded-xl text-[10px] font-black transition-all ${
                        userPage === p ? "bg-(--midnight) text-white" : "text-(--color-text-tertiary) hover:text-(--midnight)"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => fetchUsers(userPage + 1)}
                  disabled={userPage === userTotalPages}
                  className="px-6 py-2 border border-(--color-border-tertiary) rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-20 hover:border-(--midnight) transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-fadeIn">
          <div className="bg-white max-w-md w-full rounded-[40px] p-12 shadow-2xl relative animate-slideUp">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-(--accent-crimson) mb-3">Protocol Update</p>
            <h2 className="text-3xl font-bold tracking-tight text-(--midnight) mb-12">Registry Status</h2>

            <div className="space-y-8 mb-12">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-(--color-text-tertiary) mb-4 ml-1">Select Protocol Segment</p>
                <div className="grid grid-cols-2 gap-3">
                  {["pending", "confirmed", "shipped", "delivered", "cancelled"].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => setNewStatus(status)}
                        className={`h-12 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                          newStatus === status
                            ? "bg-(--midnight) text-white"
                            : "bg-(--color-background-secondary) text-(--color-text-tertiary) hover:text-(--midnight) border border-transparent hover:border-(--color-border-tertiary)"
                        }`}
                      >
                        {status}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleUpdateOrderStatus}
                className="flex-1 h-16 bg-(--midnight) text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10 transition-all hover:opacity-90"
              >
                Execute
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="h-16 px-8 bg-(--color-background-secondary) text-(--midnight) rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:bg-(--color-border-tertiary)"
              >
                Abort
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;


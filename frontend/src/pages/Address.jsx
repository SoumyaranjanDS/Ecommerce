import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchAddresses = async () => {
      try {
        const res = await api.get(`/user/address/get/${userId}`);
        setAddresses(res.data || []);
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
        setError("Unable to load shipping locations.");
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [userId, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    try {
      const res = await api.post("/user/address/save", {
        userId: userId,
        ...formData,
      });

      setSuccessMsg(res.data.message || "Location registry updated");
      setAddresses([...addresses, res.data.address]);
      
      setFormData({
        fullname: "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
      });
    } catch (err) {
      console.error("Failed to save address:", err);
      setError(err.response?.data?.error || "Registry update failed");
    }
  };

  if (!userId) return null;

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
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-(--color-text-tertiary) mb-2">Shipping Logistics</p>
          <div className="flex items-end justify-between">
            <h1 className="text-4xl font-bold tracking-tight text-(--midnight)">Address Registry</h1>
            <p className="text-sm font-medium text-(--color-text-secondary)">
              Manage your delivery destinations.
            </p>
          </div>
        </div>

        {(error || successMsg) && (
          <div className={`mb-10 p-5 rounded-2xl border flex items-center gap-4 animate-fadeIn ${
            error ? "bg-red-50 border-red-100 text-red-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"
          }`}>
            <span className="text-lg">{error ? "⚠️" : "✨"}</span>
            <p className="text-[11px] font-bold uppercase tracking-widest">{error || successMsg}</p>
          </div>
        )}

        <div className="grid gap-12 lg:grid-cols-[1fr_450px] items-start">
          
          {/* Saved Addresses Column */}
          <div className="space-y-8">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-(--midnight) opacity-40">Stored Locations</h2>
            {addresses.length > 0 ? (
              <div className="grid gap-6">
                {addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className="bg-white border border-(--color-border-tertiary) rounded-2xl p-8 shadow-sm hover:border-(--color-border-primary) transition-all group"
                  >
                    <div className="flex flex-col sm:flex-row justify-between gap-8">
                      <div className="space-y-4">
                        <div>
                          <p className="text-lg font-bold text-(--midnight)">{addr.fullname}</p>
                          <p className="text-xs font-medium text-(--color-text-tertiary) mt-1">{addr.phone}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-(--color-text-secondary) leading-relaxed">{addr.addressLine}</p>
                          <p className="text-sm font-bold text-(--midnight)">{addr.city}, {addr.state} — {addr.pincode}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('/payment', { state: { selectedAddress: addr } })}
                        className="h-14 px-8 bg-(--midnight) text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/5 transition-all hover:opacity-90 active:scale-95"
                      >
                        Ship Here
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-dashed border-(--color-border-tertiary) rounded-3xl p-20 text-center">
                <p className="text-3xl mb-4">📍</p>
                <p className="text-sm font-medium text-(--color-text-tertiary)">No shipping locations registered yet.</p>
              </div>
            )}
          </div>

          {/* New Address Form Column */}
          <div className="bg-white border border-(--color-border-tertiary) rounded-3xl p-10 shadow-sm sticky top-32">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-(--midnight) mb-10">Register New Destination</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-(--color-text-tertiary) ml-1">Full Identity</label>
                <input
                  type="text"
                  name="fullname"
                  required
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-(--color-background-secondary) border border-(--color-border-tertiary) rounded-xl px-5 py-3.5 text-xs font-bold focus:outline-none focus:border-(--midnight) transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-(--color-text-tertiary) ml-1">Contact Dial</label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 00000 00000"
                  className="w-full bg-(--color-background-secondary) border border-(--color-border-tertiary) rounded-xl px-5 py-3.5 text-xs font-bold focus:outline-none focus:border-(--midnight) transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-(--color-text-tertiary) ml-1">Logistic Path (Address)</label>
                <input
                  type="text"
                  name="addressLine"
                  required
                  value={formData.addressLine}
                  onChange={handleChange}
                  placeholder="Street, Building, Flat"
                  className="w-full bg-(--color-background-secondary) border border-(--color-border-tertiary) rounded-xl px-5 py-3.5 text-xs font-bold focus:outline-none focus:border-(--midnight) transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-(--color-text-tertiary) ml-1">City Hub</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New Delhi"
                    className="w-full bg-(--color-background-secondary) border border-(--color-border-tertiary) rounded-xl px-5 py-3.5 text-xs font-bold focus:outline-none focus:border-(--midnight) transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-(--color-text-tertiary) ml-1">State Province</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Delhi"
                    className="w-full bg-(--color-background-secondary) border border-(--color-border-tertiary) rounded-xl px-5 py-3.5 text-xs font-bold focus:outline-none focus:border-(--midnight) transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-(--color-text-tertiary) ml-1">Logistic Index (Pincode)</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="000 000"
                  className="w-full bg-(--color-background-secondary) border border-(--color-border-tertiary) rounded-xl px-5 py-3.5 text-xs font-bold focus:outline-none focus:border-(--midnight) transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white border-2 border-black text-black py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/5 transition-all hover:bg-black hover:text-white active:scale-[0.98] mt-4"
              >
                Register Location
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Address;

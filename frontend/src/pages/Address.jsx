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
    adressLine: "",
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
        setAddresses(res.data);
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
        setError("Failed to load addresses.");
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
        userid: userId,
        ...formData,
      });

      setSuccessMsg(res.data.message || "Address saved successfully");
      setAddresses([...addresses, res.data.address]);
      
      // Reset form
      setFormData({
        fullname: "",
        phone: "",
        adressLine: "",
        city: "",
        state: "",
        pincode: "",
      });
    } catch (err) {
      console.error("Failed to save address:", err);
      setError(err.response?.data?.error || "Failed to save address");
    }
  };

  if (!userId) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Your Addresses</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Saved Addresses List */}
        <div>
          <h2 className="mb-4 text-xl font-semibold">Saved Addresses</h2>
          {loading ? (
            <p>Loading addresses...</p>
          ) : addresses.length > 0 ? (
            <div className="space-y-4">
              {addresses.map((addr) => (
                <div
                  key={addr._id}
                  className="theme-card rounded-2xl p-5 border border-(--border)"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-lg">{addr.fullname}</p>
                      <p className="text-(--text-muted) mt-1">{addr.phone}</p>
                      <p className="mt-2 break-words">{addr.adressLine}</p>
                      <p className="break-words">
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/payment', { state: { selectedAddress: addr } })}
                      className="theme-btn-primary w-full sm:w-auto whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold"
                    >
                      Use this Address
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-(--text-muted)">No saved addresses found.</p>
          )}
        </div>

        {/* Add New Address Form */}
        <div>
          <h2 className="mb-4 text-xl font-semibold">Add New Address</h2>
          <form
            onSubmit={handleSubmit}
            className="theme-card rounded-[28px] p-6 sm:p-8"
          >
            {error && (
              <div className="mb-4 rounded-lg bg-gray-50 p-4 text-sm font-medium text-red-600 border border-gray-100">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="mb-4 rounded-lg bg-gray-50 p-4 text-sm font-medium text-black border border-gray-100">
                {successMsg}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold">Full Name</label>
                <input
                  type="text"
                  name="fullname"
                  required
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="theme-input w-full appearance-none rounded-full px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 8900"
                  className="theme-input w-full appearance-none rounded-full px-4 py-3 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">Address Line</label>
                <input
                  type="text"
                  name="adressLine"
                  required
                  value={formData.adressLine}
                  onChange={handleChange}
                  placeholder="123 Main St, Apt 4B"
                  className="theme-input w-full appearance-none rounded-full px-4 py-3 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-bold">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="New York"
                    className="theme-input w-full appearance-none rounded-full px-4 py-3 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold">State</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="NY"
                    className="theme-input w-full appearance-none rounded-full px-4 py-3 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="10001"
                  className="theme-input w-full appearance-none rounded-full px-4 py-3 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="theme-btn-primary mt-6 w-full rounded-2xl px-4 py-3"
            >
              Save Address
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Address;

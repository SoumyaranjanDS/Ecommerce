import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/user/signup", {
        name: name.trim(),
        email: email.trim(),
        password,
        referredBy: referredBy.trim() || undefined,
      });
      
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.user.id);
        localStorage.setItem("role", res.data.user.role);
      }

      setName("");
      setEmail("");
      setPassword("");
      setReferredBy("");
      window.location.href = "/dashboard";
    } catch (err) {
      setMsg(err.response?.data?.message || "Registry failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-background-secondary) px-6 py-12">
      <div className="w-full max-w-lg bg-white border border-(--color-border-tertiary) rounded-3xl p-10 sm:p-12 shadow-2xl shadow-black/5 animate-fadeIn">
        
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-(--midnight) text-3xl font-bold text-white shadow-xl shadow-black/10 border border-white/10">
            S
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-(--accent-crimson) mb-3">Join the Collective</p>
          <h1 className="text-3xl font-bold tracking-tight text-(--midnight)">Create Registry</h1>
          <p className="mt-3 text-sm font-medium text-(--color-text-secondary)">
            Initiate your premium shopping experience.
          </p>
        </div>

        {msg && (
          <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest text-center">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-(--color-text-tertiary) ml-1">
                Full Identity
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-(--color-background-secondary) border border-(--color-border-tertiary) rounded-xl px-5 py-3.5 text-xs font-bold focus:outline-none focus:border-(--midnight) transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-(--color-text-tertiary) ml-1">
                Digital Mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-(--color-background-secondary) border border-(--color-border-tertiary) rounded-xl px-5 py-3.5 text-xs font-bold focus:outline-none focus:border-(--midnight) transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-(--color-text-tertiary) ml-1">
              Access Key
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-(--color-background-secondary) border border-(--color-border-tertiary) rounded-xl px-5 py-3.5 text-xs font-bold focus:outline-none focus:border-(--midnight) transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="referral" className="text-[10px] font-black uppercase tracking-widest text-(--color-text-tertiary) ml-1">
              Referral Code (Optional)
            </label>
            <input
              id="referral"
              type="text"
              placeholder="STAKY-XXXX"
              value={referredBy}
              onChange={(e) => setReferredBy(e.target.value.toUpperCase())}
              className="w-full bg-(--color-background-secondary) border border-dashed border-(--color-border-tertiary) rounded-xl px-5 py-3.5 text-xs font-bold focus:outline-none focus:border-(--midnight) transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-(--midnight) text-white py-5 rounded-xl text-[11px] font-black uppercase tracking-[0.25em] shadow-xl shadow-black/10 transition-all hover:opacity-95 active:scale-[0.98] mt-6"
          >
            Create Account
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-(--color-border-tertiary) text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-(--color-text-tertiary)">
            Already curated? <button onClick={() => navigate('/login')} className="text-(--midnight) border-b border-(--midnight) pb-0.5 hover:text-(--accent-crimson) hover:border-(--accent-crimson) transition-all">Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
};


export default Signup;

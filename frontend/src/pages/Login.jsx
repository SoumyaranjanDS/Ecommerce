import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/user/login", {
        email: email.trim(),
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("role", res.data.user.role);

      setEmail("");
      setPassword("");
      window.location.href = "/dashboard";
    } catch (err) {
      setMsg(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--color-background-secondary) px-6 py-12">
      <div className="w-full max-w-md bg-white border border-(--color-border-tertiary) rounded-3xl p-10 shadow-2xl shadow-black/5 animate-fadeIn">
        
        <div className="mb-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-(--accent-crimson) mb-3">Secure Access</p>
          <h1 className="text-3xl font-bold tracking-tight text-(--midnight)">Welcome Back</h1>
          <p className="mt-3 text-sm font-medium text-(--color-text-secondary)">
            Access your curated shopping experience.
          </p>
        </div>

        {msg && (
          <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold uppercase tracking-widest text-center">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-(--color-text-tertiary) ml-1">
              Email Registry
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

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-(--color-text-tertiary)">
                Access Key
              </label>
              <button type="button" className="text-[9px] font-bold uppercase tracking-widest text-(--color-text-tertiary) hover:text-(--midnight)">Forgot?</button>
            </div>
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

          <button
            type="submit"
            className="w-full bg-(--midnight) text-white py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10 transition-all hover:opacity-95 active:scale-[0.98] mt-4"
          >
            Authenticate
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-(--color-border-tertiary) text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-(--color-text-tertiary)">
            New to Staky? <button onClick={() => navigate('/signup')} className="text-(--midnight) border-b border-(--midnight) pb-0.5 hover:text-(--accent-crimson) hover:border-(--accent-crimson) transition-all">Create Account</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

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
      const res = await api.post("/user/Login", {
        email: email.trim(),
        password,
      });

      localStorage.setItem("ecom-token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);

      setEmail("");
      setPassword("");
      console.log(res.data);
      navigate("/");
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed");
      console.error(
        "Login failed:",
        err.response?.data?.message || err.message,
      );
    }
  };

  return (
    <div className="theme-page flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="theme-card w-full max-w-md rounded-[28px] p-6 sm:max-w-lg sm:p-8"
      >
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold sm:text-3xl">Login</h1>
          <p className="theme-text-muted mt-2 text-sm sm:text-base">
            Login to your shopping account.
          </p>
        </div>

        {msg && (
          <div className="mb-4 rounded-lg bg-gray-50 p-4 text-sm font-medium text-black border border-gray-100">
            {msg}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-base font-bold sm:text-lg">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="theme-input w-full appearance-none rounded-full px-4 py-3 text-sm sm:text-base"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-base font-bold sm:text-lg"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="theme-input w-full appearance-none rounded-full px-4 py-3 text-sm sm:text-base"
            />
          </div>
        </div>

        <button
          type="submit"
          className="theme-btn-primary mt-6 w-full rounded-2xl px-4 py-3"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;

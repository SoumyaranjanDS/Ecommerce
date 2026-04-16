import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate("/signup");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="theme-page flex min-h-screen items-center justify-center px-4 text-center">
      <div>
        <h1 className="text-4xl font-bold sm:text-5xl">Welcome to Ecommerce</h1>
        <p className="theme-text-muted mt-4 text-base sm:text-lg">
          Shop smart. Shop simple.
        </p>
        <br />
        <br />
        <button
          onClick={handleCreateAccount}
          className="theme-btn-primary mr-4 rounded-full px-6 py-3"
        >
          Create Account
        </button>
        <button
          onClick={handleLogin}
          className="theme-btn-accent rounded-full px-6 py-3"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Home;

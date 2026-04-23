import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const NavBar = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const loadCart = async () => {
      if (!userId) {
        setCartCount(0);
        return;
      }

      try {
        const response = await api.get(`/cart/${userId}`);
        const totalItems = (response.data?.cart?.products || []).reduce(
          (total, item) => total + item.quantity,
          0,
        );
        setCartCount(totalItems);
      } catch (error) {
        if (error.response?.status === 404) {
          setCartCount(0);
          return;
        }

        console.error(error);
      }
    };

    loadCart();
    window.addEventListener("cartUpdate", loadCart);

    return () => {
      window.removeEventListener("cartUpdate", loadCart);
    };
  }, [userId]);

  const handelLogOut = () => {
    localStorage.removeItem("userId");
    setCartCount(0);
    window.dispatchEvent(new Event("cartUpdate"));
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-20 bg-white border-b border-gray-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-5 lg:px-8">
        <Link to="/" className="text-xl font-bold tracking-tight text-(--text)">
          Staky
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/cart"
            className="relative rounded-full border border-(--border) bg-(--surface-soft) px-4 py-2 text-sm font-medium text-(--text) transition hover:border-(--primary) hover:text-(--primary)"
          >
            🛒
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-2 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-black px-1.5 text-[10px] font-semibold text-white">
                {cartCount}
              </span>
            ) : null}
          </Link>

          {!userId ? (
            <>
              <Link
                to="/login"
                className="rounded-lg border border-(--border) bg-(--surface-soft) px-4 py-2 text-sm font-medium text-(--text) transition hover:border-(--primary) hover:text-(--primary)"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="theme-btn-primary rounded-lg px-4 py-2 text-sm font-medium"
              >
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/address"
                className="rounded-lg border border-(--border) bg-(--surface-soft) px-4 py-2 text-sm font-medium text-(--text) transition hover:border-(--primary) hover:text-(--primary)"
              >
                Addresses
              </Link>
              <button
                className="rounded-lg border border-(--border) bg-(--surface-soft) px-4 py-2 text-sm font-medium text-(--text) transition hover:border-(--accent) hover:text-(--accent)"
                onClick={handelLogOut}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

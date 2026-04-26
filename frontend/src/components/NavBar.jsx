import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const NavBar = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

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

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
  }, [isMenuOpen]);

  const handelLogOut = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setCartCount(0);
    window.dispatchEvent(new Event("cartUpdate"));
    setIsMenuOpen(false);
    navigate("/login");
  };

  return (
    <>
      <nav className="sticky top-0 z-[60] bg-white/80 backdrop-blur-md border-b border-(--color-border-tertiary) shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-(--midnight) text-white h-10 w-10 rounded-xl flex items-center justify-center font-bold text-xl transition-all group-hover:scale-105">
              S
            </div>
            <span className="text-xl font-bold tracking-tight text-(--midnight)">STAKY</span>
          </Link>

          <div className="flex items-center gap-6">
            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-10">
              <Link to="/" className="text-[11px] font-bold uppercase tracking-widest text-(--color-text-secondary) hover:text-(--midnight) transition-colors">Shop</Link>
              {userId && (
                <>
                  <Link to="/dashboard" className="text-[11px] font-bold uppercase tracking-widest text-(--color-text-secondary) hover:text-(--midnight) transition-colors">Overview</Link>
                  <Link to="/wishlist" className="text-[11px] font-bold uppercase tracking-widest text-(--color-text-secondary) hover:text-(--midnight) transition-colors">Wishlist</Link>
                </>
              )}
              {role === "admin" && (
                <Link to="/admin/dashboard" className="text-[11px] font-bold uppercase tracking-widest text-(--accent-crimson) px-3 py-1 bg-(--accent-crimson)/5 border border-(--accent-crimson)/10 rounded-full">Admin</Link>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4 ml-4">
              <Link to="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-(--color-background-secondary) text-(--midnight) border border-(--color-border-tertiary) transition-all hover:bg-(--color-background-tertiary)">
                <span className="text-lg">🛒</span>
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-(--midnight) text-[10px] font-bold text-white shadow-md">
                    {cartCount}
                  </span>
                )}
              </Link>

              {userId ? (
                <Link to="/profile" className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-(--color-background-secondary) text-(--midnight) border border-(--color-border-tertiary) transition-all hover:bg-(--color-background-tertiary)">
                  👤
                </Link>
              ) : (
                <Link to="/signup" className="hidden sm:flex bg-(--midnight) text-white rounded-xl px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all">
                  Join
                </Link>
              )}

              {/* Mobile Toggle */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--color-background-secondary) text-(--midnight) border border-(--color-border-tertiary) md:hidden transition-all"
              >
                <div className="relative w-5 h-3 flex flex-col justify-between">
                  <span className={`w-full h-0.5 bg-(--midnight) rounded-full transition-all ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
                  <span className={`w-full h-0.5 bg-(--midnight) rounded-full transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`w-full h-0.5 bg-(--midnight) rounded-full transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div 
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      <div className={`fixed top-0 right-0 z-[70] h-full w-[80%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-out md:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full p-8 pt-20">
          <div className="space-y-8">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-(--color-text-tertiary)">Main Menu</p>
            
            <div className="space-y-6">
              {[
                { to: "/", label: "Shop Home" },
                { to: "/dashboard", label: "My Dashboard" },
                { to: "/wishlist", label: "My Wishlist" },
                { to: "/profile", label: "Account Settings" },
              ].map((item) => (
                <Link 
                  key={item.to}
                  to={item.to} 
                  onClick={() => setIsMenuOpen(false)} 
                  className="block text-xl font-bold tracking-tight text-(--midnight) hover:text-(--accent-crimson) transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              
              {role === "admin" && (
                <Link 
                  to="/admin/dashboard" 
                  onClick={() => setIsMenuOpen(false)} 
                  className="block text-xl font-bold tracking-tight text-(--accent-crimson) pt-6 border-t border-(--color-border-secondary)"
                >
                  🛡️ Admin Panel
                </Link>
              )}
            </div>
          </div>
          
          <div className="mt-auto pt-10 border-t border-(--color-border-secondary)">
            {userId ? (
              <button 
                onClick={handelLogOut} 
                className="w-full rounded-xl bg-(--color-background-secondary) py-4 text-[11px] font-bold uppercase tracking-widest text-red-600 border border-red-100"
              >
                Sign Out
              </button>
            ) : (
              <Link 
                to="/signup" 
                onClick={() => setIsMenuOpen(false)} 
                className="block w-full rounded-xl bg-(--midnight) py-4 text-center text-[11px] font-bold uppercase tracking-widest text-white shadow-lg"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;

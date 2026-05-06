import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import CartDrawer from "./CartDrawer";

const NavBar = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
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
    if (isMenuOpen || isCartOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
  }, [isMenuOpen, isCartOpen]);

  const handelLogOut = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setCartCount(0);
    setIsCartOpen(false);
    window.dispatchEvent(new Event("cartUpdate"));
    setIsMenuOpen(false);
    navigate("/login");
  };

  return (
    <>
      <nav className="sticky top-0 z-[60] bg-gradient-to-r from-[#003328] to-[#004d3d] shadow-xl border-b border-white/5">
        <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            
            {/* Logo & Search Area */}
            <div className="flex items-center flex-1 gap-4 sm:gap-10">
              <Link to="/" className="flex items-center group shrink-0">
                <img 
                  src="/logo-white.png" 
                  alt="Staky" 
                  className="h-10 sm:h-12 w-auto transition-all duration-500 transform group-hover:scale-105 active:scale-95 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]" 
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <span className="hidden text-2xl sm:text-4xl font-black italic tracking-tighter text-white group-hover:text-(--staky-yellow) transition-all duration-500 transform group-hover:scale-105 active:scale-95">
                  STAKY
                </span>
              </Link>

              {/* Desktop Search Bar */}
              <div className="hidden md:flex flex-1 max-w-xl relative group">
                <input
                  type="text"
                  placeholder="Search for products, brands and more"
                  className="w-full bg-white/95 text-sm py-2.5 px-5 rounded-sm focus:outline-none shadow-lg focus:bg-white transition-all duration-500 border border-transparent focus:border-white/20 focus:ring-4 focus:ring-white/10"
                />
                <button className="absolute right-0 top-0 bottom-0 px-5 text-(--staky-green) hover:bg-gray-50 transition-all duration-300 rounded-r-sm group-focus-within:bg-gray-100">
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-10">
              {userId ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 text-white font-bold text-[15px] hover:text-(--staky-yellow) transition-all duration-500 py-2 group-hover:-translate-y-0.5">
                    <span>Account</span>
                    <svg className="w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-180" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </button>
                  <div className="absolute top-[calc(100%-2px)] right-0 w-56 bg-white shadow-2xl rounded-md border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:animate-premium-slide transition-all duration-500 origin-top-right py-3 z-50 overflow-hidden">
                    <div className="absolute -top-2 right-8 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100"></div>
                    <Link to="/profile" className="flex items-center gap-3 px-6 py-3.5 text-sm font-medium text-(--staky-text-primary) hover:bg-green-50 hover:text-(--staky-green) transition-all duration-300 border-b border-gray-50">
                       <span className="opacity-60">👤</span> My Profile
                    </Link>
                    <Link to="/dashboard" className="flex items-center gap-3 px-6 py-3.5 text-sm font-medium text-(--staky-text-primary) hover:bg-green-50 hover:text-(--staky-green) transition-all duration-300 border-b border-gray-50">
                       <span className="opacity-60">📦</span> My Orders
                    </Link>
                    <Link to="/wishlist" className="flex items-center gap-3 px-6 py-3.5 text-sm font-medium text-(--staky-text-primary) hover:bg-green-50 hover:text-(--staky-green) transition-all duration-300">
                       <span className="opacity-60">❤️</span> Wishlist
                    </Link>
                    {role === "admin" && (
                      <Link to="/admin/dashboard" className="flex items-center gap-3 px-6 py-3.5 text-sm font-bold text-red-600 bg-red-50/30 hover:bg-red-50 transition-all duration-300 border-t border-gray-50">
                         <span>🛡️</span> Admin Panel
                      </Link>
                    )}
                    <button onClick={handelLogOut} className="w-full text-left flex items-center gap-3 px-6 py-3.5 text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-red-500 transition-all duration-300 border-t border-gray-50">
                       <span>🚪</span> Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="shimmer-wrapper relative bg-white text-(--staky-green) font-bold px-12 py-2.5 rounded-sm text-[15px] shadow-xl hover:shadow-white/20 transition-all duration-500 active:scale-95 overflow-hidden">
                   <span className="relative z-10">Login</span>
                </Link>
              )}

              <button 
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2.5 text-white font-bold text-[15px] hover:text-(--staky-yellow) transition-all duration-500 group"
              >
                <div className="relative transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -right-2.5 -top-2.5 flex h-5.5 w-5.5 items-center justify-center rounded-full bg-(--staky-yellow) text-(--staky-green) text-[10px] font-black border-2 border-[#003328] animate-bounce-subtle shadow-lg">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span>Cart</span>
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-5">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative text-white active:scale-90 transition-all duration-300"
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-(--staky-yellow) text-(--staky-green) text-[9px] font-black shadow-md">
                    {cartCount}
                  </span>
                )}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white active:scale-90 transition-all duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Search Bar (Below Header) */}
          <div className="flex md:hidden pb-5 px-1">
            <div className="flex-1 relative group">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-white/95 text-sm py-2.5 px-4 rounded-sm focus:outline-none shadow-xl transition-all duration-300 border border-transparent focus:border-white/20"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 active:scale-90 transition-transform">
                <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar (Staky Style) */}
      <div 
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-all duration-700 ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsMenuOpen(false)}
      ></div>

      <div className={`fixed top-0 left-0 z-[70] h-full w-[300px] bg-white shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] md:hidden ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="bg-gradient-to-br from-[#003328] to-[#004d3d] p-8 text-white flex flex-col gap-4 relative overflow-hidden">
             <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
             <div className="h-14 w-14 bg-white/20 rounded-full flex items-center justify-center text-2xl shadow-inner border border-white/10 backdrop-blur-md">👤</div>
             <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">Authenticated Account</p>
                <p className="font-black text-2xl tracking-tight">{userId ? "Subscriber" : "Guest User"}</p>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto py-8">
            {[
              { to: "/", label: "Home Feed", icon: "🏠" },
              { to: "/dashboard", label: "Order History", icon: "📦" },
              { to: "/wishlist", label: "My Favorites", icon: "❤️" },
              { to: "/profile", label: "Account Settings", icon: "👤" },
              { to: "/cart", label: "Shopping Bag", icon: "🛒" },
            ].map((item) => (
              <Link 
                key={item.to}
                to={item.to} 
                onClick={() => setIsMenuOpen(false)} 
                className="flex items-center gap-5 px-10 py-5 text-[15px] font-bold text-(--staky-text-primary) hover:bg-green-50/50 hover:text-(--staky-green) transition-all duration-300 border-b border-gray-50 active:bg-green-50 group"
              >
                <span className="text-2xl transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            
            {role === "admin" && (
              <Link 
                to="/admin/dashboard" 
                onClick={() => setIsMenuOpen(false)} 
                className="flex items-center gap-5 px-10 py-5 text-[15px] font-black text-red-600 hover:bg-red-50 transition-all duration-300 border-b border-gray-50"
              >
                <span className="text-2xl">🛡️</span>
                System Manager
              </Link>
            )}
          </div>
          
          <div className="p-8 border-t border-gray-100 bg-gray-50/50">
            {userId ? (
              <button 
                onClick={handelLogOut} 
                className="w-full flex items-center justify-center gap-3 py-5 text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-red-600 transition-all duration-300 active:scale-95"
              >
                Terminte Session
              </button>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setIsMenuOpen(false)} 
                className="shimmer-wrapper block w-full py-5 text-center text-xs font-black uppercase tracking-[0.2em] text-white bg-gradient-to-r from-[#003328] to-[#004d3d] rounded-sm shadow-2xl active:scale-[0.98] transition-all duration-500"
              >
                Sign In / Join
              </Link>
            )}
          </div>
        </div>
      </div>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default NavBar;

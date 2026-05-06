import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";

const ProductSkeleton = () => (
  <div className="bg-white border border-gray-100 p-6 flex flex-col h-full animate-pulse">
    <div className="aspect-[4/5] bg-gray-100 mb-8 rounded-sm"></div>
    <div className="h-4 bg-gray-100 w-1/3 mb-4 rounded-sm"></div>
    <div className="h-6 bg-gray-100 w-3/4 mb-6 rounded-sm"></div>
    <div className="mt-auto flex flex-col items-center gap-4">
      <div className="h-6 bg-gray-100 w-1/4 rounded-sm"></div>
      <div className="h-12 bg-gray-100 w-full rounded-sm"></div>
    </div>
  </div>
);

import { 
  LayoutGrid, 
  Monitor, 
  Shirt, 
  Sparkles, 
  Home as HomeIcon, 
  Dumbbell, 
  BookOpen 
} from "lucide-react";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const loaderRef = useRef(null);
  const navigate = useNavigate();
  
  const banners = [
    { image: "/images/banner1.png", title: "CURATED TECH", subtitle: "The ultimate selection for the digital minimalist." },
    { image: "/images/banner2.png", title: "TIMELESS STYLE", subtitle: "Elevated essentials designed for every season." },
  ];

  const categoriesWithIcons = [
    { label: "All Items", icon: LayoutGrid },
    { label: "Electronics", icon: Monitor },
    { label: "Fashion", icon: Shirt },
    { label: "Beauty", icon: Sparkles },
    { label: "Home & Kitchen", icon: HomeIcon },
    { label: "Sports", icon: Dumbbell },
    { label: "Books", icon: BookOpen }
  ];

  const userId = localStorage.getItem("userId");

  const loadProducts = async (pageNum = 1, isLoadMore = false) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/product?search=${search.trim()}&category=${category}&page=${pageNum}&limit=12`
      );
      const newProducts = Array.isArray(response.data.products) ? response.data.products : [];
      
      if (isLoadMore) {
        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p._id));
          const uniqueNew = newProducts.filter(p => !existingIds.has(p._id));
          return [...prev, ...uniqueNew];
        });
      } else {
        setProducts(newProducts);
        setFlashSaleProducts(newProducts.slice(0, 4));
      }
      
      setTotalPages(response.data.pages || 1);
      setPage(pageNum);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadWishlist = async () => {
    if (!userId) return;
    try {
      const res = await api.get("/wishlist");
      setWishlist((res.data.wishlist || []).map(item => item._id));
    } catch (err) {
      console.error("Failed to load wishlist");
    }
  };

  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(bannerInterval);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadProducts(1);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, category]);

  useEffect(() => {
    loadWishlist();
  }, [userId]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && page < totalPages) {
          loadProducts(page + 1, true);
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loading, page, totalPages]);

  const toggleWishlist = async (productId) => {
    if (!userId) {
      alert("Please login to use wishlist");
      return;
    }
    try {
      if (wishlist.includes(productId)) {
        await api.delete(`/wishlist/remove/${productId}`);
        setWishlist(prev => prev.filter(id => id !== productId));
      } else {
        await api.post("/wishlist/add", { productId });
        setWishlist(prev => [...prev, productId]);
      }
    } catch (err) {
      console.error("Wishlist action failed");
    }
  };

  const addToCart = async (productId) => {
    if (!userId) {
      alert("Please login to add items to cart");
      return;
    }
    try {
      await api.post("/cart/add", { userId, productId });
      window.dispatchEvent(new Event("cartUpdate"));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-(--flipkart-bg)">
      <Helmet>
        <title>Antigravity | Curated Luxury Tech Archive</title>
        <meta name="description" content="Discover our limited collection of premium electronics, curated for the modern digital minimalist." />
      </Helmet>
      
      {/* Categories Bar */}
      <section className="sticky top-16 sm:top-20 z-40 bg-white/95 backdrop-blur-md border-b border-(--color-border-tertiary) mb-2 shadow-sm transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center justify-between overflow-x-auto gap-8 sm:gap-12 no-scrollbar px-4 sm:px-10">
            {categoriesWithIcons.map((cat) => {
              const IconComponent = cat.icon;
              const isActive = (category === cat.label || (category === "" && cat.label === "All Items"));
              return (
                <button
                  key={cat.label}
                  onClick={() => setCategory(cat.label === "All Items" ? "" : cat.label)}
                  className="flex flex-col items-center gap-2 shrink-0 transition-all group"
                >
                  <div className={`p-2.5 rounded-full transition-all duration-500 ${
                    isActive 
                    ? "bg-(--staky-green) text-white shadow-lg shadow-green-200" 
                    : "bg-gray-50 text-gray-400 group-hover:bg-green-50 group-hover:text-(--staky-green)"
                  }`}>
                    <IconComponent size={24} strokeWidth={isActive ? 2.5 : 2} className="transition-transform group-hover:scale-110" />
                  </div>
                  <span className={`text-[11px] sm:text-xs font-bold whitespace-nowrap transition-colors duration-300 ${
                    isActive
                    ? "text-(--staky-green)"
                    : "text-(--staky-text-primary) opacity-70 group-hover:opacity-100"
                  }`}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-2 sm:px-4 py-2 space-y-4">
        
        {/* Banner Section */}
        <section className="relative h-[180px] sm:h-[350px] w-full overflow-hidden shadow-2xl rounded-sm group">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-[1500ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
                currentBanner === index ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
            >
              <img src={banner.image} alt={banner.title} className="h-full w-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center px-10 sm:px-20">
                 <div className={`hidden sm:block text-white transition-all duration-1000 delay-300 ${currentBanner === index ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                    <p className="text-xs font-black tracking-[0.4em] uppercase mb-3 text-(--staky-yellow) opacity-80">Exclusive Offer</p>
                    <h2 className="text-4xl lg:text-6xl font-black mb-4 tracking-tighter leading-none">{banner.title}</h2>
                    <p className="text-lg opacity-80 max-w-md font-medium italic">{banner.subtitle}</p>
                    <button className="mt-8 bg-white text-(--staky-green) px-10 py-3 text-xs font-black uppercase tracking-widest rounded-sm hover:bg-(--staky-yellow) transition-all active:scale-95 shadow-xl">
                       Shop Now
                    </button>
                 </div>
              </div>
            </div>
          ))}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {banners.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentBanner(i)} 
                className={`h-1.5 transition-all duration-500 rounded-full ${currentBanner === i ? "w-10 bg-white shadow-lg" : "w-3 bg-white/30 hover:bg-white/50"}`} 
              />
            ))}
          </div>
          {/* Navigation Arrows */}
          <button onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)} className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-white/10 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-white hover:text-(--staky-green)">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)} className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 bg-white/10 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-white hover:text-(--staky-green)">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
          </button>
        </section>

        {/* Top Deals Section */}
        {flashSaleProducts.length > 0 && !category && !search && (
          <section className="bg-white p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-(--staky-text-primary)">Top Deals on Essentials</h2>
                <div className="bg-(--staky-green) text-white text-[10px] px-2 py-0.5 rounded-sm">Featured</div>
              </div>
              <Link to="/" className="bg-(--staky-green) text-white px-4 py-2 text-xs font-bold rounded-sm shadow-sm hover:opacity-90 transition-all">
                VIEW ALL
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {flashSaleProducts.map((product) => (
                <div key={product._id} className="group relative flex flex-col bg-white rounded-sm border border-gray-100 transition-all duration-1000 hover:shadow-lg overflow-hidden">
                  <div className="relative aspect-square overflow-hidden bg-[#fafafa] flex items-center justify-center p-6">
                    <button 
                      onClick={(e) => { e.preventDefault(); toggleWishlist(product._id); }}
                      className="absolute right-4 top-4 z-20 h-8 w-8 border border-gray-200 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:bg-white opacity-0 group-hover:opacity-100 duration-700"
                    >
                      <span className="text-[10px]">{wishlist.includes(product._id) ? "❤️" : "🤍"}</span>
                    </button>
                    <Link to={`/product/${product._id}`} className="w-full h-full flex items-center justify-center">
                      <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain mix-blend-multiply transition-all duration-[1500ms] group-hover:scale-105" />
                    </Link>
                  </div>
                  <div className="p-6 flex flex-col items-center text-center flex-1">
                    <h3 className="text-sm font-serif text-(--staky-text-primary) line-clamp-1 mb-2 group-hover:italic transition-all duration-700">{product.title}</h3>
                    <div className="w-4 h-[1px] bg-gray-200 mb-3 group-hover:w-12 transition-all duration-1000"></div>
                    <p className="text-[10px] font-black text-green-600 mb-4 uppercase tracking-[0.2em]">Limited Edition</p>
                    <div className="mt-auto flex flex-col items-center gap-3">
                       <span className="text-lg font-light tracking-tighter text-gray-800">₹{product.price.toLocaleString("en-IN")}</span>
                       <button onClick={() => addToCart(product._id)} className="px-6 py-2 bg-black text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-sm transition-all duration-700 hover:bg-(--staky-green)">
                          View Detail
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Main Grid Section */}
        <section className="bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-(--staky-text-primary)">
              {search ? `Results for "${search}"` : category ? `${category} Collection` : "Our Bestsellers"}
            </h2>
            <div className="flex items-center gap-2">
               <span className="text-xs text-(--staky-text-secondary)">Filter By:</span>
               <select 
                 className="text-xs border border-gray-200 px-3 py-1.5 rounded-sm focus:outline-none"
                 onChange={(e) => setCategory(e.target.value)}
                 value={category}
               >
                 <option value="">All Categories</option>
                 {categoriesWithIcons.filter(c => c.label !== "All Items").map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
               </select>
            </div>
          </div>

          {loading && products.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-(--staky-green) border-t-transparent"></div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Finding the best prices...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10">
              <AnimatePresence mode="popLayout">
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.8, 
                      delay: (index % 4) * 0.1,
                      ease: [0.21, 0.45, 0.32, 0.9]
                    }}
                    className="group relative flex flex-col bg-white rounded-sm border border-gray-100 transition-all duration-1000 hover:shadow-xl overflow-hidden"
                  >
                    {/* Image Section */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#fafafa] flex items-center justify-center p-10">
                       <button 
                        onClick={(e) => { e.preventDefault(); toggleWishlist(product._id); }}
                        className="absolute right-6 top-6 z-20 h-10 w-10 border border-gray-200 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:bg-white active:scale-90 opacity-0 group-hover:opacity-100 duration-1000 translate-y-2 group-hover:translate-y-0"
                      >
                        <span className="text-xs">{wishlist.includes(product._id) ? "❤️" : "🤍"}</span>
                      </button>

                      <Link to={`/product/${product._id}`} className="w-full h-full flex items-center justify-center">
                        <img 
                          src={product.image} 
                          alt={product.title} 
                          className="max-h-full max-w-full object-contain mix-blend-multiply transition-all duration-[2000ms] ease-out group-hover:scale-110" 
                          loading="lazy"
                        />
                      </Link>
                      
                      <div className="absolute inset-0 border-[1px] border-black/5 pointer-events-none"></div>
                    </div>
                    
                    {/* Editorial Content */}
                    <div className="p-8 flex flex-col items-center text-center flex-1">
                      <div className="mb-4">
                         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 pb-1">
                           {product.category}
                         </span>
                      </div>
                      
                      <Link to={`/product/${product._id}`}>
                        <h3 className="text-xl font-serif text-(--staky-text-primary) leading-tight mb-4 group-hover:italic transition-all duration-700">
                          {product.title}
                        </h3>
                      </Link>

                      <div className="w-8 h-[1px] bg-gray-200 mb-4 transition-all duration-1000 group-hover:w-24"></div>

                      <div className="mt-auto flex flex-col items-center gap-4">
                         <span className="text-xl font-light tracking-tighter text-gray-800">
                           ₹{product.price.toLocaleString("en-IN")}
                         </span>
                         
                         <button 
                          onClick={() => setQuickViewProduct(product)}
                          className="px-8 py-3 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm transition-all duration-700 hover:bg-(--staky-green) active:scale-95 shadow-sm"
                        >
                          Discover Product
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Skeleton loaders for first load or append */}
                {loading && products.length === 0 && Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeleton key={`skeleton-${i}`} />
                ))}
              </AnimatePresence>
            </div>
          )}

          {products.length === 0 && !loading && (
            <div className="py-20 text-center">
              <div className="text-6xl mb-4 opacity-20">🛒</div>
              <h3 className="text-lg font-bold text-gray-500">No items found for this selection</h3>
              <button onClick={() => {setSearch(""); setCategory("");}} className="mt-4 text-(--flipkart-blue) font-bold text-sm">Reset Filters</button>
            </div>
          )}

          {/* Infinite Scroll Sentinel */}
          <div ref={loaderRef} className="mt-20 flex flex-col items-center gap-6 border-t border-gray-100 pt-16">
             {page < totalPages ? (
               <div className="flex flex-col items-center gap-4">
                 <div className="h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 italic">
                   Revealing Next Collection...
                 </p>
               </div>
             ) : products.length > 0 && (
               <div className="flex flex-col items-center gap-4">
                 <div className="w-8 h-[1px] bg-gray-200"></div>
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 italic">
                   End of Archive — {products.length} units displayed
                 </p>
               </div>
             )}
             
             <div className="w-[1px] h-20 bg-gradient-to-b from-black to-transparent mt-8 opacity-20"></div>
          </div>
        </section>

      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickViewProduct(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-white transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Product Image */}
              <div className="w-full md:w-1/2 bg-(--color-background-secondary) flex items-center justify-center p-12 overflow-hidden">
                <img 
                  src={quickViewProduct.image} 
                  alt={quickViewProduct.title} 
                  className="max-w-full max-h-[500px] object-contain mix-blend-multiply hover:scale-110 transition-transform duration-1000"
                />
              </div>

              {/* Product Info */}
              <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col overflow-y-auto">
                <div className="mb-8">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Archive Collection / {quickViewProduct.category}</p>
                  <h2 className="text-3xl font-serif text-black leading-tight mb-4 italic">{quickViewProduct.title}</h2>
                  <div className="w-12 h-[1px] bg-black/10"></div>
                </div>

                <div className="flex-1 space-y-8">
                  <div>
                    <span className="text-3xl font-light tracking-tighter text-black">₹{quickViewProduct.price.toLocaleString("en-IN")}</span>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Price inclusive of all taxes</p>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    {quickViewProduct.description || "A masterpiece of modern engineering, meticulously curated for the ultimate digital minimalist experience."}
                  </p>

                  <div className="space-y-6 pt-6 border-t border-gray-100">
                    <button 
                      onClick={() => { addToCart(quickViewProduct._id); setQuickViewProduct(null); }}
                      className="w-full bg-black text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-(--staky-green) transition-all active:scale-[0.98]"
                    >
                      Secure Unit to Bag
                    </button>
                    <button 
                      onClick={() => navigate(`/product/${quickViewProduct._id}`)}
                      className="w-full text-center text-[10px] font-black uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors"
                    >
                      View Full Archive Details
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Home;


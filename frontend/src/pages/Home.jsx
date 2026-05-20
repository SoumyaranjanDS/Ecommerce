import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { 
  LayoutGrid, 
  Monitor, 
  Shirt, 
  Sparkles, 
  Home as HomeIcon, 
  Dumbbell, 
  BookOpen,
  Truck,
  RotateCcw,
  Headphones,
  Shield
} from "lucide-react";

const ProductSkeleton = () => (
  <div className="bg-white border border-gray-100 p-6 flex flex-col h-full animate-pulse rounded-sm">
    <div className="aspect-[4/5] bg-gray-100 mb-8 rounded-sm"></div>
    <div className="h-4 bg-gray-100 w-1/3 mb-4 rounded-sm"></div>
    <div className="h-6 bg-gray-100 w-3/4 mb-6 rounded-sm"></div>
    <div className="mt-auto flex flex-col items-center gap-4">
      <div className="h-6 bg-gray-100 w-1/4 rounded-sm"></div>
      <div className="h-12 bg-gray-100 w-full rounded-sm"></div>
    </div>
  </div>
);

const ProductCardCompact = ({ product }) => (
  <Link 
    to={`/product/${product._id}`}
    className="group bg-white border border-gray-100 hover:border-gray-300 p-4 flex flex-col h-full transition-all duration-300 hover:shadow-lg rounded-sm"
  >
    <div className="aspect-[4/5] relative mb-4 overflow-hidden bg-gray-100 rounded-sm flex items-center justify-center">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        onError={(e) => e.target.src = "/placeholder.png"}
      />
    </div>
    <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2">{product.title}</h3>
    <div className="mt-auto">
      <p className="text-xl font-light text-gray-900">₹{(product.salePrice || product.price).toLocaleString("en-IN")}</p>
    </div>
  </Link>
);

const ProductCard = ({ product }) => (
  <Link 
    to={`/product/${product._id}`}
    className="group bg-white border border-gray-100 hover:border-gray-300 p-6 flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:scale-105 rounded-sm"
  >
    <div className="aspect-[4/5] relative mb-6 overflow-hidden bg-gray-100 rounded-sm flex items-center justify-center">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        onError={(e) => e.target.src = "/placeholder.png"}
      />
    </div>
    <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 text-sm group-hover:text-green-600">{product.title}</h3>
    <div className="mt-auto">
      <p className="text-2xl font-light text-gray-900">₹{(product.salePrice || product.price).toLocaleString("en-IN")}</p>
    </div>
  </Link>
);

const Home = () => {
  const [products, setProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [wishlist, setWishlist] = useState([]);
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [email, setEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  
  const loaderRef = useRef(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

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

  const trustSignals = [
    { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
    { icon: RotateCcw, title: "Easy Returns", desc: "30-day return policy" },
    { icon: Headphones, title: "24/7 Support", desc: "Customer service" },
    { icon: Shield, title: "Secure Payment", desc: "100% encrypted" }
  ];

  const loadProducts = async (pageNum = 1, isLoadMore = false) => {
    try {
      setLoading(true);
      const params = {
        search: search.trim(),
        category,
        page: pageNum,
        limit: 12,
        sort
      };
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (rating) params.rating = rating;

      const response = await api.get("/product", { params });
      const newProducts = Array.isArray(response.data.products) ? response.data.products : [];
      
      if (isLoadMore) {
        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p._id));
          const uniqueNew = newProducts.filter(p => !existingIds.has(p._id));
          return [...prev, ...uniqueNew];
        });
      } else {
        setProducts(newProducts);
      }
      
      setTotalPages(response.data.pages || 1);
      setPage(pageNum);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSections = async () => {
    try {
      const [newest, popular, rated] = await Promise.all([
        api.get("/product", { params: { sort: "newest", limit: 4 } }),
        api.get("/product", { params: { sort: "popular", limit: 4 } }),
        api.get("/product", { params: { sort: "rating", limit: 4 } })
      ]);

      setNewArrivals(newest.data.products || []);
      setBestSellers(popular.data.products || []);
      setTopRated(rated.data.products || []);
    } catch (error) {
      console.error("Error loading sections:", error);
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

  const toggleWishlist = async (productId) => {
    if (!userId) {
      navigate("/login");
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
      navigate("/login");
      return;
    }
    try {
      await api.post("/cart/add", { userId, productId });
      window.dispatchEvent(new Event("cartUpdate"));
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewsletterSignup = async (e) => {
    e.preventDefault();
    if (!email) return;
    setNewsletterLoading(true);
    try {
      setEmail("");
      alert("Thank you for subscribing! Check your email for 10% discount code.");
    } finally {
      setNewsletterLoading(false);
    }
  };

  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(bannerInterval);
  }, []);

  useEffect(() => {
    loadSections();
    loadWishlist();
  }, [userId]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadProducts(1);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, category, sort, minPrice, maxPrice, rating]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Staky | Premium Curated Products</title>
        <meta name="description" content="Discover our curated collection of products." />
      </Helmet>

      {/* Categories Bar */}
      <section className="sticky top-16 sm:top-20 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 mb-4 shadow-sm">
        <div className="mx-auto max-w-7xl px-2 sm:px-4 py-3">
          <div className="flex items-center overflow-x-auto gap-4 no-scrollbar px-1 sm:px-0">
            {categoriesWithIcons.map((cat) => {
              const IconComponent = cat.icon;
              const isActive = category === cat.label || (category === "" && cat.label === "All Items");
              return (
                <button
                  key={cat.label}
                  onClick={() => setCategory(cat.label === "All Items" ? "" : cat.label)}
                  className="flex flex-col items-center gap-1 shrink-0 transition-all group"
                >
                  <div className={`p-2 rounded-full transition-all ${
                    isActive ? "bg-green-600 text-white shadow-lg" : "bg-gray-100 text-gray-600 group-hover:bg-green-100"
                  }`}>
                    <IconComponent size={20} />
                  </div>
                  <span className={`text-[10px] sm:text-xs font-bold whitespace-nowrap ${
                    isActive ? "text-green-600" : "text-gray-600"
                  }`}>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-2 sm:px-4 py-4 space-y-6">
        
        {/* Banner */}
        <section className="relative h-[180px] sm:h-[320px] md:h-[400px] overflow-hidden shadow-2xl rounded-lg group">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-[1500ms] ${
                currentBanner === index ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
            >
              <img src={banner.image} alt={banner.title} className="h-full w-full object-cover brightness-90 group-hover:brightness-100 transition-all" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center px-4 sm:px-8 md:px-20">
                <div className={`text-white transition-opacity duration-500 ${currentBanner === index ? "opacity-100" : "opacity-0"}`}>
                  <h2 className="text-2xl sm:text-4xl lg:text-6xl font-black mb-2 sm:mb-4">{banner.title}</h2>
                  <p className="text-sm sm:text-lg opacity-80">{banner.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentBanner(i)} 
                className={`rounded-full transition-all ${currentBanner === i ? "w-10 h-2 bg-white" : "w-2 h-2 bg-white/40"}`} 
              />
            ))}
          </div>
        </section>

        {/* Trust Signals */}
        <section className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          {trustSignals.map((signal, idx) => {
            const Icon = signal.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-sm text-center border border-gray-100">
                <Icon className="w-10 h-10 mx-auto text-green-600 mb-3" />
                <h3 className="font-bold text-gray-900 mb-1">{signal.title}</h3>
                <p className="text-xs text-gray-600">{signal.desc}</p>
              </div>
            );
          })}
        </section>

        {/* New Arrivals */}
        {newArrivals.length > 0 && (
          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-6">✨ New Arrivals</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {newArrivals.map((product) => (
                <ProductCardCompact key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Best Sellers */}
        {bestSellers.length > 0 && (
          <section className="bg-gradient-to-br from-red-50 to-white p-6 rounded-lg shadow-sm border border-red-200">
            <h2 className="text-2xl font-black text-gray-900 mb-6">🔥 Best Sellers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {bestSellers.map((product) => (
                <ProductCardCompact key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Top Rated */}
        {topRated.length > 0 && (
          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-6">⭐ Top Rated</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {topRated.map((product) => (
                <ProductCardCompact key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Newsletter */}
        <section className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 sm:p-8 rounded-lg shadow-xl">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-black mb-2">Get Exclusive Deals</h2>
            <p className="text-green-100 mb-4 sm:mb-6 text-sm sm:text-base">Subscribe to our newsletter and get 10% off your first purchase!</p>
            <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full sm:flex-1 px-4 py-3 rounded-lg text-gray-900 font-bold focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={newsletterLoading}
                className="w-full sm:w-auto px-6 py-3 bg-yellow-400 text-green-700 font-black rounded-lg hover:bg-yellow-500"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>

        {/* Main Products */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-b border-gray-100 pb-6">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">
                {search ? `Results for "${search}"` : category ? `${category}` : "All Products"}
              </h2>
              <p className="text-sm text-gray-600">{products.length > 0 ? `Showing ${products.length} products` : "No products"}</p>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg font-bold text-sm"
              >
                🔍 Filters
              </button>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg font-bold bg-white text-sm"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mb-6 p-4 sm:p-6 bg-gray-50 rounded-lg space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Min Price</label>
                  <input
                    type="number"
                    placeholder="₹0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Max Price</label>
                  <input
                    type="number"
                    placeholder="₹100000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Minimum Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  >
                    <option value="">All Ratings</option>
                    <option value="4">4★ & above</option>
                    <option value="3">3★ & above</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setMinPrice("");
                    setMaxPrice("");
                    setRating("");
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 font-bold rounded-lg text-sm"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => { setShowFilters(false); }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white font-bold rounded-lg text-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {products.length === 0 && !loading ? (
            <div className="text-center py-12">
              <p className="text-2xl text-gray-500 mb-4">😕 No products found</p>
              <button onClick={() => {setSearch(""); setCategory("");}} className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-bold">
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {loading && products.length === 0
                  ? Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)
                  : products.map(product => <ProductCard key={product._id} product={product} />)
                }
              </div>
              <div ref={loaderRef} className="flex justify-center py-8">
                {loading && <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-green-600"></div>}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;

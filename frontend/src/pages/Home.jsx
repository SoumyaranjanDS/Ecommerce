import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const categories = ["Electronics", "Fashion", "Beauty", "Home & Kitchen", "Sports", "Books"];

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
  
  const banners = [
    { image: "/images/banner1.png", title: "CURATED TECH", subtitle: "The ultimate selection for the digital minimalist." },
    { image: "/images/banner2.png", title: "TIMELESS STYLE", subtitle: "Elevated essentials designed for every season." },
  ];

  const userId = localStorage.getItem("userId");

  const loadProducts = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/product?search=${search.trim()}&category=${category}&page=${pageNum}&limit=12`
      );
      setProducts(Array.isArray(response.data.products) ? response.data.products : []);
      setTotalPages(response.data.pages || 1);
      setPage(pageNum);
      setFlashSaleProducts((response.data.products || []).slice(0, 4));
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
    <div className="min-h-screen bg-(--color-background-primary)">
      {/* Hero Section */}
      <section className="relative h-[400px] sm:h-[650px] w-full overflow-hidden bg-(--midnight)">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
              currentBanner === index ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            <img src={banner.image} alt={banner.title} className="h-full w-full object-cover opacity-60" />
            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-24">
              <p className="text-[10px] sm:text-[12px] font-black tracking-[0.4em] text-(--accent-crimson) uppercase mb-4 animate-fadeIn">
                Latest Collection
              </p>
              <h1 className="max-w-2xl text-4xl sm:text-7xl font-bold tracking-tight text-white leading-[1.1] animate-slideUp">
                {banner.title}
              </h1>
              <p className="mt-6 max-w-md text-sm sm:text-lg font-medium text-white/70 animate-slideUp delay-100">
                {banner.subtitle}
              </p>
              <div className="mt-10 animate-slideUp delay-200">
                <button 
                  onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                  className="bg-white text-(--midnight) px-8 py-4 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all hover:bg-(--silver-mist) active:scale-95"
                >
                  Explore Collection
                </button>
              </div>
            </div>
          </div>
        ))}
        {/* Navigation Dots */}
        <div className="absolute bottom-8 right-8 flex gap-3">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentBanner(i)}
              className={`h-1 transition-all duration-500 rounded-full ${
                currentBanner === i ? "w-12 bg-white" : "w-4 bg-white/20"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Categories Bar */}
      <section className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-md border-b border-(--color-border-tertiary)">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setCategory("")}
              className={`whitespace-nowrap px-6 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${
                category === "" 
                ? "bg-(--midnight) text-white shadow-lg shadow-black/5" 
                : "bg-transparent text-(--color-text-secondary) hover:text-(--midnight)"
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`whitespace-nowrap px-6 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${
                  category === cat 
                  ? "bg-(--midnight) text-white shadow-lg shadow-black/5" 
                  : "bg-transparent text-(--color-text-secondary) hover:text-(--midnight)"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
        
        {/* Flash Sale - Featured Row */}
        {flashSaleProducts.length > 0 && !category && !search && (
          <section className="mb-24">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black tracking-widest text-(--accent-crimson) uppercase mb-1">Limited Offers</p>
                <h2 className="text-3xl font-bold tracking-tight text-(--midnight)">Featured Essentials</h2>
              </div>
              <Link to="/" className="text-[11px] font-bold uppercase tracking-widest text-(--color-text-tertiary) hover:text-(--midnight) transition-colors">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              {flashSaleProducts.map((product) => (
                <div key={product._id} className="group relative">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-(--color-background-secondary) border border-(--color-border-tertiary) transition-all group-hover:border-(--color-border-primary)">
                    <img src={product.image} alt={product.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <button 
                      onClick={() => toggleWishlist(product._id)}
                      className="absolute right-4 top-4 z-10 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center transition-all hover:bg-white active:scale-90"
                    >
                      <span className={wishlist.includes(product._id) ? "text-(--accent-crimson)" : "text-gray-300"}>
                        {wishlist.includes(product._id) ? "❤️" : "🤍"}
                      </span>
                    </button>
                  </div>
                  <Link to={`/product/${product._id}`} className="mt-4 block px-1">
                    <h3 className="text-sm font-bold text-(--midnight) mb-1 group-hover:text-(--accent-crimson) transition-colors">{product.title}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-(--midnight)">₹{product.price.toLocaleString("en-IN")}</span>
                      <span className="text-[11px] text-(--color-text-tertiary) line-through">₹{(product.price + 500).toLocaleString("en-IN")}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Main Grid Section */}
        <section>
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-black tracking-widest text-(--color-text-tertiary) uppercase mb-1">The Collection</p>
              <h2 className="text-3xl font-bold tracking-tight text-(--midnight)">
                {search ? `Searching for "${search}"` : category ? `${category} Designs` : "Browse Everything"}
              </h2>
            </div>
            <div className="relative w-full max-w-sm group">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-3.5 rounded-2xl bg-(--color-background-secondary) border border-(--color-border-tertiary) text-sm font-medium transition-all focus:outline-none focus:border-(--color-border-primary) focus:bg-white focus:ring-4 focus:ring-black/5"
              />
              <span className="absolute left-4.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-(--midnight) transition-colors">🔍</span>
            </div>
          </div>

          {loading && products.length === 0 ? (
            <div className="py-32 flex flex-col items-center justify-center gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-(--midnight) border-t-transparent"></div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-(--color-text-tertiary)">Updating Collection...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-10 sm:gap-y-16">
                {products.map((product) => (
                  <div key={product._id} className="group">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-(--color-background-secondary) border border-(--color-border-tertiary) transition-all group-hover:border-(--color-border-primary) group-hover:shadow-xl group-hover:shadow-black/5">
                      <button 
                        onClick={() => toggleWishlist(product._id)}
                        className="absolute right-4 top-4 z-10 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center transition-all hover:bg-white active:scale-90"
                      >
                        <span className={wishlist.includes(product._id) ? "text-(--accent-crimson)" : "text-gray-300"}>
                          {wishlist.includes(product._id) ? "❤️" : "🤍"}
                        </span>
                      </button>
                      <Link to={`/product/${product._id}`}>
                        <img src={product.image} alt={product.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full transition-transform duration-500 group-hover:translate-y-0 hidden lg:block">
                           <button 
                            onClick={(e) => { e.preventDefault(); addToCart(product._id); }}
                            className="w-full bg-white text-(--midnight) py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest shadow-xl transition-all hover:bg-(--midnight) hover:text-white"
                           >
                            Add to Bag
                           </button>
                        </div>
                      </Link>
                    </div>
                    <div className="mt-6 flex flex-col px-1">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <Link to={`/product/${product._id}`} className="flex-1">
                          <h3 className="text-sm font-bold text-(--midnight) line-clamp-1 group-hover:text-(--accent-crimson) transition-colors">
                            {product.title}
                          </h3>
                        </Link>
                        <span className="text-sm font-bold text-(--midnight)">₹{product.price.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-(--color-text-tertiary)">
                          {product.category}
                        </p>
                        {product.stock <= 5 && product.stock > 0 && (
                          <span className="text-[10px] font-bold text-(--color-text-warning) uppercase tracking-widest">Low Stock</span>
                        )}
                        {product.stock === 0 && (
                          <span className="text-[10px] font-bold text-(--accent-crimson) uppercase tracking-widest">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {products.length === 0 && !loading && (
                <div className="py-32 text-center bg-(--color-background-secondary) rounded-3xl border border-dashed border-(--color-border-tertiary)">
                  <p className="text-3xl mb-4">🔍</p>
                  <h3 className="text-xl font-bold text-(--midnight)">No matches found</h3>
                  <p className="mt-2 text-sm text-(--color-text-secondary)">Try adjusting your search or category filters.</p>
                  <button 
                    onClick={() => { setSearch(""); setCategory(""); }} 
                    className="mt-8 text-[11px] font-bold uppercase tracking-widest text-(--midnight) border-b-2 border-(--midnight) pb-1 hover:text-(--accent-crimson) hover:border-(--accent-crimson) transition-all"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {/* Pagination Section */}
              {totalPages > 1 && (
                <div className="mt-24 flex items-center justify-center gap-4">
                  <button
                    onClick={() => loadProducts(page - 1)}
                    disabled={page === 1}
                    className="h-14 w-14 rounded-2xl border border-(--color-border-tertiary) flex items-center justify-center disabled:opacity-30 hover:bg-(--color-background-secondary) transition-all"
                  >
                    ←
                  </button>
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => loadProducts(p)}
                        className={`h-14 w-14 rounded-2xl text-xs font-bold transition-all ${
                          page === p 
                          ? "bg-(--midnight) text-white shadow-xl shadow-black/10 scale-110" 
                          : "hover:bg-(--color-background-secondary) text-(--color-text-secondary)"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => loadProducts(page + 1)}
                    disabled={page === totalPages}
                    className="h-14 w-14 rounded-2xl border border-(--color-border-tertiary) flex items-center justify-center disabled:opacity-30 hover:bg-(--color-background-secondary) transition-all"
                  >
                    →
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;


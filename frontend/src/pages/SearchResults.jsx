import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Helmet } from "react-helmet-async";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get("/product", {
          params: { search: query },
        });
        setProducts(response.data?.products || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch search results");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) return;
      try {
        const response = await api.get(`/wishlist/${userId}`);
        setWishlist(response.data?.items || []);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      }
    };
    fetchWishlist();
  }, [userId]);

  const toggleWishlist = async (productId) => {
    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      if (wishlist.includes(productId)) {
        await api.delete(`/wishlist/${userId}/${productId}`);
        setWishlist(wishlist.filter((id) => id !== productId));
      } else {
        await api.post(`/wishlist/${userId}`, { productId });
        setWishlist([...wishlist, productId]);
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Search Results for "{query}" | Staky</title>
        <meta name="description" content={`Search results for ${query}`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-black text-gray-900 mb-2">
              Search Results
            </h1>
            <p className="text-lg text-gray-600">
              {query && (
                <>
                  Search results for <span className="font-bold text-gray-900">"{query}"</span>
                </>
              )}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-100 p-6 flex flex-col h-full animate-pulse"
                >
                  <div className="aspect-[4/5] bg-gray-100 mb-8 rounded-sm"></div>
                  <div className="h-4 bg-gray-100 w-1/3 mb-4 rounded-sm"></div>
                  <div className="h-6 bg-gray-100 w-3/4 mb-6 rounded-sm"></div>
                  <div className="mt-auto flex flex-col items-center gap-4">
                    <div className="h-6 bg-gray-100 w-1/4 rounded-sm"></div>
                    <div className="h-12 bg-gray-100 w-full rounded-sm"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-700 font-semibold mb-4">{error}</p>
              <Link
                to="/"
                className="inline-block bg-red-600 text-white px-6 py-3 rounded-sm font-bold hover:bg-red-700 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-lg p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No products found
              </h2>
              <p className="text-gray-600 mb-6">
                We couldn't find any products matching "{query}". Try a different search term.
              </p>
              <Link
                to="/"
                className="inline-block bg-green-600 text-white px-8 py-3 rounded-sm font-bold hover:bg-green-700 transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-8 font-medium">
                Found <span className="font-bold text-gray-900">{products.length}</span> product{products.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className="group bg-white border border-gray-100 hover:border-gray-200 p-6 flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:scale-105"
                  >
                    <div className="aspect-[4/5] relative mb-6 overflow-hidden bg-gray-100 rounded-sm flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = "/placeholder.png";
                        }}
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(product._id);
                        }}
                        className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl z-10 active:scale-90"
                      >
                        <svg
                          className={`w-6 h-6 transition-colors duration-300 ${
                            wishlist.includes(product._id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-400 hover:text-red-500"
                          }`}
                          fill={wishlist.includes(product._id) ? "currentColor" : "none"}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>

                    <p className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-2">
                      {product.category || "Product"}
                    </p>
                    <h3 className="font-bold text-gray-900 mb-4 line-clamp-2 text-sm group-hover:text-green-600 transition-colors">
                      {product.title}
                    </h3>

                    <div className="mt-auto">
                      <div className="flex items-baseline gap-2 mb-4">
                        <p className="text-2xl font-light tracking-tighter text-gray-900">
                          ₹{(product.salePrice || product.price).toLocaleString("en-IN")}
                        </p>
                        {product.salePrice && product.price > product.salePrice && (
                          <p className="text-sm text-gray-400 line-through">
                            ₹{product.price.toLocaleString("en-IN")}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/product/${product._id}`);
                        }}
                        className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-sm hover:from-green-700 hover:to-green-800 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl"
                      >
                        View Details
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchResults;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const categories = ["Electronics", "Fashion", "Home & Kitchen"];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const loadProducts = async () => {
    try {
      const response = await api.get(
        `/product?search=${search.trim()}&category=${category}`,
      );
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [search, category]);

  return (
    <div className="theme-page min-h-screen">
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
        <div className="mb-5 flex items-center gap-2 sm:mb-6 sm:gap-3">
          <div className="min-w-0 flex-1">
            <input
              type="text"
              aria-label="Search products"
              placeholder="Search products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="theme-input w-full rounded-lg bg-(--surface) px-3 py-2 text-sm sm:rounded-xl sm:px-4 sm:py-3 sm:text-base"
            />
          </div>

          <div className="w-28 shrink-0 sm:w-44">
            <select
              aria-label="Filter by category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="theme-input w-full rounded-lg bg-(--surface) px-2.5 py-2 text-sm sm:rounded-xl sm:px-4 sm:py-3 sm:text-base"
            >
              <option value="">All</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
                ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-5 lg:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="group"
            >
              <div className="overflow-hidden rounded-lg border border-(--border) bg-(--surface) sm:rounded-xl">
                <img
                  src={product.image}
                  alt={product.title}
                  className="aspect-square w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <div className="mt-2 px-0.5 sm:mt-3">
                <h2 className="line-clamp-2 text-sm font-medium text-(--text) sm:text-base">
                  {product.title}
                </h2>
                <p className="mt-1 text-sm font-semibold text-(--primary) sm:text-base">
                  Rs. {product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

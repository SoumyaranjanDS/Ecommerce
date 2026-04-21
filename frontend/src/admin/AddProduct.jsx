import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const initialForm = {
  title: "",
  description: "",
  price: "",
  category: "",
  image: "",
  stock: "",
};

const AddProduct = () => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      setError("");
      await api.post("/product/create", {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      setSuccess(true);
      setForm(initialForm);
      
      setTimeout(() => {
        navigate("/admin/products");
      }, 1500);
    } catch (error) {
      console.log("Failed to create product", error);
      setError(error.response?.data?.message || "Failed to create product.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="theme-page min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-(--text)">
            Add New Product
          </h1>
          <p className="theme-text-muted mt-3 text-lg">
            Fill in the product details below to add a new item to your catalog.
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-medium text-green-800">
              ✓ Product added successfully! Redirecting...
            </p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2">
            <div className="theme-card space-y-6 rounded-[28px] p-8">
              {/* Title Field */}
              <div>
                <label className="block text-sm font-semibold text-(--text) mb-2">
                  Product Title <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  placeholder="e.g., Premium Wireless Headphones"
                  onChange={handleChange}
                  className="theme-input w-full rounded-lg px-4 py-3 transition-all duration-200"
                  required
                />
                <p className="theme-text-muted mt-1 text-xs">
                  Give your product a clear, descriptive name
                </p>
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-semibold text-(--text) mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  placeholder="Describe your product features, benefits, and specifications..."
                  onChange={handleChange}
                  className="theme-input w-full rounded-lg px-4 py-3 transition-all duration-200 resize-none"
                  rows="5"
                />
                <p className="theme-text-muted mt-1 text-xs">
                  Detailed descriptions help customers make informed decisions
                </p>
              </div>

              {/* Price and Stock Row */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-(--text) mb-2">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-sm font-medium text-(--text-muted)">
                      $
                    </span>
                    <input
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      placeholder="0.00"
                      onChange={handleChange}
                      className="theme-input w-full rounded-lg py-3 pl-8 pr-4 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-(--text) mb-2">
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    placeholder="0"
                    onChange={handleChange}
                    className="theme-input w-full rounded-lg px-4 py-3 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Category Field */}
              <div>
                <label className="block text-sm font-semibold text-(--text) mb-2">
                  Category
                </label>
                <input
                  name="category"
                  value={form.category}
                  placeholder="e.g., Electronics, Fashion, Home & Garden"
                  onChange={handleChange}
                  className="theme-input w-full rounded-lg px-4 py-3 transition-all duration-200"
                />
                <p className="theme-text-muted mt-1 text-xs">
                  Categorize your product for better organization
                </p>
              </div>

              {/* Image URL Field */}
              <div>
                <label className="block text-sm font-semibold text-(--text) mb-2">
                  Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  name="image"
                  value={form.image}
                  placeholder="https://example.com/image.jpg"
                  onChange={handleChange}
                  className="theme-input w-full rounded-lg px-4 py-3 transition-all duration-200"
                  required
                />
                <p className="theme-text-muted mt-1 text-xs">
                  Paste a direct link to your product image (JPG, PNG, etc.)
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || success}
                className="theme-btn-primary w-full rounded-lg px-6 py-3 font-semibold transition-all duration-200 disabled:opacity-75"
              >
                {isLoading ? "Adding Product..." : success ? "✓ Product Added" : "Add Product"}
              </button>
            </div>
          </form>

          {/* Image Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="theme-card rounded-[28px] p-6">
                <h3 className="mb-4 text-sm font-semibold text-(--text)">
                  Image Preview
                </h3>
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-100 to-slate-200">
                  {form.image ? (
                    <>
                      <img
                        src={form.image}
                        alt="Product preview"
                        className="aspect-square w-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                        onLoad={(e) => {
                          e.target.style.display = "block";
                        }}
                      />
                      <div
                        className="flex aspect-square w-full items-center justify-center text-center"
                        style={{
                          display: !form.image ? "flex" : "none",
                        }}
                      >
                        <div>
                          <p className="text-sm text-(--text-muted)">
                            Invalid image URL
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex aspect-square w-full items-center justify-center">
                      <div className="text-center">
                        <div className="mb-2 text-2xl">🖼️</div>
                        <p className="text-sm text-(--text-muted)">
                          Add an image URL to preview
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Summary */}
                <div className="mt-6 space-y-4 border-t border-slate-200 pt-6">
                  <h4 className="text-sm font-semibold text-(--text)">Summary</h4>

                  {form.title && (
                    <div>
                      <p className="text-xs text-(--text-muted)">Title</p>
                      <p className="text-sm font-medium text-(--text) truncate">
                        {form.title}
                      </p>
                    </div>
                  )}

                  {form.price && (
                    <div>
                      <p className="text-xs text-(--text-muted)">Price</p>
                      <p className="text-sm font-medium text-(--text)">
                        ${Number(form.price).toFixed(2)}
                      </p>
                    </div>
                  )}

                  {form.stock && (
                    <div>
                      <p className="text-xs text-(--text-muted)">In Stock</p>
                      <p className="text-sm font-medium text-(--text)">
                        {form.stock} units
                      </p>
                    </div>
                  )}

                  {form.category && (
                    <div>
                      <p className="text-xs text-(--text-muted)">Category</p>
                      <p className="text-sm font-medium text-(--text)">
                        {form.category}
                      </p>
                    </div>
                  )}

                  {!form.title &&
                    !form.price &&
                    !form.stock &&
                    !form.category && (
                      <p className="text-xs italic text-(--text-muted)">
                        Fill in the form to see a preview
                      </p>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;

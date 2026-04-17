import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";

const initialForm = {
  title: "",
  description: "",
  price: "",
  category: "",
  image: "",
  stock: "",
};

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get(`/product/${id}`);
      const product = response.data?.oneProduct;

      if (!product) {
        setError("Product not found.");
        return;
      }

      setForm({
        title: product.title || "",
        description: product.description || "",
        price: product.price ?? "",
        category: product.category || "",
        image: product.image || "",
        stock: product.stock ?? "",
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      setError(error.response?.data?.message || "Failed to load product.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await api.put(`/product/update/${id}`, {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      alert("Product updated successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      setError(error.response?.data?.message || "Failed to update product.");
    }
  };

  return (
    <div className="theme-page min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="theme-card mx-auto max-w-2xl rounded-[28px] p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-(--text) sm:text-3xl">
          Edit Product
        </h2>
        <p className="theme-text-muted mt-2 text-sm sm:text-base">
          Update the selected product details.
        </p>

        {loading ? (
          <p className="theme-text-muted mt-6 text-sm">Loading product...</p>
        ) : (
          <>
            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Title"
                className="theme-input w-full rounded-2xl px-4 py-3"
                required
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="theme-input min-h-32 w-full rounded-2xl px-4 py-3"
              />
              <input
                name="price"
                type="number"
                min="0"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                className="theme-input w-full rounded-2xl px-4 py-3"
                required
              />
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Category"
                className="theme-input w-full rounded-2xl px-4 py-3"
              />
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Image URL"
                className="theme-input w-full rounded-2xl px-4 py-3"
                required
              />
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                placeholder="Stock"
                className="theme-input w-full rounded-2xl px-4 py-3"
              />

              <button
                type="submit"
                className="theme-btn-primary w-full rounded-full px-6 py-3 font-medium"
              >
                Update Product
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EditProduct;

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
  const navigate = useNavigate();

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
      await api.post("/product/create", {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      alert("Product added successfully!");
      setForm(initialForm);
      navigate("/admin/products");
    } catch (error) {
      console.log("Failed to create product", error);
      setError(error.response?.data?.message || "Failed to create product.");
    }
  };

  return (
    <div className="theme-page min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="theme-card mx-auto max-w-2xl rounded-[28px] p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-(--text) sm:text-3xl">
          Add New Product
        </h1>
        <p className="theme-text-muted mt-2 text-sm sm:text-base">
          Create a new product using the fields below.
        </p>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            name="title"
            value={form.title}
            placeholder="Title"
            onChange={handleChange}
            className="theme-input w-full rounded-2xl px-4 py-3"
            required
          />
          <textarea
            name="description"
            value={form.description}
            placeholder="Description"
            onChange={handleChange}
            className="theme-input min-h-32 w-full rounded-2xl px-4 py-3"
          />
          <input
            name="price"
            type="number"
            min="0"
            value={form.price}
            placeholder="Price"
            onChange={handleChange}
            className="theme-input w-full rounded-2xl px-4 py-3"
            required
          />
          <input
            name="category"
            value={form.category}
            placeholder="Category"
            onChange={handleChange}
            className="theme-input w-full rounded-2xl px-4 py-3"
          />
          <input
            name="image"
            value={form.image}
            placeholder="Image URL"
            onChange={handleChange}
            className="theme-input w-full rounded-2xl px-4 py-3"
            required
          />
          <input
            name="stock"
            type="number"
            min="0"
            value={form.stock}
            placeholder="Stock"
            onChange={handleChange}
            className="theme-input w-full rounded-2xl px-4 py-3"
          />

          <button
            type="submit"
            className="theme-btn-primary w-full rounded-full px-6 py-3 font-medium"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;

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
  const [success, setSuccess] = useState(false);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get(`/product/${id}`);
      const product = response.data?.oneProduct;

      if (!product) {
        setError("Registry record not identified.");
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
      setError("Strategic retrieval failure.");
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
      setSuccess(true);
      setTimeout(() => {
        navigate("/admin/products");
      }, 1500);
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Registry modification failed.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--color-background-primary)">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-(--midnight) border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--color-background-secondary) py-12 px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate('/admin/products')}
          className="mb-12 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-(--color-text-tertiary) hover:text-(--midnight) transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Archive
        </button>

        {/* Header */}
        <div className="mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-(--accent-crimson) mb-3">Inventory Modification</p>
          <h1 className="text-5xl font-bold tracking-tighter text-(--midnight)">Modify Registry</h1>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-10 p-5 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold uppercase tracking-widest text-center animate-fadeIn">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-10 p-5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-[11px] font-bold uppercase tracking-widest text-center animate-fadeIn">
            ✓ Registry Updated. Synchronizing archives...
          </div>
        )}

        <div className="grid gap-16 lg:grid-cols-[1fr_400px]">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="bg-white border border-(--color-border-tertiary) rounded-[40px] p-10 shadow-sm space-y-10">
              
              {/* Title */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-(--midnight) mb-4 opacity-40 ml-1">
                  Unit Identity
                </label>
                <input
                  name="title"
                  value={form.title}
                  placeholder="e.g., ARCHITECTURAL MONOLITH HEADPHONES"
                  onChange={handleChange}
                  className="w-full bg-(--color-background-secondary) border border-(--color-border-tertiary) rounded-2xl px-6 py-4 text-sm font-bold text-(--midnight) placeholder:opacity-20 focus:border-(--midnight) transition-all outline-none"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-(--midnight) mb-4 opacity-40 ml-1">
                  Technical Specifications & Narrative
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  placeholder="Elaborate on technical prowess and design philosophy..."
                  onChange={handleChange}
                  className="w-full bg-(--color-background-secondary) border border-(--color-border-tertiary) rounded-2xl px-6 py-4 text-sm font-bold text-(--midnight) placeholder:opacity-20 focus:border-(--midnight) transition-all outline-none min-h-[200px] resize-none"
                />
              </div>

              {/* Price & Stock */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-(--midnight) mb-4 opacity-40 ml-1">
                    Settlement Value
                  </label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xs font-bold text-(--midnight) opacity-40">₹</span>
                    <input
                      name="price"
                      type="number"
                      value={form.price}
                      placeholder="0.00"
                      onChange={handleChange}
                      className="w-full bg-(--color-background-secondary) border border-(--color-border-tertiary) rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-(--midnight) placeholder:opacity-20 focus:border-(--midnight) transition-all outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-(--midnight) mb-4 opacity-40 ml-1">
                    Current Inventory Index
                  </label>
                  <input
                    name="stock"
                    type="number"
                    value={form.stock}
                    placeholder="0"
                    onChange={handleChange}
                    className="w-full bg-(--color-background-secondary) border border-(--color-border-tertiary) rounded-2xl px-6 py-4 text-sm font-bold text-(--midnight) placeholder:opacity-20 focus:border-(--midnight) transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-(--midnight) mb-4 opacity-40 ml-1">
                  Registry Category
                </label>
                <input
                  name="category"
                  value={form.category}
                  placeholder="e.g., ACOUSTIC ENGINEERING"
                  onChange={handleChange}
                  className="w-full bg-(--color-background-secondary) border border-(--color-border-tertiary) rounded-2xl px-6 py-4 text-sm font-bold text-(--midnight) placeholder:opacity-20 focus:border-(--midnight) transition-all outline-none"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-(--midnight) mb-4 opacity-40 ml-1">
                  Visual Asset Link
                </label>
                <input
                  name="image"
                  value={form.image}
                  placeholder="https://assets.curation.com/asset-01.jpg"
                  onChange={handleChange}
                  className="w-full bg-(--color-background-secondary) border border-(--color-border-tertiary) rounded-2xl px-6 py-4 text-sm font-bold text-(--midnight) placeholder:opacity-20 focus:border-(--midnight) transition-all outline-none"
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={success}
                className="w-full h-16 bg-(--midnight) text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-black/20 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              >
                {success ? "Registry Updated" : "Commit Modifications"}
              </button>
            </div>
          </form>

          {/* Visual Preview */}
          <div className="sticky top-32">
            <div className="bg-white border border-(--color-border-tertiary) rounded-[40px] p-8 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-(--midnight) mb-8 opacity-40 ml-1">
                Registry Preview
              </h3>
              
              <div className="aspect-square w-full rounded-[32px] overflow-hidden bg-(--color-background-secondary) border border-(--color-border-tertiary) relative group">
                {form.image ? (
                  <img
                    src={form.image}
                    alt=""
                    className="h-full w-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <span className="text-4xl opacity-10">🖼️</span>
                  </div>
                )}
              </div>

              <div className="mt-10 space-y-8">
                <div>
                  <p className="text-[9px] font-black text-(--color-text-tertiary) uppercase tracking-widest mb-1">Identity</p>
                  <p className="text-lg font-bold text-(--midnight) leading-tight">{form.title || "Pending Registry"}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-(--color-border-tertiary)">
                  <div>
                    <p className="text-[9px] font-black text-(--color-text-tertiary) uppercase tracking-widest mb-1">Settlement</p>
                    <p className="text-sm font-bold text-(--midnight)">₹{form.price ? Number(form.price).toLocaleString() : "0"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-(--color-text-tertiary) uppercase tracking-widest mb-1">Inventory</p>
                    <p className="text-sm font-bold text-(--midnight)">{form.stock || "0"} UNITS</p>
                  </div>
                </div>

                <div>
                  <p className="text-[9px] font-black text-(--color-text-tertiary) uppercase tracking-widest mb-1">Classification</p>
                  <p className="text-xs font-bold text-(--midnight) uppercase tracking-wider">{form.category || "UNCLASSIFIED"}</p>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-(--color-border-tertiary) flex items-center gap-3 opacity-20">
                 <div className="h-1.5 w-1.5 rounded-full bg-(--midnight)"></div>
                 <p className="text-[8px] font-bold uppercase tracking-[0.4em]">Administrative Preview Mode</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;

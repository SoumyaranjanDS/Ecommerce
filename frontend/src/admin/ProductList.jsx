import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/product");
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError("Inventory retrieval failed.");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Permanently purge this unit from inventory?")) return;
    try {
      await api.delete(`/product/delete/${id}`);
      await loadProducts();
    } catch (err) {
      console.log("Error deleting product", err);
      setError("Unit purge failed.");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

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
        
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-(--accent-crimson) mb-3">Inventory Analytics</p>
            <h1 className="text-5xl font-bold tracking-tighter text-(--midnight)">Unit Archive</h1>
          </div>
          <Link
            to="/admin/add-product"
            className="h-14 px-8 bg-(--midnight) text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10 transition-all hover:opacity-90 flex items-center justify-center"
          >
            Register Unit
          </Link>
        </div>

        {error && (
          <div className="mb-10 p-5 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold uppercase tracking-widest text-center animate-fadeIn">
            {error}
          </div>
        )}

        <div className="bg-white border border-(--color-border-tertiary) rounded-[40px] overflow-hidden shadow-sm">
          {products.length === 0 ? (
            <div className="p-24 text-center">
              <p className="text-3xl mb-6">📦</p>
              <p className="text-sm font-medium text-(--color-text-tertiary)">The inventory registry is currently empty.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-(--color-background-secondary)">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-(--color-text-tertiary) text-left border-b border-(--color-border-tertiary)">
                      Unit Identity
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-(--color-text-tertiary) text-left border-b border-(--color-border-tertiary)">
                      Category
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-(--color-text-tertiary) text-left border-b border-(--color-border-tertiary)">
                      Settlement Value
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-(--color-text-tertiary) text-left border-b border-(--color-border-tertiary)">
                      Inventory Index
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-(--color-text-tertiary) text-right border-b border-(--color-border-tertiary)">
                      Control
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="group border-b border-(--color-border-tertiary) last:border-b-0 hover:bg-(--color-background-secondary) transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg overflow-hidden border border-(--color-border-tertiary) bg-(--color-background-secondary)">
                            <img src={product.image} alt="" className="h-full w-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                          </div>
                          <p className="text-sm font-bold text-(--midnight) truncate max-w-[250px]">
                            {product.title}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-bold text-(--color-text-tertiary) uppercase tracking-widest">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-(--midnight)">
                          ₹{Number(product.price).toLocaleString()}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                           <div className={`h-1.5 w-1.5 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                           <p className="text-xs font-bold text-(--midnight)">{product.stock} units</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="h-10 px-4 flex items-center justify-center border border-(--color-border-tertiary) rounded-lg text-[9px] font-black uppercase tracking-widest text-(--midnight) hover:bg-(--midnight) hover:text-white transition-all"
                          >
                            Modify
                          </Link>
                          <button
                            type="button"
                            onClick={() => deleteProduct(product._id)}
                            className="h-10 w-10 flex items-center justify-center bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;

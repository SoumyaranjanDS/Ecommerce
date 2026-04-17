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
      setError(err.response?.data?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/product/delete/${id}`);
      alert("Product deleted successfully!");
      await loadProducts();
    } catch (err) {
      console.log("Error deleting product", err);
      setError(err.response?.data?.message || "Failed to delete product.");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="theme-page min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="theme-card mb-6 flex flex-col gap-4 rounded-[28px] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-(--text) sm:text-3xl">
              Product List
            </h2>
            <p className="theme-text-muted mt-2 text-sm sm:text-base">
              Manage your products from one place.
            </p>
          </div>

          <Link
            to="/admin/products/add"
            className="theme-btn-primary inline-flex items-center justify-center rounded-full px-5 py-3 font-medium"
          >
            Add New Product
          </Link>
        </div>

        <div className="theme-card overflow-hidden rounded-[28px]">
          {loading ? (
            <div className="p-6 text-center text-sm text-(--text-muted)">
              Loading products...
            </div>
          ) : error ? (
            <div className="p-6 text-center text-sm text-red-500">{error}</div>
          ) : products.length === 0 ? (
            <div className="p-6 text-center text-sm text-(--text-muted)">
              No products found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-160 border-collapse">
                <thead>
                  <tr className="bg-(--surface-soft) text-left">
                    <th className="border-b border-(--border) px-5 py-4 text-sm font-semibold text-(--text)">
                      Title
                    </th>
                    <th className="border-b border-(--border) px-5 py-4 text-sm font-semibold text-(--text)">
                      Price
                    </th>
                    <th className="border-b border-(--border) px-5 py-4 text-sm font-semibold text-(--text)">
                      Stock
                    </th>
                    <th className="border-b border-(--border) px-5 py-4 text-sm font-semibold text-(--text)">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-(--border) last:border-b-0"
                    >
                      <td className="px-5 py-4 text-sm text-(--text)">
                        {product.title}
                      </td>
                      <td className="px-5 py-4 text-sm text-(--text)">
                        Rs. {Number(product.price).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-sm text-(--text)">
                        {product.stock}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-3">
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="inline-flex items-center rounded-full border border-(--border) px-4 py-2 text-sm font-medium text-(--primary) transition hover:bg-(--surface-soft)"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => deleteProduct(product._id)}
                            className="theme-btn-accent rounded-full px-4 py-2 text-sm font-medium"
                          >
                            Delete
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

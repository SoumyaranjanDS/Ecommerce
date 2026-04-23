import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const [cartMessageType, setCartMessageType] = useState("success");
  const [isAdding, setIsAdding] = useState(false);

  const getProductDetails = async () => {
    const response = await api.get(`/product/${id}`);
    setProduct(response.data);
  };

  useEffect(() => {
    getProductDetails();
  }, [id]);

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setCartMessageType("error");
      setCartMessage("Please login to add items to cart.");
      return;
    }

    try {
      setIsAdding(true);
      setCartMessage("");

      const response = await api.post("/cart/add", {
        userId,
        productId: id,
      });

      window.dispatchEvent(new Event("cartUpdate"));
      setCartMessageType("success");
      setCartMessage(response.data?.message || "Product added to cart.");
    } catch (error) {
      console.error(error);
      setCartMessageType("error");
      setCartMessage("Unable to add this product right now.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div>
      {product ? (
        <div className="theme-page min-h-screen">
          <div className="mx-auto max-w-7xl px-3 py-5 sm:px-5 sm:py-8 lg:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
              <div className="theme-card w-full overflow-hidden rounded-2xl border border-(--border) p-3 sm:p-4 lg:w-[46%]">
                <div className="overflow-hidden rounded-xl bg-(--surface-soft)">
                  <img
                    src={product.oneProduct.image}
                    alt={product.oneProduct.title}
                    className="aspect-square w-full object-cover"
                  />
                </div>
              </div>

              <div className="theme-card w-full rounded-2xl border border-(--border) p-5 sm:p-6 lg:w-[54%]">
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-(--text-muted) sm:text-sm">
                  {product.oneProduct.category}
                </p>
                <h1 className="text-2xl font-bold text-(--text) sm:text-3xl">
                  {product.oneProduct.title}
                </h1>

                <div className="mt-5 rounded-2xl bg-(--surface-soft) px-4 py-3">
                  <p className="text-sm text-(--text-muted)">Price</p>
                  <p className="mt-1 text-2xl font-semibold text-(--primary) sm:text-3xl">
                    Rs. {product.oneProduct.price}
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-(--text-muted)">
                      Description
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-(--text) sm:text-base">
                      {product.oneProduct.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-(--border) bg-(--surface) px-4 py-3">
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-(--text-muted)">
                        Category
                      </p>
                      <p className="mt-2 text-sm font-medium text-(--text) sm:text-base">
                        {product.oneProduct.category}
                      </p>
                    </div>

                    <div className="rounded-xl border border-(--border) bg-(--surface) px-4 py-3">
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-(--text-muted)">
                        Availability
                      </p>
                      <p className="mt-2 text-sm font-medium text-(--text) sm:text-base">
                        {product.oneProduct.stock > 0 ? "In Stock" : "Out of Stock"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="theme-btn-primary w-full rounded-xl px-5 py-3 text-sm font-semibold shadow-[0_14px_30px_rgba(37,99,235,0.18)] transition hover:shadow-[0_18px_34px_rgba(37,99,235,0.24)] sm:w-auto"
                  >
                    {isAdding ? "Adding..." : "Add to cart"}
                  </button>

                  {cartMessage ? (
                    <p
                      className={`text-sm font-medium ${
                        cartMessageType === "error"
                          ? "text-red-600"
                          : "text-(--primary)"
                      }`}
                    >
                      {cartMessage}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="theme-page flex min-h-screen items-center justify-center px-4">
          <p className="text-center text-sm text-(--text-muted) sm:text-base">
            Loading product details...
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;

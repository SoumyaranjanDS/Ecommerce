import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ProductReviews from "../components/ProductReviews";

import { useQuery } from "@tanstack/react-query";

const ProductDetails = () => {
  const { id } = useParams();
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [isAdding, setIsAdding] = useState(false);
  const [userOrder, setUserOrder] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // Use TanStack Query for product details
  const { data: product, isLoading, error: queryError } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await api.get(`/product/${id}`);
      return response.data.oneProduct;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  // Fetch recommendations separately (could also be a query)
  const [recommendations, setRecommendations] = useState([]);
  useEffect(() => {
    if (product?.category) {
      const fetchRecs = async () => {
        try {
          const recRes = await api.get(`/product?category=${product.category}&limit=6`);
          setRecommendations((recRes.data.products || []).filter(p => p._id !== id));
        } catch (err) {
          console.error(err);
        }
      };
      fetchRecs();
    }
  }, [product, id]);

  const findUserOrder = async () => {
    if (!userId) return;
    try {
      const response = await api.get(`/order/user/${userId}`);
      const orders = response.data.orders || [];
      for (const order of orders) {
        if (order.products.some((p) => p.productId?._id === id)) {
          setUserOrder(order);
          break;
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    findUserOrder();
    window.scrollTo(0, 0);
  }, [id, userId]);

  const handleAddToCart = async () => {
    if (!userId) {
      alert("Please login to add items to cart.");
      return false;
    }
    if (product.stock === 0) return false;

    try {
      setIsAdding(true);
      await api.post("/cart/add", { userId, productId: id });
      window.dispatchEvent(new Event("cartUpdate"));
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  const colors = ["#0F0F1A", "#FFFFFF", "#CBD5E1", "#E94560"];
  const sizes = ["XS", "S", "M", "L", "XL"];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--color-background-primary)">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-(--midnight) border-t-transparent"></div>
      </div>
    );
  }

  if (queryError || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-(--color-background-primary) p-6">
        <h2 className="text-2xl font-bold text-gray-400 mb-4">Archive Unit Not Found</h2>
        <Link to="/" className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-1">Return to Archive</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--flipkart-bg) pb-12">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 py-4">
        
        {/* Main Content Box */}
        <div className="bg-white shadow-sm flex flex-col lg:flex-row gap-8 p-4 sm:p-8 min-h-[600px]">
          
          {/* Left Side: Images & Primary Actions */}
          <div className="lg:w-[40%] space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="aspect-square border border-gray-100 flex items-center justify-center p-4 bg-white">
                <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || product.stock === 0}
                  className={`flex-1 py-4 rounded-sm text-sm font-bold uppercase flex items-center justify-center gap-2 transition-all ${
                    product.stock === 0 
                    ? "bg-gray-200 text-gray-500" 
                    : "bg-(--flipkart-yellow) text-(--flipkart-text-primary) shadow-sm hover:brightness-95"
                  }`}
                >
                  🛒 {isAdding ? "Adding..." : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
                <button
                  onClick={async () => {
                    const success = await handleAddToCart();
                    if (success) navigate("/cart");
                  }}
                  disabled={product.stock === 0 || isAdding}
                  className={`flex-1 py-4 rounded-sm text-sm font-bold uppercase flex items-center justify-center gap-2 transition-all ${
                    product.stock === 0 
                    ? "bg-gray-100 text-gray-400" 
                    : "bg-[#fb641b] text-white shadow-sm hover:brightness-95"
                  }`}
                >
                  ⚡ {isAdding ? "Wait..." : "Buy Now"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Product Info */}
          <div className="lg:w-[60%] flex flex-col">
            <nav className="flex items-center gap-2 mb-4 text-xs font-medium text-gray-400">
              <Link to="/" className="hover:text-(--flipkart-blue)">Home</Link>
              <span>/</span>
              <span className="hover:text-(--flipkart-blue)">{product.category}</span>
            </nav>

            <h1 className="text-xl font-medium text-(--flipkart-text-primary) mb-2">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1 bg-(--flipkart-green) text-white text-xs font-bold px-2 py-0.5 rounded-sm">
                4.2 <span>★</span>
              </div>
              <span className="text-sm font-bold text-(--flipkart-text-secondary)">2,456 Ratings & 481 Reviews</span>
            </div>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl font-bold text-(--flipkart-text-primary)">₹{product.price.toLocaleString("en-IN")}</span>
              <span className="text-base text-(--flipkart-text-secondary) line-through">₹{(product.price + 500).toLocaleString("en-IN")}</span>
              <span className="text-base font-bold text-(--flipkart-green)">15% off</span>
            </div>

            <div className="space-y-6 mb-8">
               <div className="space-y-2">
                  <p className="text-sm font-bold text-(--flipkart-text-primary)">Available Offers</p>
                  <ul className="space-y-2">
                     <li className="text-sm flex items-start gap-2">
                        <span className="text-(--flipkart-green)">🏷️</span>
                        <span><b>Bank Offer</b> 10% instant discount on Cards up to ₹1,000. <span className="text-(--flipkart-blue) font-bold cursor-pointer">T&C</span></span>
                     </li>
                     <li className="text-sm flex items-start gap-2">
                        <span className="text-(--flipkart-green)">🏷️</span>
                        <span><b>Combo Offer</b> Buy 2 or more and get 5% off. <span className="text-(--flipkart-blue) font-bold cursor-pointer">See all T&C</span></span>
                     </li>
                  </ul>
               </div>

               <div className="flex items-start gap-10 py-6 border-y border-gray-100">
                  <div className="space-y-4">
                     <p className="text-sm text-(--flipkart-text-secondary) font-bold">Delivery</p>
                     <div className="flex items-center border-b-2 border-(--flipkart-blue) pb-1">
                        <span className="mr-2">📍</span>
                        <input type="text" placeholder="Enter Pincode" className="text-sm font-bold outline-none" />
                        <button className="text-(--flipkart-blue) text-sm font-bold">Check</button>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <p className="text-sm font-bold text-(--flipkart-text-primary)">Delivery by 12 May, Tuesday</p>
                     <p className="text-xs text-(--flipkart-text-secondary)">Free Delivery on orders above ₹500</p>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               <h3 className="text-lg font-bold text-(--flipkart-text-primary)">Product Description</h3>
               <p className="text-sm text-(--flipkart-text-secondary) leading-relaxed">
                  {product.description}
               </p>
            </div>

            {/* Specifications (Mock) */}
            <div className="mt-10 space-y-4">
               <h3 className="text-lg font-bold text-(--flipkart-text-primary)">Specifications</h3>
               <div className="border border-gray-100 rounded-sm">
                  <table className="w-full text-sm">
                     <tbody>
                        <tr className="border-b border-gray-50">
                           <td className="p-4 text-gray-400 w-1/3">Model Name</td>
                           <td className="p-4 text-(--flipkart-text-primary)">Premium {product.category} Edition</td>
                        </tr>
                        <tr className="border-b border-gray-50">
                           <td className="p-4 text-gray-400">Color</td>
                           <td className="p-4 text-(--flipkart-text-primary)">Midnight Black</td>
                        </tr>
                        <tr>
                           <td className="p-4 text-gray-400">Connectivity</td>
                           <td className="p-4 text-(--flipkart-text-primary)">Universal Compatible</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-4 bg-white shadow-sm p-8">
           <h2 className="text-2xl font-bold text-(--flipkart-text-primary) mb-8">Ratings & Reviews</h2>
           <ProductReviews productId={id} orderId={userOrder?._id} />
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-4 bg-white shadow-sm p-8">
            <h2 className="text-xl font-bold text-(--flipkart-text-primary) mb-8 flex items-center justify-between">
              You might be interested in
              <Link to="/" className="text-sm text-(--flipkart-blue) font-bold">VIEW ALL</Link>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {recommendations.map(item => (
                <Link key={item._id} to={`/product/${item._id}`} className="group flex flex-col items-center">
                  <div className="h-32 w-full mb-3 flex items-center justify-center p-2 bg-gray-50 rounded-sm overflow-hidden">
                    <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-xs font-medium text-(--flipkart-text-primary) line-clamp-1 group-hover:text-(--flipkart-blue)">{item.title}</h3>
                  <p className="text-xs font-bold text-(--flipkart-text-primary) mt-1">₹{item.price.toLocaleString("en-IN")}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;

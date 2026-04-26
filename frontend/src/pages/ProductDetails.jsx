import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import ProductReviews from "../components/ProductReviews";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [isAdding, setIsAdding] = useState(false);
  const [userOrder, setUserOrder] = useState(null);

  const userId = localStorage.getItem("userId");

  const getProductDetails = async () => {
    try {
      const response = await api.get(`/product/${id}`);
      const data = response.data.oneProduct;
      setProduct(data);
      
      if (data.category) {
        const recRes = await api.get(`/product?category=${data.category}&limit=6`);
        setRecommendations((recRes.data.products || []).filter(p => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const findUserOrder = async () => {
    if (!userId) return;
    try {
      const response = await api.get(`/order/user/${userId}`);
      const orders = response.data || [];
      for (const order of orders) {
        if (order.products.some((p) => p.productId._id === id)) {
          setUserOrder(order);
          break;
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getProductDetails();
    findUserOrder();
    window.scrollTo(0, 0);
  }, [id, userId]);

  const handleAddToCart = async () => {
    if (!userId) {
      alert("Please login to add items to cart.");
      return;
    }
    if (product.stock === 0) return;

    try {
      setIsAdding(true);
      await api.post("/cart/add", { userId, productId: id });
      window.dispatchEvent(new Event("cartUpdate"));
    } catch (error) {
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  const colors = ["#0F0F1A", "#FFFFFF", "#CBD5E1", "#E94560"];
  const sizes = ["XS", "S", "M", "L", "XL"];

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--color-background-primary)">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-(--midnight) border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--color-background-primary) pb-24 lg:pb-12">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        
        {/* Breadcrumbs (Minimalist) */}
        <nav className="flex items-center gap-2 mb-12 text-[10px] font-bold uppercase tracking-widest text-(--color-text-tertiary)">
          <Link to="/" className="hover:text-(--midnight)">Home</Link>
          <span>/</span>
          <Link to="/" className="hover:text-(--midnight)">{product.category}</Link>
          <span>/</span>
          <span className="text-(--midnight)">{product.title}</span>
        </nav>

        <div className="grid gap-16 lg:grid-cols-2 items-start">
          
          {/* Main Product Image */}
          <div className="sticky top-32 space-y-6">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-(--color-background-secondary) border border-(--color-border-tertiary) shadow-2xl shadow-black/5">
              <img src={product.image} alt={product.title} className="w-full h-full object-cover transition-all hover:scale-105 duration-700" />
            </div>
            {/* Gallery Thumbnails (Mock) */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-(--color-background-secondary) border border-(--color-border-tertiary) opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                  <img src={product.image} alt="view" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Actions & Details */}
          <div className="flex flex-col pt-4 lg:pt-0">
            <div className="mb-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-(--accent-crimson) mb-3">Premium Selection</p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-(--midnight) leading-tight mb-6">
                {product.title}
              </h1>
              <div className="flex items-center gap-6">
                <span className="text-3xl font-bold text-(--midnight)">₹{product.price.toLocaleString("en-IN")}</span>
                <span className="h-6 w-px bg-(--color-border-primary)"></span>
                <div className="flex items-center gap-2">
                   <div className="flex text-amber-400 text-xs">★★★★★</div>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-(--color-text-tertiary)">(48 Reviews)</span>
                </div>
              </div>
            </div>

            {/* Selection Controls */}
            <div className="space-y-12">
              {/* Color Selector */}
              <div>
                <div className="flex justify-between items-center mb-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-(--midnight)">Color Selection</p>
                  <span className="text-[10px] font-bold text-(--color-text-tertiary) uppercase tracking-widest">Natural Tone</span>
                </div>
                <div className="flex gap-4">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`group relative h-12 w-12 rounded-full border border-(--color-border-tertiary) transition-all p-1 ${
                        selectedColor === color ? "scale-110 shadow-lg shadow-black/5" : ""
                      }`}
                    >
                      <div className={`w-full h-full rounded-full border border-black/5 shadow-inner transition-all ${selectedColor === color ? "ring-2 ring-(--midnight) ring-offset-2" : ""}`} style={{ backgroundColor: color }}></div>
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity">Variant</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <div className="flex justify-between items-center mb-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-(--midnight)">Select Size</p>
                  <button className="text-[10px] font-bold text-(--color-text-tertiary) uppercase tracking-widest border-b border-transparent hover:border-(--color-text-tertiary) transition-all">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-14 min-w-[70px] rounded-xl text-xs font-bold transition-all border ${
                        selectedSize === size 
                        ? "bg-(--midnight) text-white border-(--midnight) shadow-xl shadow-black/10 scale-105" 
                        : "bg-white text-(--midnight) border-(--color-border-tertiary) hover:border-(--midnight)"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop Add to Bag */}
            <div className="mt-16 hidden lg:block">
              <button
                onClick={handleAddToCart}
                disabled={isAdding || product.stock === 0}
                className={`w-full py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] transition-all shadow-2xl ${
                  product.stock === 0 
                  ? "bg-(--color-background-secondary) text-(--color-text-tertiary) cursor-not-allowed" 
                  : "bg-(--midnight) text-white hover:opacity-95 active:scale-[0.98] shadow-black/10"
                }`}
              >
                {isAdding ? "Processing..." : product.stock === 0 ? "Out of Stock" : "Add to Shopping Bag"}
              </button>
              {product.stock > 0 && (
                <p className="mt-4 text-[10px] text-center font-bold text-(--color-text-tertiary) uppercase tracking-widest">
                  Secure checkout • Worldwide delivery
                </p>
              )}
            </div>

            {/* Product Meta Info (Accordions) */}
            <div className="mt-16 border-t border-(--color-border-tertiary)">
              {[
                { id: "description", label: "Product Description", content: product.description },
                { id: "shipping", label: "Shipping & Returns", content: "We offer complimentary express shipping on all orders over ₹5,000. Returns are accepted within 7 days of delivery for a full refund or exchange." },
                { id: "care", label: "Materials & Care", content: "Handcrafted using premium sustainable materials. Handle with care to ensure longevity of the design aesthetic." },
              ].map(section => (
                <div key={section.id} className="border-b border-(--color-border-tertiary)">
                  <button
                    onClick={() => setActiveTab(activeTab === section.id ? "" : section.id)}
                    className="flex w-full items-center justify-between py-6 text-left group"
                  >
                    <span className="text-[11px] font-bold uppercase tracking-widest text-(--midnight) group-hover:pl-2 transition-all">{section.label}</span>
                    <span className="text-xl font-light text-(--color-text-tertiary)">{activeTab === section.id ? "−" : "+"}</span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${activeTab === section.id ? "max-h-64 pb-8" : "max-h-0"}`}>
                    <p className="text-sm leading-relaxed text-(--color-text-secondary) font-medium italic opacity-80">{section.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations Row */}
        {recommendations.length > 0 && (
          <section className="mt-32">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-(--color-text-tertiary) mb-1">More to explore</p>
                <h2 className="text-3xl font-bold tracking-tight text-(--midnight)">Pairs well with</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {recommendations.map(item => (
                <Link key={item._id} to={`/product/${item._id}`} className="group block">
                  <div className="aspect-[4/5] rounded-xl overflow-hidden bg-(--color-background-secondary) border border-(--color-border-tertiary) mb-4 transition-all group-hover:border-(--color-border-primary)">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-all group-hover:scale-105" />
                  </div>
                  <h3 className="text-[11px] font-bold text-(--midnight) line-clamp-1 group-hover:text-(--accent-crimson) transition-colors">{item.title}</h3>
                  <p className="text-[10px] font-bold text-(--color-text-tertiary) mt-1 uppercase">₹{item.price.toLocaleString("en-IN")}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Feedback Section */}
        <section id="reviews" className="mt-32 pt-24 border-t border-(--color-border-tertiary)">
          <div className="mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-(--color-text-tertiary) mb-2 text-center">The Community</p>
            <h2 className="text-4xl font-bold tracking-tight text-(--midnight) text-center">Client Impressions</h2>
          </div>
          <ProductReviews productId={id} orderId={userOrder?._id} />
        </section>
      </div>

      {/* Mobile Interaction Bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white/95 backdrop-blur-xl border-t border-(--color-border-tertiary) p-5 lg:hidden">
        <div className="flex items-center gap-6">
          <div className="flex flex-col shrink-0">
            <span className="text-[9px] font-bold uppercase tracking-widest text-(--color-text-tertiary) mb-0.5">Value</span>
            <span className="text-lg font-bold text-(--midnight)">₹{product.price.toLocaleString("en-IN")}</span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.stock === 0}
            className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl ${
              product.stock === 0 
              ? "bg-(--color-background-secondary) text-(--color-text-tertiary)" 
              : "bg-(--midnight) text-white shadow-black/10"
            }`}
          >
            {isAdding ? "Wait..." : product.stock === 0 ? "Out" : "Add to Bag"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

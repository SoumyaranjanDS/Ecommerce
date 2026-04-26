import React, { useState, useEffect } from "react";
import api from "../api/axios";

const ProductReviews = ({ productId, orderId = null }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/review/product/${productId}`);
      setReviews(response.data.reviews || []);
      setAvgRating(response.data.averageRating || 0);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await api.post("/review/create", {
        productId,
        orderId,
        rating: parseInt(rating),
        comment,
      });

      setComment("");
      setRating(5);
      setShowForm(false);
      fetchReviews();
    } catch (err) {
      const message = err.response?.data?.message || "Registry entry failed.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false) => {
    return (
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setRating(star)}
            className={`text-sm transition-all ${interactive ? 'hover:scale-125' : ''} ${
              star <= (interactive ? rating : Math.round(rating)) ? "text-(--midnight)" : "text-(--color-border-primary)"
            }`}
          >
            {star <= (interactive ? rating : Math.round(rating)) ? "●" : "○"}
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="animate-pulse space-y-6">
      <div className="h-2 w-32 bg-(--color-border-tertiary) rounded-full"></div>
      <div className="h-32 bg-(--color-background-secondary) rounded-3xl border border-(--color-border-tertiary)"></div>
    </div>;
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between bg-white p-10 rounded-[40px] shadow-sm border border-(--color-border-tertiary)">
        <div className="flex items-center gap-10">
          <div className="text-center px-8 py-6 bg-(--color-background-secondary) rounded-3xl border border-(--color-border-tertiary)">
            <p className="text-4xl font-bold tracking-tighter text-(--midnight)">{avgRating.toFixed(1)}</p>
            <p className="text-[9px] font-black uppercase text-(--color-text-tertiary) tracking-[0.2em] mt-2">Aggregate</p>
          </div>
          <div>
            {renderStars(avgRating)}
            <p className="text-[10px] font-bold text-(--color-text-tertiary) uppercase tracking-[0.2em] mt-4">
              Validated {reviews.length} critiques
            </p>
          </div>
        </div>

        {userId && orderId && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="h-14 px-8 bg-(--midnight) text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-black/10 transition-all hover:opacity-90 active:scale-95"
          >
            Register Critique
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmitReview} className="bg-white space-y-10 rounded-[40px] p-10 shadow-2xl shadow-black/5 border border-(--color-border-tertiary) animate-slideUp">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-(--midnight)">New Critique Registry</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-[9px] font-black text-(--color-text-tertiary) uppercase tracking-widest hover:text-red-500 transition-colors">Abort</button>
          </div>

          {error && (
            <div className="rounded-2xl bg-red-50 p-5 text-red-600 text-[10px] font-bold uppercase tracking-widest border border-red-100 text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-(--color-text-tertiary) mb-4 ml-1">
              Assessment Index
            </label>
            <div className="p-6 bg-(--color-background-secondary) rounded-2xl border border-(--color-border-tertiary) inline-block">
               {renderStars(rating, true)}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-(--color-text-tertiary) mb-4 ml-1">
              Analytical Narrative
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Provide a detailed evaluation of unit performance..."
              maxLength="500"
              rows="4"
              className="w-full bg-(--color-background-secondary) border border-(--color-border-tertiary) rounded-2xl p-6 text-sm font-bold text-(--midnight) placeholder:opacity-20 focus:border-(--midnight) transition-all outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-16 bg-(--midnight) text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-black/10 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
          >
            {submitting ? "Synchronizing..." : "Commit Critique"}
          </button>
        </form>
      )}

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-24 bg-(--color-background-secondary) rounded-[40px] border border-dashed border-(--color-border-tertiary)">
             <p className="text-[10px] font-bold text-(--color-text-tertiary) uppercase tracking-[0.3em]">No critiques registered for this unit.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-[32px] p-8 shadow-sm border border-(--color-border-tertiary) flex flex-col sm:flex-row gap-8 group hover:border-(--midnight) transition-all duration-500"
            >
              <div className="h-16 w-16 rounded-2xl bg-(--color-background-secondary) flex items-center justify-center text-xl font-bold text-(--midnight) shrink-0 group-hover:bg-(--midnight) group-hover:text-white transition-all duration-500 border border-(--color-border-tertiary)">
                {review.userId?.name?.charAt(0) || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="text-md font-bold text-(--midnight) truncate mb-1">
                      {review.userId?.name || "Anonymous Profile"}
                    </p>
                    <p className="text-[9px] font-black text-(--color-text-tertiary) uppercase tracking-[0.2em]">
                      {new Date(review.createdAt).toLocaleDateString("en-GB", { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  {renderStars(review.rating)}
                </div>

                {review.comment && (
                  <p className="text-sm font-medium leading-relaxed text-(--color-text-secondary) mt-6 border-l-2 border-(--color-border-tertiary) pl-6 italic">"{review.comment}"</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export default ProductReviews;

"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductReview } from "@/types";

interface ReviewSectionProps {
  reviews: ProductReview[];
}

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={12}
          className={cn(
            i < rating ? "fill-bloomsy-black text-bloomsy-black" : "text-black/20"
          )}
        />
      ))}
    </div>
  );
}

export default function ReviewSection({ reviews }: ReviewSectionProps) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const avg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Mock submission — no real backend
    setSubmitted(true);
    setName("");
    setComment("");
    setRating(5);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-4">
          <span className="font-display text-4xl font-light">{avg.toFixed(1)}</span>
          <div>
            <StarRating rating={Math.round(avg)} />
            <p className="text-xs text-black/40 mt-1">{reviews.length} reseña{reviews.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
      )}

      {/* Review list */}
      {reviews.length > 0 && (
        <ul className="space-y-6">
          {reviews.map((review, i) => (
            <li key={i} className="border-b border-black/10 pb-6 last:border-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <p className="text-sm font-medium">{review.author}</p>
                  <p className="text-[10px] text-black/40">{review.date}</p>
                </div>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-sm text-black/70 leading-relaxed">{review.comment}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Form */}
      <div className="border-t border-black/10 pt-8">
        <p className="text-[10px] tracking-widest uppercase text-black/40 mb-5">
          Deja tu reseña
        </p>

        {submitted ? (
          <p className="text-sm text-black/60">
            ¡Gracias por tu reseña! Será publicada pronto.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star picker */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  aria-label={`${star} estrellas`}
                >
                  <Star
                    size={18}
                    className={cn(
                      "transition-colors",
                      star <= rating
                        ? "fill-bloomsy-black text-bloomsy-black"
                        : "text-black/20 hover:text-black/40"
                    )}
                  />
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-black/20 bg-transparent px-3 py-2.5 text-sm focus:outline-none focus:border-bloomsy-black placeholder:text-black/30"
            />

            <textarea
              placeholder="¿Qué te pareció el producto?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={4}
              className="w-full border border-black/20 bg-transparent px-3 py-2.5 text-sm focus:outline-none focus:border-bloomsy-black placeholder:text-black/30 resize-none"
            />

            <button
              type="submit"
              className="bg-bloomsy-black text-bloomsy-cream text-[11px] tracking-widest uppercase px-8 py-3 hover:bg-bloomsy-gray transition-colors"
            >
              Enviar reseña
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

import { Star } from "lucide-react";

export function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i < Math.round(rating) ? "fill-yellow-500 text-yellow-500" : "text-[#333344]"
          }`}
        />
      ))}
      <span className="ml-1 text-sm text-[#9090a8]">{rating.toFixed(1)}</span>
    </span>
  );
}

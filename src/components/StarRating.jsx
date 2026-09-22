import { Star } from 'lucide-react';
import { useState } from 'react';

export default function StarRating({ rating = 0, onRate, size = 28, interactive = true }) {
  const [hovered, setHovered] = useState(0);

  const handleKeyDown = (e, star) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onRate) onRate(star);
    }
  };

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = interactive
          ? star <= (hovered || rating)
          : star <= Math.round(rating);

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={star === rating}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            tabIndex={interactive ? 0 : -1}
            className={`transition-all duration-150 ${
              interactive
                ? 'cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cine-amber/50 rounded'
                : 'cursor-default'
            }`}
            onClick={() => interactive && onRate && onRate(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            onKeyDown={(e) => interactive && handleKeyDown(e, star)}
            disabled={!interactive}
          >
            <Star
              size={size}
              className={`transition-colors duration-150 ${
                filled
                  ? 'fill-cine-amber text-cine-amber'
                  : 'fill-transparent text-cine-muted'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

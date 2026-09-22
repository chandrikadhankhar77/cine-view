import { Star } from 'lucide-react';

export default function RatingDisplay({ rating, size = 14, showNumber = true }) {
  return (
    <div className="flex items-center gap-1">
      <Star size={size} className="fill-cine-amber text-cine-amber" />
      {showNumber && (
        <span className="text-sm font-medium text-white">{rating}</span>
      )}
    </div>
  );
}

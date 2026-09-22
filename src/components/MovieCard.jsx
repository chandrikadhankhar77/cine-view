import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  // Genre colors for fallback poster backgrounds
  const genreGradients = {
    'Sci-Fi': 'from-blue-900 via-cyan-900 to-slate-900',
    'Action': 'from-red-900 via-orange-900 to-slate-900',
    'Drama': 'from-purple-900 via-indigo-900 to-slate-900',
    'Thriller': 'from-teal-900 via-emerald-900 to-slate-900',
    'Comedy': 'from-yellow-900 via-amber-900 to-slate-900',
    'Horror': 'from-red-950 via-rose-900 to-slate-900',
    'Romance': 'from-pink-900 via-rose-800 to-slate-900',
    'Fantasy': 'from-violet-900 via-purple-800 to-slate-900',
    'Crime': 'from-gray-800 via-zinc-800 to-slate-900',
    'Adventure': 'from-emerald-900 via-green-900 to-slate-900',
    'Mystery': 'from-indigo-900 via-blue-900 to-slate-900',
    'Music': 'from-fuchsia-900 via-pink-900 to-slate-900',
    'History': 'from-amber-900 via-yellow-900 to-slate-900',
  };

  const gradient = genreGradients[movie.genre[0]] || 'from-slate-800 via-gray-800 to-slate-900';

  return (
    <article
      onClick={() => navigate(`/movie/${movie.id}`)}
      className="group cursor-pointer animate-fade-in"
      role="link"
      tabIndex={0}
      aria-label={`View details for ${movie.title}`}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/movie/${movie.id}`)}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-cine-card mb-3">
        {!imgError && movie.poster ? (
          <img
            src={movie.poster}
            alt={`${movie.title} movie poster`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-4 text-center`}>
            <span className="text-3xl mb-3">🎬</span>
            <span className="text-white font-semibold text-sm leading-tight">{movie.title}</span>
            <span className="text-white/50 text-xs mt-1">{movie.year}</span>
          </div>
        )}

        {/* Rating Badge */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-cine-dark/80 backdrop-blur-sm px-2 py-1 rounded-lg">
          <Star size={12} className="fill-cine-amber text-cine-amber" />
          <span className="text-white text-xs font-semibold">{movie.rating}</span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-cine-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info */}
      <div className="space-y-1">
        <h3 className="text-white font-semibold text-sm leading-tight group-hover:text-cine-amber transition-colors duration-200 line-clamp-1">
          {movie.title}
        </h3>
        <p className="text-cine-subtle text-xs line-clamp-1">
          {movie.genre.join(', ')}
        </p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-cine-muted">{movie.year}</span>
          <div className="flex items-center gap-1">
            <Star size={11} className="fill-cine-amber text-cine-amber" />
            <span className="text-white font-medium">{movie.rating}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

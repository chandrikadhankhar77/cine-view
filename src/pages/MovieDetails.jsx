import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Star,
  Clock,
  Clapperboard,
  Play,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CastSection from '../components/CastSection';
import MovieDetailsCard from '../components/MovieDetailsCard';
import StarRating from '../components/StarRating';
import { useMovies } from '../hooks/useMovies';

export default function MovieDetails() {
  const { id } = useParams();
  const { getUserRating, rateMovie, loadMovieDetails, loading: listLoading } = useMovies();
  const userRating = getUserRating(id);
  const [movie, setMovie] = useState(null);
  const [detailLoading, setDetailLoading] = useState(true);
  const [detailError, setDetailError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setDetailLoading(true);
      setDetailError(null);
      setImgError(false);

      const result = await loadMovieDetails(id);
      if (cancelled) return;

      setMovie(result.movie);
      if (!result.movie) {
        setDetailError(result.error || 'Movie not found');
      } else if (result.error) {
        setDetailError(result.error);
      }
      setDetailLoading(false);
    }

    if (!listLoading) {
      load();
    }

    return () => {
      cancelled = true;
    };
  }, [id, loadMovieDetails, listLoading]);

  if (listLoading || detailLoading) {
    return (
      <div className="min-h-screen bg-cine-black">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <Loader2 size={36} className="animate-spin text-cine-amber mb-4" />
          <p className="text-white font-medium">Loading movie details…</p>
          <p className="text-cine-subtle text-sm mt-1">Fetching from TMDB API</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-cine-black">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Movie not found</h2>
          <p className="text-cine-subtle mb-6">
            {detailError || "The movie you're looking for doesn't exist."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-cine-amber text-cine-dark font-semibold rounded-lg hover:bg-cine-amber-hover transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Discover
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Genre fallback gradient for poster
  const genreGradients = {
    'Sci-Fi': 'from-blue-900 via-cyan-900 to-slate-900',
    'Action': 'from-red-900 via-orange-900 to-slate-900',
    'Drama': 'from-purple-900 via-indigo-900 to-slate-900',
    'Thriller': 'from-teal-900 via-emerald-900 to-slate-900',
    'Crime': 'from-gray-800 via-zinc-800 to-slate-900',
    'Fantasy': 'from-violet-900 via-purple-800 to-slate-900',
    'Comedy': 'from-yellow-900 via-amber-900 to-slate-900',
    'Adventure': 'from-emerald-900 via-green-900 to-slate-900',
    'Romance': 'from-pink-900 via-rose-800 to-slate-900',
    'Mystery': 'from-indigo-900 via-blue-900 to-slate-900',
    'Music': 'from-fuchsia-900 via-pink-900 to-slate-900',
    'History': 'from-amber-900 via-yellow-900 to-slate-900',
  };
  const gradient = genreGradients[movie.genre[0]] || 'from-slate-800 via-gray-800 to-slate-900';

  const handleSubmitRating = () => {
    if (userRating > 0) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-cine-black">
      <Navbar />

      {/* Sub-nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-cine-subtle hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Discover
        </Link>
        <div className="flex items-center gap-3">
          <button
            className="w-9 h-9 rounded-lg border border-cine-border flex items-center justify-center text-cine-subtle hover:text-white hover:border-cine-subtle transition-all"
            aria-label="Bookmark movie"
          >
            <Bookmark size={16} />
          </button>
          <button
            className="w-9 h-9 rounded-lg border border-cine-border flex items-center justify-center text-cine-subtle hover:text-white hover:border-cine-subtle transition-all"
            aria-label="Share movie"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Movie Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid lg:grid-cols-[320px_1fr] gap-8 lg:gap-12">
          {/* Poster */}
          <div className="relative">
            <div className="aspect-[2/3] rounded-2xl overflow-hidden bg-cine-card shadow-2xl">
              {!imgError && movie.poster ? (
                <img
                  src={movie.poster}
                  alt={`${movie.title} movie poster`}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-6 text-center`}>
                  <span className="text-5xl mb-4">🎬</span>
                  <span className="text-white font-bold text-xl leading-tight">{movie.title}</span>
                  <span className="text-white/50 text-sm mt-2">{movie.year}</span>
                </div>
              )}

              {/* Poster overlay */}
              <div className="absolute inset-0 poster-overlay pointer-events-none" />

              {/* Bottom badges */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <span className="px-2 py-0.5 bg-white/10 rounded text-[10px]">
                    {movie.productionCompanies?.[0]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Movie Info */}
          <div className="space-y-6">
            {/* Meta tags */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-cine-subtle">
              <span className="px-3 py-1 bg-cine-card border border-cine-border rounded-full">{movie.year}</span>
              {movie.genre.map((g) => (
                <span key={g} className="px-3 py-1 bg-cine-card border border-cine-border rounded-full">{g}</span>
              ))}
              {movie.rated && (
                <span className="px-3 py-1 bg-cine-card border border-cine-border rounded-full">{movie.rated}</span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {movie.title}
            </h1>

            {/* Tagline */}
            {movie.tagline && (
              <p className="text-cine-subtle italic text-base">
                &ldquo;{movie.tagline}&rdquo;
              </p>
            )}

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-4 p-4 bg-cine-card border border-cine-border rounded-xl">
              {/* Rating */}
              <div className="flex items-center gap-2 pr-4 border-r border-cine-border">
                <Star size={18} className="fill-cine-amber text-cine-amber" />
                <div>
                  <p className="text-white font-bold text-base">
                    {movie.rating} <span className="text-cine-subtle font-normal text-sm">/ 5</span>
                  </p>
                  <p className="text-[10px] text-cine-muted uppercase tracking-wider">
                    {(movie.rating * 29500).toLocaleString()} Ratings
                  </p>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-2 pr-4 border-r border-cine-border">
                <Clock size={18} className="text-cine-subtle" />
                <div>
                  <p className="text-white font-bold text-sm">{movie.runtime?.split('(')[0]?.trim() || movie.runtime}</p>
                  <p className="text-[10px] text-cine-muted uppercase tracking-wider">Duration</p>
                </div>
              </div>

              {/* Director */}
              <div className="flex items-center gap-2">
                <Clapperboard size={18} className="text-cine-subtle" />
                <div>
                  <p className="text-white font-bold text-sm">{movie.director?.split(',')[0]}</p>
                  <p className="text-[10px] text-cine-muted uppercase tracking-wider">Director</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <a
                href="#rate-section"
                className="inline-flex items-center gap-2 px-6 py-3 bg-cine-amber hover:bg-cine-amber-hover text-cine-dark font-semibold rounded-xl transition-colors duration-200"
              >
                <Star size={16} />
                Rate Movie
              </a>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-cine-card border border-cine-border hover:border-cine-subtle text-white font-medium rounded-xl transition-all duration-200">
                <Play size={16} />
                Watch Trailer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-12">
        {/* Overview */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-cine-amber rounded-full" />
            <h2 className="text-xl font-bold text-white">Overview</h2>
          </div>
          <p className="text-cine-subtle leading-relaxed max-w-3xl text-base">
            {movie.description}
          </p>
        </section>

        {/* Cast */}
        <CastSection cast={movie.cast} />

        {/* Bottom Cards Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Movie Details Card */}
          <MovieDetailsCard movie={movie} />

          {/* Community Sentiment / Rating Card */}
          <div
            id="rate-section"
            className="bg-cine-card border border-cine-border rounded-2xl p-6 lg:p-8 scroll-mt-24"
          >
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={18} className="text-cine-amber" />
              <span className="text-[11px] uppercase tracking-wider text-cine-amber font-semibold">
                Community Sentiment
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Rate this movie</h3>
            <p className="text-cine-subtle text-sm mb-6 leading-relaxed">
              How would you rate {movie.title}? Share your authentic score with the CineView community.
            </p>

            {/* Star Rating */}
            <div className="mb-3">
              <StarRating
                rating={userRating}
                onRate={(r) => rateMovie(movie.id, r)}
                size={32}
                interactive={true}
              />
            </div>
            <p className="text-cine-muted text-xs mb-6">
              {userRating > 0 ? `You rated: ${userRating}/5 stars` : 'Select your rating'}
            </p>

            {/* Submit */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleSubmitRating}
                disabled={userRating === 0}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  userRating > 0
                    ? 'bg-cine-amber text-cine-dark hover:bg-cine-amber-hover'
                    : 'bg-cine-elevated text-cine-muted cursor-not-allowed border border-cine-border'
                }`}
              >
                {submitted ? '✓ Rating Submitted!' : 'Submit Rating'}
              </button>
              <span className="text-xs text-cine-muted">Anonymous & verified reviewers</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

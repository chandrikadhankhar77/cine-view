import SearchBar from './SearchBar';
import { Shield } from 'lucide-react';

export default function HeroSection({ searchQuery, onSearchChange }) {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cine-dark via-cine-dark to-cine-surface" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-cine-amber/10 border border-cine-amber/20 rounded-full px-4 py-1.5">
              <span className="w-2 h-2 rounded-full bg-cine-amber animate-pulse" />
              <span className="text-cine-amber text-xs font-semibold uppercase tracking-wider">
                Movies bring us together
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-white">Find your next </span>
              <span className="text-cine-amber">favorite</span>
              <br />
              <span className="text-cine-amber">movie.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-cine-subtle text-base sm:text-lg max-w-md leading-relaxed">
              Explore thousands of movies, discover new stories, and share your
              ratings with a dedicated cinephile community.
            </p>

            {/* Search Bar */}
            <SearchBar value={searchQuery} onChange={onSearchChange} />

            {/* Trending Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-cine-muted">Trending:</span>
              {['Christopher Nolan', 'Sci-Fi Classics', 'Oscar Winners'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-cine-card border border-cine-border rounded-lg text-xs text-cine-subtle hover:text-white hover:border-cine-subtle transition-all duration-200 cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right — Film Reel Illustration */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-80 h-80">
              {/* Animated film reel */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Outer ring */}
                <div className="w-72 h-72 rounded-full border-2 border-cine-amber/20 flex items-center justify-center animate-[spin_20s_linear_infinite]">
                  {/* Sprocket holes */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                    <div
                      key={deg}
                      className="absolute w-4 h-4 rounded-full bg-cine-amber/30 border border-cine-amber/40"
                      style={{
                        transform: `rotate(${deg}deg) translateY(-140px)`,
                      }}
                    />
                  ))}
                </div>

                {/* Middle ring */}
                <div className="absolute w-48 h-48 rounded-full border border-cine-amber/15" />

                {/* Inner circle — lens */}
                <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-cine-amber/30 to-cine-amber/5 border border-cine-amber/40 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-cine-amber/60 border-2 border-cine-amber" />
                </div>

                {/* Glow effect */}
                <div className="absolute w-72 h-72 rounded-full bg-cine-amber/5 blur-3xl" />
              </div>

              {/* Verified reviews badge */}
              <div className="absolute -bottom-4 right-0 bg-cine-card border border-cine-border rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cine-amber/20 flex items-center justify-center">
                  <Shield size={18} className="text-cine-amber" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-cine-muted font-medium">
                    Curated Archive
                  </p>
                  <p className="text-white text-sm font-bold">
                    24k+ Verified Reviews
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

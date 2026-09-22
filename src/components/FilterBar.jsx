import { X } from 'lucide-react';

export default function FilterBar({
  totalCount,
  genres,
  years,
  ratingOptions,
  selectedGenre,
  selectedYear,
  selectedRating,
  onGenreChange,
  onYearChange,
  onRatingChange,
  hasActiveFilters,
  onClearFilters,
}) {
  return (
    <div id="browse" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 scroll-mt-20">
      {/* Left — Title + Count */}
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-white">Browse Movies</h2>
        <span className="px-3 py-1 bg-cine-card border border-cine-border rounded-full text-xs font-medium text-cine-subtle">
          {totalCount} Movies
        </span>
      </div>

      {/* Right — Filter Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Genre Filter */}
        <select
          value={selectedGenre}
          onChange={(e) => onGenreChange(e.target.value)}
          className="select-dark"
          aria-label="Filter by genre"
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre === 'All' ? 'All Genres' : genre}
            </option>
          ))}
        </select>

        {/* Year Filter */}
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value)}
          className="select-dark"
          aria-label="Filter by year"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year === 'All' ? 'All Years' : year}
            </option>
          ))}
        </select>

        {/* Rating Filter */}
        <select
          value={selectedRating}
          onChange={(e) => onRatingChange(e.target.value)}
          className="select-dark"
          aria-label="Filter by rating"
        >
          {ratingOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1.5 text-sm text-cine-subtle hover:text-white transition-colors duration-200"
            aria-label="Clear all filters"
          >
            <X size={14} />
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}

import { Loader2, AlertTriangle, Database, Cloud } from 'lucide-react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FilterBar from '../components/FilterBar';
import MovieGrid from '../components/MovieGrid';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import Footer from '../components/Footer';
import { useMovies } from '../hooks/useMovies';

export default function Home() {
  const {
    filteredMovies,
    paginatedMovies,
    genres,
    years,
    ratingOptions,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    selectedYear,
    setSelectedYear,
    selectedRating,
    setSelectedRating,
    hasActiveFilters,
    clearFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    loading,
    error,
    dataSource,
    reloadMovies,
  } = useMovies();

  return (
    <div className="min-h-screen bg-cine-black">
      <Navbar />

      {/* Hero Section with Search */}
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Browse Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Data source banner */}
        {!loading && (
          <div
            className={`flex flex-wrap items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
              dataSource === 'tmdb'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-100'
            }`}
          >
            {dataSource === 'tmdb' ? (
              <Cloud size={18} className="mt-0.5 shrink-0" />
            ) : (
              <Database size={18} className="mt-0.5 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium">
                {dataSource === 'tmdb'
                  ? 'Live data from The Movie Database (TMDB) API'
                  : 'Using local sample data (movies.json)'}
              </p>
              {error && (
                <p className="mt-1 text-xs opacity-90 flex items-start gap-1.5">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </p>
              )}
            </div>
            {dataSource !== 'tmdb' && (
              <button
                type="button"
                onClick={reloadMovies}
                className="text-xs font-semibold underline underline-offset-2 hover:opacity-80"
              >
                Retry API
              </button>
            )}
          </div>
        )}

        {/* Filter Bar */}
        {!loading && (
          <FilterBar
            totalCount={filteredMovies.length}
            genres={genres}
            years={years}
            ratingOptions={ratingOptions}
            selectedGenre={selectedGenre}
            selectedYear={selectedYear}
            selectedRating={selectedRating}
            onGenreChange={setSelectedGenre}
            onYearChange={setSelectedYear}
            onRatingChange={setSelectedRating}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />
        )}

        {/* Loading / Grid / Empty */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Loader2 size={36} className="animate-spin text-cine-amber mb-4" />
            <p className="text-white font-medium">Loading movies…</p>
            <p className="text-cine-subtle text-sm mt-1">Fetching from TMDB API</p>
          </div>
        ) : paginatedMovies.length > 0 ? (
          <>
            <MovieGrid movies={paginatedMovies} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <EmptyState query={searchQuery} />
        )}
      </main>

      <Footer />
    </div>
  );
}

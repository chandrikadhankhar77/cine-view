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
        {/* Filter Bar */}
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

        {/* Movie Grid or Empty State */}
        {paginatedMovies.length > 0 ? (
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

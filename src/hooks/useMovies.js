import { useState, useMemo, useCallback, useEffect } from 'react';
import moviesData from '../data/movies.json';
import { applyAllFilters, getUniqueGenres, getUniqueYears, getRatingOptions } from '../utils/movieFilters';

const RATINGS_STORAGE_KEY = 'cineview_user_ratings';

function loadRatings() {
  try {
    const stored = localStorage.getItem(RATINGS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveRatings(ratings) {
  try {
    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratings));
  } catch {
    // localStorage unavailable — silently fail
  }
}

export function useMovies() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedRating, setSelectedRating] = useState('Any');
  const [userRatings, setUserRatings] = useState(loadRatings);
  const [currentPage, setCurrentPage] = useState(1);

  const MOVIES_PER_PAGE = 12;

  // Persist user ratings to localStorage
  useEffect(() => {
    saveRatings(userRatings);
  }, [userRatings]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGenre, selectedYear, selectedRating]);

  // All available movies
  const movies = moviesData;

  // Derived: unique genres and years for filter dropdowns
  const genres = useMemo(() => getUniqueGenres(movies), [movies]);
  const years = useMemo(() => getUniqueYears(movies), [movies]);
  const ratingOptions = useMemo(() => getRatingOptions(), []);

  // Derived: filtered movie list
  const filteredMovies = useMemo(() => {
    return applyAllFilters(movies, {
      searchQuery,
      genre: selectedGenre,
      year: selectedYear,
      rating: selectedRating,
    });
  }, [movies, searchQuery, selectedGenre, selectedYear, selectedRating]);

  // Derived: paginated movies
  const totalPages = Math.ceil(filteredMovies.length / MOVIES_PER_PAGE);
  const paginatedMovies = useMemo(() => {
    const start = (currentPage - 1) * MOVIES_PER_PAGE;
    return filteredMovies.slice(start, start + MOVIES_PER_PAGE);
  }, [filteredMovies, currentPage]);

  // Check if any filter is active
  const hasActiveFilters = searchQuery !== '' || selectedGenre !== 'All' || selectedYear !== 'All' || selectedRating !== 'Any';

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedGenre('All');
    setSelectedYear('All');
    setSelectedRating('Any');
    setCurrentPage(1);
  }, []);

  // Rate a movie
  const rateMovie = useCallback((movieId, rating) => {
    setUserRatings(prev => ({
      ...prev,
      [movieId]: rating,
    }));
  }, []);

  // Get user rating for a specific movie
  const getUserRating = useCallback((movieId) => {
    return userRatings[movieId] || 0;
  }, [userRatings]);

  // Get a movie by ID
  const getMovieById = useCallback((id) => {
    return movies.find(m => m.id === Number(id));
  }, [movies]);

  return {
    // Data
    movies,
    filteredMovies,
    paginatedMovies,
    genres,
    years,
    ratingOptions,

    // Filters
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

    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,

    // Ratings
    userRatings,
    rateMovie,
    getUserRating,

    // Helpers
    getMovieById,
  };
}

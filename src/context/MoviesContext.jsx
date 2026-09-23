import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import moviesFallback from '../data/movies.json';
import {
  applyAllFilters,
  getUniqueGenres,
  getUniqueYears,
  getRatingOptions,
} from '../utils/movieFilters';
import {
  fetchPopularMovies,
  fetchMovieDetails,
  hasApiKey,
} from '../services/movieService';

const RATINGS_STORAGE_KEY = 'cineview_user_ratings';
const MoviesContext = createContext(null);

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

function sameMovieId(a, b) {
  return String(a) === String(b);
}

export function MoviesProvider({ children }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('loading'); // 'tmdb' | 'fallback'

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedRating, setSelectedRating] = useState('Any');
  const [userRatings, setUserRatings] = useState(loadRatings);
  const [currentPage, setCurrentPage] = useState(1);

  const detailCacheRef = useRef({});

  const MOVIES_PER_PAGE = 12;

  const loadMovies = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!hasApiKey()) {
      setMovies(moviesFallback);
      setDataSource('fallback');
      setError(
        'No TMDB API key found. Showing local sample data. Add VITE_TMDB_API_KEY or VITE_TMDB_ACCESS_TOKEN to .env and restart the dev server.'
      );
      setLoading(false);
      return;
    }

    try {
      const popular = await fetchPopularMovies(3);
      setMovies(popular);
      setDataSource('tmdb');
      setError(null);
    } catch (err) {
      console.error('TMDB fetch failed, using local fallback:', err);
      setMovies(moviesFallback);
      setDataSource('fallback');
      setError(
        err?.message
          ? `Could not load TMDB movies (${err.message}). Showing local sample data.`
          : 'Could not load TMDB movies. Showing local sample data.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  useEffect(() => {
    saveRatings(userRatings);
  }, [userRatings]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGenre, selectedYear, selectedRating]);

  const genres = useMemo(() => getUniqueGenres(movies), [movies]);
  const years = useMemo(() => getUniqueYears(movies), [movies]);
  const ratingOptions = useMemo(() => getRatingOptions(), []);

  const filteredMovies = useMemo(
    () =>
      applyAllFilters(movies, {
        searchQuery,
        genre: selectedGenre,
        year: selectedYear,
        rating: selectedRating,
      }),
    [movies, searchQuery, selectedGenre, selectedYear, selectedRating]
  );

  const totalPages = Math.max(1, Math.ceil(filteredMovies.length / MOVIES_PER_PAGE));
  const paginatedMovies = useMemo(() => {
    const start = (currentPage - 1) * MOVIES_PER_PAGE;
    return filteredMovies.slice(start, start + MOVIES_PER_PAGE);
  }, [filteredMovies, currentPage]);

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedGenre !== 'All' ||
    selectedYear !== 'All' ||
    selectedRating !== 'Any';

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedGenre('All');
    setSelectedYear('All');
    setSelectedRating('Any');
    setCurrentPage(1);
  }, []);

  const rateMovie = useCallback((movieId, rating) => {
    setUserRatings((prev) => ({
      ...prev,
      [String(movieId)]: rating,
    }));
  }, []);

  const getUserRating = useCallback(
    (movieId) => userRatings[String(movieId)] || 0,
    [userRatings]
  );

  const getMovieById = useCallback(
    (id) => movies.find((m) => sameMovieId(m.id, id)),
    [movies]
  );

  /**
   * Load full details for the details page.
   * Uses TMDB when credentials are present; otherwise uses local JSON.
   */
  const loadMovieDetails = useCallback(
    async (id) => {
      const key = String(id);
      const cached = detailCacheRef.current[key];
      if (cached) {
        return { movie: cached, source: dataSource };
      }

      if (dataSource === 'fallback' || !hasApiKey()) {
        const local =
          moviesFallback.find((m) => sameMovieId(m.id, key)) || getMovieById(key);
        if (local) {
          detailCacheRef.current[key] = local;
        }
        return { movie: local || null, source: 'fallback' };
      }

      try {
        const detailed = await fetchMovieDetails(key);
        detailCacheRef.current[key] = detailed;
        return { movie: detailed, source: 'tmdb' };
      } catch (err) {
        console.error('TMDB detail fetch failed:', err);
        const listMovie = getMovieById(key);
        return { movie: listMovie || null, source: 'list', error: err?.message };
      }
    },
    [dataSource, getMovieById]
  );

  const value = {
    movies,
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
    userRatings,
    rateMovie,
    getUserRating,
    getMovieById,
    loadMovieDetails,
    loading,
    error,
    dataSource,
    reloadMovies: loadMovies,
  };

  return (
    <MoviesContext.Provider value={value}>{children}</MoviesContext.Provider>
  );
}

export function useMovies() {
  const ctx = useContext(MoviesContext);
  if (!ctx) {
    throw new Error('useMovies must be used within a MoviesProvider');
  }
  return ctx;
}

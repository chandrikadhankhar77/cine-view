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
  searchMovies,
  hasApiKey,
} from '../services/movieService';

const RATINGS_STORAGE_KEY = 'cineview_user_ratings';
const SEARCH_DEBOUNCE_MS = 400;
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
  /** Movies currently shown in the grid (popular list or API search results). */
  const [movies, setMovies] = useState([]);
  /** Cached popular list so clearing search restores Discover without refetch. */
  const popularRef = useRef([]);

  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('loading'); // 'tmdb' | 'fallback'

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedRating, setSelectedRating] = useState('Any');
  const [userRatings, setUserRatings] = useState(loadRatings);
  const [currentPage, setCurrentPage] = useState(1);

  const detailCacheRef = useRef({});
  const searchRequestIdRef = useRef(0);

  const MOVIES_PER_PAGE = 12;

  const loadMovies = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!hasApiKey()) {
      popularRef.current = moviesFallback;
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
      popularRef.current = popular;
      setMovies(popular);
      setDataSource('tmdb');
      setError(null);
    } catch (err) {
      console.error('TMDB fetch failed, using local fallback:', err);
      popularRef.current = moviesFallback;
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

  /**
   * Live TMDB title search when credentials are present.
   * Debounced so we do not hit the API on every keystroke.
   * Fallback mode keeps client-side filtering only.
   */
  useEffect(() => {
    if (dataSource !== 'tmdb' || !hasApiKey()) {
      return undefined;
    }

    const trimmed = searchQuery.trim();
    const requestId = ++searchRequestIdRef.current;

    if (!trimmed) {
      setSearchLoading(false);
      setMovies(popularRef.current);
      return undefined;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const results = await searchMovies(trimmed);
        if (searchRequestIdRef.current !== requestId) return;
        setMovies(results);
      } catch (err) {
        if (searchRequestIdRef.current !== requestId) return;
        console.error('TMDB search failed:', err);
        setError(
          err?.message
            ? `Search failed (${err.message}). Showing previous results.`
            : 'Search failed. Showing previous results.'
        );
      } finally {
        if (searchRequestIdRef.current === requestId) {
          setSearchLoading(false);
        }
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery, dataSource]);

  const genres = useMemo(() => getUniqueGenres(movies), [movies]);
  const years = useMemo(() => getUniqueYears(movies), [movies]);
  const ratingOptions = useMemo(() => getRatingOptions(), []);

  // When TMDB search is active, title matching is done by the API —
  // only apply genre / year / rating filters client-side.
  const filteredMovies = useMemo(
    () =>
      applyAllFilters(movies, {
        searchQuery: dataSource === 'tmdb' ? '' : searchQuery,
        genre: selectedGenre,
        year: selectedYear,
        rating: selectedRating,
      }),
    [movies, searchQuery, selectedGenre, selectedYear, selectedRating, dataSource]
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
    (id) => {
      const fromCatalog = movies.find((m) => sameMovieId(m.id, id));
      if (fromCatalog) return fromCatalog;
      return popularRef.current.find((m) => sameMovieId(m.id, id));
    },
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
    searchLoading,
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

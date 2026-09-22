/**
 * Filter movies by search query (case-insensitive, partial match)
 */
export function filterBySearch(movies, query) {
  if (!query || query.trim() === '') return movies;
  const lowerQuery = query.toLowerCase().trim();
  return movies.filter(movie =>
    movie.title.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Filter movies by genre
 */
export function filterByGenre(movies, genre) {
  if (!genre || genre === 'All') return movies;
  return movies.filter(movie =>
    movie.genre.includes(genre)
  );
}

/**
 * Filter movies by release year
 */
export function filterByYear(movies, year) {
  if (!year || year === 'All') return movies;
  return movies.filter(movie => movie.year === Number(year));
}

/**
 * Filter movies by minimum rating
 */
export function filterByRating(movies, minRating) {
  if (!minRating || minRating === 'Any') return movies;
  return movies.filter(movie => movie.rating >= Number(minRating));
}

/**
 * Apply all filters simultaneously
 */
export function applyAllFilters(movies, { searchQuery, genre, year, rating }) {
  let result = movies;
  result = filterBySearch(result, searchQuery);
  result = filterByGenre(result, genre);
  result = filterByYear(result, year);
  result = filterByRating(result, rating);
  return result;
}

/**
 * Extract unique genres from movie dataset
 */
export function getUniqueGenres(movies) {
  const genres = new Set();
  movies.forEach(movie => {
    movie.genre.forEach(g => genres.add(g));
  });
  return ['All', ...Array.from(genres).sort()];
}

/**
 * Extract unique years from movie dataset (sorted descending)
 */
export function getUniqueYears(movies) {
  const years = new Set(movies.map(m => m.year));
  return ['All', ...Array.from(years).sort((a, b) => b - a)];
}

/**
 * Get rating filter options
 */
export function getRatingOptions() {
  return [
    { value: 'Any', label: 'Any Rating' },
    { value: '4.5', label: '4.5+ Stars' },
    { value: '4', label: '4+ Stars' },
    { value: '3.5', label: '3.5+ Stars' },
    { value: '3', label: '3+ Stars' },
  ];
}

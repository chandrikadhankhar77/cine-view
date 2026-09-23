/**
 * TMDB (The Movie Database) API client.
 * Docs: https://developer.themoviedb.org/docs/getting-started
 *
 * Supports either:
 * - VITE_TMDB_API_KEY (v3 key, query param), or
 * - VITE_TMDB_ACCESS_TOKEN (v4 read access JWT, Bearer header)
 */

const API_BASE = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const API_KEY = String(import.meta.env.VITE_TMDB_API_KEY || '').trim();
const ACCESS_TOKEN = String(import.meta.env.VITE_TMDB_ACCESS_TOKEN || '').trim();

const PLACEHOLDER_KEYS = new Set([
  '',
  'your_tmdb_v3_api_key_here',
  'your_tmdb_access_token_here',
  'your_api_key_here',
  'your_omdb_api_key_here',
]);

/** True when a real TMDB credential is configured in .env */
export function hasApiKey() {
  const keyOk = Boolean(API_KEY) && !PLACEHOLDER_KEYS.has(API_KEY);
  const tokenOk = Boolean(ACCESS_TOKEN) && !PLACEHOLDER_KEYS.has(ACCESS_TOKEN);
  return keyOk || tokenOk;
}

async function tmdbFetch(path, params = {}) {
  if (!hasApiKey()) {
    throw new Error(
      'Missing TMDB credentials. Add VITE_TMDB_API_KEY or VITE_TMDB_ACCESS_TOKEN to .env.'
    );
  }

  const url = new URL(`${API_BASE}${path}`);
  const useBearer = Boolean(ACCESS_TOKEN) && !PLACEHOLDER_KEYS.has(ACCESS_TOKEN);
  const useApiKey = Boolean(API_KEY) && !PLACEHOLDER_KEYS.has(API_KEY);

  // Prefer Read Access Token (Bearer). Fall back to v3 api_key query param.
  if (!useBearer && useApiKey) {
    url.searchParams.set('api_key', API_KEY);
  }
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const headers = { Accept: 'application/json' };
  if (useBearer) {
    headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
  }

  const response = await fetch(url.toString(), { headers });
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`TMDB ${response.status}: ${body || response.statusText}`);
  }
  return response.json();
}

function posterUrl(path) {
  return path ? `${IMAGE_BASE}${path}` : null;
}

function yearFromDate(dateStr) {
  if (!dateStr) return null;
  const year = Number(String(dateStr).slice(0, 4));
  return Number.isFinite(year) ? year : null;
}

function formatRuntime(minutes) {
  if (!minutes) return 'N/A';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return `${h}h ${m}m (${minutes} min)`;
}

function formatReleaseDate(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatBoxOffice(revenue) {
  if (!revenue || revenue <= 0) return 'N/A';
  return `$${revenue.toLocaleString('en-US')}`;
}

/** TMDB vote_average is 0–10; CineView ratings are 0–5. */
function toFiveStar(voteAverage) {
  if (voteAverage == null) return 0;
  return Math.round((Number(voteAverage) / 2) * 10) / 10;
}

/**
 * Map a TMDB list/search result into the shape used by movie cards.
 */
export function mapListMovie(item, genreMap = {}) {
  const genres = (item.genre_ids || [])
    .map((id) => genreMap[id])
    .filter(Boolean);

  return {
    id: item.id,
    title: item.title || item.original_title || 'Untitled',
    poster: posterUrl(item.poster_path),
    year: yearFromDate(item.release_date),
    genre: genres.length ? genres : ['Unknown'],
    rating: toFiveStar(item.vote_average),
    description: item.overview || '',
  };
}

/**
 * Map a TMDB movie details (+ credits) response into the full detail shape.
 */
export function mapDetailMovie(details) {
  const credits = details.credits || {};
  const cast = (credits.cast || []).slice(0, 12).map((person) => ({
    name: person.name,
    character: person.character || 'Unknown',
  }));

  const crew = credits.crew || [];
  const directors = crew.filter((c) => c.job === 'Director').map((c) => c.name);
  const writers = crew
    .filter((c) => c.job === 'Screenplay' || c.job === 'Writer')
    .map((c) => c.name);
  const uniqueWriters = [...new Set(writers)];

  const genres = (details.genres || []).map((g) => g.name).filter(Boolean);

  const releaseDates = details.release_dates?.results || [];
  const usRelease = releaseDates.find((r) => r.iso_3166_1 === 'US');
  const certification =
    usRelease?.release_dates?.find((r) => r.certification)?.certification ||
    releaseDates
      .flatMap((r) => r.release_dates || [])
      .find((r) => r.certification)?.certification ||
    null;

  return {
    id: details.id,
    title: details.title || details.original_title || 'Untitled',
    poster: posterUrl(details.poster_path),
    year: yearFromDate(details.release_date),
    genre: genres.length ? genres : ['Unknown'],
    rating: toFiveStar(details.vote_average),
    rated: certification || 'NR',
    runtime: formatRuntime(details.runtime),
    releaseDate: formatReleaseDate(details.release_date),
    tagline: details.tagline || '',
    description: details.overview || 'No overview available.',
    director: directors.join(', ') || 'Unknown',
    screenwriter: uniqueWriters.join(', ') || 'Unknown',
    cast,
    languages: (details.spoken_languages || [])
      .map((l) => l.english_name || l.name)
      .filter(Boolean),
    productionCompanies: (details.production_companies || [])
      .map((c) => c.name)
      .filter(Boolean),
    boxOffice: formatBoxOffice(details.revenue),
  };
}

/** Fetch TMDB genre id → name map for movies. */
export async function fetchGenreMap() {
  const data = await tmdbFetch('/genre/movie/list');
  const map = {};
  (data.genres || []).forEach((g) => {
    map[g.id] = g.name;
  });
  return map;
}

/**
 * Fetch popular movies across multiple pages (for the Discover grid).
 */
export async function fetchPopularMovies(pages = 3) {
  const genreMap = await fetchGenreMap();
  const results = [];

  for (let page = 1; page <= pages; page += 1) {
    const data = await tmdbFetch('/movie/popular', { page });
    (data.results || []).forEach((item) => {
      results.push(mapListMovie(item, genreMap));
    });
  }

  const seen = new Set();
  return results.filter((movie) => {
    if (seen.has(movie.id)) return false;
    seen.add(movie.id);
    return true;
  });
}

/**
 * Search movies by title via TMDB.
 */
export async function searchMovies(query, page = 1) {
  const genreMap = await fetchGenreMap();
  const data = await tmdbFetch('/search/movie', {
    query,
    page,
    include_adult: false,
  });
  return (data.results || []).map((item) => mapListMovie(item, genreMap));
}

/**
 * Fetch full movie details including credits and release dates.
 */
export async function fetchMovieDetails(id) {
  const data = await tmdbFetch(`/movie/${id}`, {
    append_to_response: 'credits,release_dates',
  });
  return mapDetailMovie(data);
}

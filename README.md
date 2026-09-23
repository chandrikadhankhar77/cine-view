# CineView — Movie Review Application

A responsive movie review web application built with React, TailwindCSS, and Vite. Browse movies, search by title, filter by genre/year/rating, view detailed movie information, and rate movies with an interactive 1–5 star system.

## Features

- 🎬 **Browse Movies** — Live popular movies from the **TMDB API** (with local JSON fallback)
- 🔍 **Search** — Real-time, case-insensitive search by title with partial matching
- 🏷️ **Filter** — Filter by genre, year, and minimum rating (all work simultaneously)
- 📄 **Movie Details** — Full detail view fetched from TMDB (poster, cast, overview, production)
- ⭐ **Rate Movies** — Interactive 1–5 star rating with localStorage persistence
- 📱 **Responsive** — Optimized for desktop (1440px+), tablet (768–1439px), and mobile (320–767px)
- ♿ **Accessible** — Semantic HTML, keyboard navigation, ARIA labels, focus states

## Tech Stack

- **React 18** — Component-based UI with hooks
- **React Router 6** — Client-side routing
- **TailwindCSS 3** — Utility-first styling
- **Vite 6** — Fast dev server and build tool
- **Lucide React** — Icon library
- **TMDB API** — Movie metadata and posters ([themoviedb.org](https://www.themoviedb.org/))
- **localStorage** — Rating persistence

## Installation

```bash
git clone <repo-url>
cd cineview
npm install
```

## TMDB API credentials (required for live movie data)

1. Create a free account / open https://www.themoviedb.org/settings/api
2. Copy either the **API Key (v3)** or the **API Read Access Token** (JWT)
3. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

4. Paste your credentials:

```env
VITE_TMDB_ACCESS_TOKEN=your_tmdb_access_token_here
VITE_TMDB_API_KEY=your_tmdb_v3_api_key_here
```

5. Restart the dev server after changing `.env`

Without credentials, the app still runs using `src/data/movies.json` as sample data.

## Running Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build

```bash
npm run build
```

The production build outputs to `dist/`.

## Deployment

This app is configured for **Netlify** deployment:

1. Push to GitHub
2. Connect your repo to Netlify
3. Netlify will auto-detect the build settings from `netlify.toml`

## Project Structure

```
src/
├── components/
│   ├── CastSection.jsx
│   ├── EmptyState.jsx
│   ├── FilterBar.jsx
│   ├── Footer.jsx
│   ├── HeroSection.jsx
│   ├── MovieCard.jsx
│   ├── MovieDetailsCard.jsx
│   ├── MovieGrid.jsx
│   ├── Navbar.jsx
│   ├── Pagination.jsx
│   ├── RatingDisplay.jsx
│   ├── SearchBar.jsx
│   └── StarRating.jsx
├── context/
│   └── MoviesContext.jsx
├── data/
│   └── movies.json          # Offline fallback sample data
├── hooks/
│   └── useMovies.js
├── pages/
│   ├── Home.jsx
│   └── MovieDetails.jsx
├── services/
│   └── movieService.js      # TMDB API client
├── utils/
│   └── movieFilters.js
├── App.jsx
├── index.css
└── main.jsx
```


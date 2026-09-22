# CineView — Movie Review Application

A responsive movie review web application built with React, TailwindCSS, and Vite. Browse movies, search by title, filter by genre/year/rating, view detailed movie information, and rate movies with an interactive 1–5 star system.

## Features

- 🎬 **Browse Movies** — Grid of 24 real movies with posters, ratings, and metadata
- 🔍 **Search** — Real-time, case-insensitive search by title with partial matching
- 🏷️ **Filter** — Filter by genre, year, and minimum rating (all work simultaneously)
- 📄 **Movie Details** — Full detail view with poster, cast, overview, and production info
- ⭐ **Rate Movies** — Interactive 1–5 star rating with localStorage persistence
- 📱 **Responsive** — Optimized for desktop (1440px+), tablet (768–1439px), and mobile (320–767px)
- ♿ **Accessible** — Semantic HTML, keyboard navigation, ARIA labels, focus states

## Tech Stack

- **React 18** — Component-based UI with hooks
- **React Router 6** — Client-side routing
- **TailwindCSS 3** — Utility-first styling
- **Vite 6** — Fast dev server and build tool
- **Lucide React** — Icon library
- **localStorage** — Rating persistence

## Installation

```bash
git clone <repo-url>
cd cineview
npm install
```

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
├── data/
│   └── movies.json
├── hooks/
│   └── useMovies.js
├── pages/
│   ├── Home.jsx
│   └── MovieDetails.jsx
├── utils/
│   └── movieFilters.js
├── App.jsx
├── index.css
└── main.jsx
```

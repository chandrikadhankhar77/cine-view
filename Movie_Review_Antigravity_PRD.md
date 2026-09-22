# Movie Review Application — PRD & Antigravity Build Instructions

## 1. Project Objective

Build a complete, responsive **Movie Review Web Application** using the approved UI design provided separately.

The application must allow users to:

- Browse movies
- Search movies by title
- Filter movies
- Open a movie's detailed information
- Rate movies using a 1–5 star rating system
- See movie ratings visually

The attached project requirements document is the **functional and technical source of truth**. The supplied UI design is the **visual source of truth**.

### Priority Order

1. **Provided UI/design** → visual source of truth
2. **Provided requirements document** → functional + technical source of truth
3. This PRD → implementation clarification
4. Do not invent additional features unless necessary to make required functionality work.

---

## 2. Mandatory Technology Stack

Use the technologies specified in the requirements document:

### Frontend

- React JS
- React Hooks
- TailwindCSS

### Movie Data

Use either:

- OMDb/public movie API
- Local mock JSON data

For the initial implementation, prefer **mock JSON data** unless an API key is already provided.

Do not make the application dependent on an unavailable API key.

### Deployment

The final application must be deployable to:

- Netlify

The source code must be pushed to:

- GitHub

---

## 3. Important Scope Restriction

This is primarily a **frontend movie-review assessment application**.

Do NOT unnecessarily create:

- Node.js backend
- Express backend
- MongoDB
- Firebase
- Authentication system
- Admin dashboard
- Payment system
- Social login
- User accounts
- Complex recommendation engine

None of these are required by the source document.

If persistence is needed for the user's rating, use an appropriate frontend mechanism such as React state/localStorage unless the supplied design or requirements explicitly require server persistence.

---

## 4. UI Implementation

The supplied UI design is the **visual source of truth**.

Reproduce the design as closely as possible.

Do not redesign the interface based on personal preference.

Match:

- Layout
- Spacing
- Typography hierarchy
- Font sizing
- Colors
- Backgrounds
- Borders
- Border radius
- Shadows
- Cards
- Buttons
- Navigation
- Icons
- Movie posters
- Rating indicators
- Search interface
- Filter controls
- Responsive behavior

If the screenshot/design and this PRD appear to conflict visually, follow the **provided design** for appearance and the requirements document for functionality.

---

## 5. Required Application Screens

Build the application around the following screens/views.

### 5.1 Movie Listing / Home

Display a collection of movies.

Each movie card should contain, where available:

- Movie poster
- Movie title
- Release year
- Genre
- Rating

### Behavior

Clicking a movie card should open the movie details view.

---

## 6. Search

Implement a search bar.

Users must be able to search for movies by **title**.

### Behavior

- Work without page reload
- Update results dynamically
- Handle partial title matches
- Be case-insensitive
- Show an appropriate empty state when no movies match

Example:

```text
User enters: "Inception"
        ↓
Movie list updates
        ↓
Matching movie titles are displayed
```

---

## 7. Filtering

Implement filtering based on:

- Genre
- Year
- Rating

### Genre

Use genres represented in the dataset.

Example:

```text
All
Action
Comedy
Drama
Horror
Sci-Fi
Thriller
```

### Year

Allow users to filter movies by release year.

### Rating

Allow filtering based on movie rating.

The exact UI control should follow the provided design.

---

## 8. Search + Filters Must Work Together

Search and filters must work simultaneously.

Example:

```text
Search: "star"
Genre: Action
Year: 2024
Rating: 4+
```

The displayed movies should satisfy all active conditions.

Provide a way to clear/reset filters if the design contains one or if necessary for usability.

---

## 9. Movie Details

Clicking a movie should open a detailed movie view.

Display relevant information such as:

- Large movie poster
- Movie title
- Description
- Genre
- Release year/date
- Cast, if available
- Rating
- Rating UI

The layout must remain readable and responsive.

---

## 10. Rating System

Implement a **1–5 star rating system**.

Users should be able to select:

```text
★
★★
★★★
★★★★
★★★★★
```

### Required Behavior

When the user selects a rating:

1. Update the UI immediately.
2. Visually show the selected rating.
3. Store the user's rating appropriately for the current frontend session.
4. Display the rating on the movie UI where appropriate.

Use React state/hooks for this behavior.

---

## 11. Average Rating

Each movie should have an average/display rating.

This can be:

- Mock data
- Based on user input

Example:

```text
★★★★☆
4.3
```

Keep the presentation consistent with the supplied UI.

---

## 12. React Architecture

Use reusable React components.

Do NOT create one giant component containing the entire application.

Suggested structure:

```text
src/
│
├── components/
│   ├── Navbar.jsx
│   ├── SearchBar.jsx
│   ├── FilterBar.jsx
│   ├── MovieCard.jsx
│   ├── MovieGrid.jsx
│   ├── StarRating.jsx
│   ├── RatingDisplay.jsx
│   └── EmptyState.jsx
│
├── pages/
│   ├── Home.jsx
│   └── MovieDetails.jsx
│
├── data/
│   └── movies.json
│
├── hooks/
│   └── useMovies.js
│
├── utils/
│   └── movieFilters.js
│
├── App.jsx
├── main.jsx
└── index.css
```

You may modify the structure if necessary, but maintain clear separation of concerns.

---

## 13. React Hooks

Use React Hooks for state handling.

Use appropriate hooks such as:

```jsx
useState()
useEffect()
useMemo()
```

where appropriate.

Potential application state:

```text
movies
searchQuery
selectedGenre
selectedYear
selectedRating
userRatings
selectedMovie
```

Avoid unnecessary global state libraries.

---

## 14. Movie Data

If using mock JSON, create a sufficiently realistic dataset.

Do not build the UI using only 2–3 movies.

Use approximately:

```text
15–30 movies
```

Each movie should have data similar to:

```json
{
  "id": 1,
  "title": "Inception",
  "poster": "...",
  "year": 2010,
  "genre": "Sci-Fi",
  "rating": 4.7,
  "description": "...",
  "cast": [
    "Leonardo DiCaprio",
    "Joseph Gordon-Levitt"
  ]
}
```

Use valid image URLs or appropriate local assets.

If an external image fails, provide a graceful fallback.

---

## 15. Responsive Design

The application must work on:

### Desktop

```text
1440px+
```

### Laptop / Tablet

```text
768px – 1439px
```

### Mobile

```text
320px – 767px
```

Do not simply shrink the desktop UI.

Adapt:

- Navigation
- Movie grid
- Search
- Filters
- Movie details
- Rating controls

for smaller screens.

---

## 16. Loading / Empty / Error States

Implement sensible states.

### Loading

If movie data/API is loading:

```text
Loading movies...
```

Prefer a skeleton/loading UI if consistent with the supplied design.

### No Search Results

```text
No movies found
Try another title or change your filters.
```

### API Failure

If an external movie API is used:

```text
Unable to load movies.
Please try again.
```

Do not leave a blank screen.

---

## 17. API Architecture

If using OMDb/public API instead of mock JSON:

Do not scatter API calls throughout components.

Create a service layer such as:

```text
src/services/movieService.js
```

Example responsibilities:

```text
searchMovies()
getMovieDetails()
```

Keep API configuration separate from UI components.

Never hardcode secret API keys directly into source code.

If no API key is supplied, use mock data.

---

## 18. Routing

If multiple views are implemented, use React routing where appropriate.

Suggested routes:

```text
/
```

Home/movie listing.

```text
/movie/:id
```

Movie details.

The exact route structure can be changed if the supplied UI/design requires another structure.

---

## 19. State Flow

Expected basic flow:

```text
Movie Data
    ↓
Movie Listing
    ↓
Search / Filters
    ↓
Filtered Movie List
    ↓
User selects movie
    ↓
Movie Details
    ↓
User selects star rating
    ↓
Rating state updates
    ↓
UI reflects rating
```

Keep state predictable and avoid unnecessary complexity.

---

## 20. TailwindCSS

Use TailwindCSS for styling.

Do not replace Tailwind with:

- Bootstrap
- Material UI
- Chakra UI
- plain CSS for the majority of the interface

Small supporting CSS is acceptable where necessary.

---

## 21. Accessibility

Implement basic accessibility:

- Semantic HTML
- Proper button elements
- Accessible labels for search/filter controls
- Keyboard-accessible rating controls
- Meaningful `alt` text for movie posters
- Visible focus states

For the star rating, do not make the stars merely decorative if they are interactive.

---

## 22. Performance

Keep the application lightweight.

Avoid:

- Unnecessary dependencies
- Huge images
- Excessive re-renders
- Unnecessary API calls

Use `useMemo` where filtering/search calculations genuinely benefit from memoization.

Do not prematurely optimize simple operations.

---

## 23. Code Quality

The generated application should have:

- Clean component structure
- Reusable components
- Meaningful variable names
- No duplicated movie-card markup
- No unused imports
- No console errors
- No hardcoded repeated UI data
- No unnecessary dependencies

Remove all debugging code before completion.

---

## 24. GitHub Requirements

The completed source code must be pushed to GitHub.

Before committing:

- Remove unnecessary files
- Do not commit secrets
- Do not commit API keys
- Include `.gitignore`
- Include a README
- Ensure the application runs from a clean clone

---

## 25. Netlify Deployment

The application must be deployable to Netlify.

Before declaring the project complete:

```bash
npm install
npm run build
```

must succeed.

Then verify that the production build works.

The application should be compatible with Netlify deployment.

---

## 26. README

Create a concise README containing:

```text
Project Name
Description
Features
Tech Stack
Installation
Running Locally
Build
Deployment
Project Structure
```

Do not include the company's name anywhere in the code.

Do not put the company's name in:

- README
- HTML metadata
- comments
- package metadata
- component names
- variable names
- visible UI
- source code

---

## 27. Final Acceptance Criteria

### Movie Browsing

- [ ] Movies are displayed
- [ ] Poster is displayed
- [ ] Title is displayed
- [ ] Release year is displayed
- [ ] Genre is displayed
- [ ] Rating is displayed

### Search

- [ ] Search by movie title works
- [ ] Partial search works
- [ ] Case-insensitive search works
- [ ] Empty results are handled

### Filters

- [ ] Genre filter works
- [ ] Year filter works
- [ ] Rating filter works
- [ ] Multiple filters work together
- [ ] Filters can be cleared/reset

### Details

- [ ] Movie card opens details
- [ ] Description is displayed
- [ ] Cast is displayed where available
- [ ] Release information is displayed
- [ ] Movie poster is displayed
- [ ] Rating is displayed

### Rating

- [ ] 1–5 star rating works
- [ ] User selection is visually reflected
- [ ] Rating state updates without page reload
- [ ] Movie's displayed rating remains consistent

### UI

- [ ] Matches supplied Stitch/Figma design
- [ ] Responsive on desktop
- [ ] Responsive on mobile
- [ ] No horizontal overflow
- [ ] No broken images
- [ ] No console errors

### Technical

- [ ] React JS
- [ ] TailwindCSS
- [ ] React Hooks
- [ ] Mock JSON or public movie API
- [ ] Clean component architecture
- [ ] Production build succeeds
- [ ] Netlify compatible
- [ ] GitHub ready

---

## 28. Antigravity Execution Instructions

**Do not immediately start coding blindly.**

Follow this sequence.

### Step 1 — Analyze

Inspect:

1. The provided UI/design files
2. This PRD
3. Existing repository, if one is provided

Identify:

- Screens
- Components
- User flows
- Assets
- Required interactions

### Step 2 — Plan

Create an implementation plan before modifying the project.

### Step 3 — Build

Implement the complete frontend.

### Step 4 — Test

Test:

- Search
- Genre filtering
- Year filtering
- Rating filtering
- Combined filters
- Movie details
- Star rating
- Responsive layout

### Step 5 — Visual Comparison

Compare the implementation against the supplied design.

Fix:

- Spacing
- Sizing
- Typography
- Alignment
- Colors
- Card dimensions
- Responsive behavior

until the implementation closely matches the design.

### Step 6 — Production Verification

Run:

```bash
npm run build
```

Resolve all build errors.

Then verify that the production application works.

### Step 7 — Final Report

At the end, report:

```text
Implemented:
- ...

Tech stack:
- ...

Routes:
- ...

Data source:
- ...

Build status:
- ...

Remaining issues:
- ...
```

**Do not claim something is complete if it has not been tested.**

---

## 29. Final Instruction to Antigravity

Build the application completely according to this PRD and the supplied UI design.

Do not invent unnecessary product features.

Do not build a backend unless explicitly required later.

Prioritize:

1. Visual fidelity to the supplied design
2. Correct implementation of the requirements
3. Responsive behavior
4. Working search/filter/rating interactions
5. Clean React architecture
6. Successful production build
7. GitHub and Netlify readiness

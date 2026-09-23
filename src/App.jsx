import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MoviesProvider } from './context/MoviesContext';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';

export default function App() {
  return (
    <MoviesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </BrowserRouter>
    </MoviesProvider>
  );
}

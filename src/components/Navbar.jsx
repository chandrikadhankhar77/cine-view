import { Link, useLocation } from 'react-router-dom';
import { Search, User } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const isDiscover = location.pathname === '/';

  return (
    <nav className="sticky top-0 z-50 bg-cine-dark/95 backdrop-blur-md border-b border-cine-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/logo.png"
              alt="CineView"
              className="h-8 w-auto"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="text-white font-bold text-lg tracking-tight">
              CineView
            </span>
          </Link>

          {/* Center Navigation */}
          <div className="hidden sm:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors duration-200 pb-1 ${
                isDiscover
                  ? 'text-cine-amber border-b-2 border-cine-amber'
                  : 'text-cine-subtle hover:text-white'
              }`}
            >
              Discover
            </Link>
            <a
              href="#browse"
              className="text-sm font-medium text-cine-subtle hover:text-white transition-colors duration-200"
            >
              Genres
            </a>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              className="hidden sm:flex items-center gap-2 bg-cine-card border border-cine-border rounded-full px-4 py-2 text-sm text-cine-subtle hover:text-white hover:border-cine-subtle transition-all duration-200"
              aria-label="Search movies"
            >
              <Search size={14} />
              <span>Search</span>
              <kbd className="ml-1 text-[10px] bg-cine-elevated px-1.5 py-0.5 rounded text-cine-muted font-mono">
                ⌘K
              </kbd>
            </button>
            <button
              className="w-9 h-9 rounded-full bg-cine-amber/20 border border-cine-amber/30 flex items-center justify-center text-cine-amber hover:bg-cine-amber/30 transition-all duration-200"
              aria-label="User profile"
            >
              <User size={16} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

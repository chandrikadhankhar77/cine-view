import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className="flex items-center bg-cine-card border border-cine-border rounded-xl overflow-hidden focus-within:border-cine-amber/50 focus-within:ring-1 focus-within:ring-cine-amber/20 transition-all duration-200">
        <div className="pl-4 text-cine-subtle">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search movies by title..."
          className="flex-1 bg-transparent px-3 py-3.5 text-white text-sm placeholder:text-cine-muted outline-none"
          aria-label="Search movies by title"
        />
        <button
          type="submit"
          className="px-6 py-3.5 bg-cine-amber hover:bg-cine-amber-hover text-cine-dark font-semibold text-sm transition-colors duration-200"
        >
          Search
        </button>
      </div>
    </form>
  );
}

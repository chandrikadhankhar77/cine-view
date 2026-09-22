import { Search } from 'lucide-react';

export default function EmptyState({ query }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-cine-card border border-cine-border flex items-center justify-center mb-6">
        <Search size={32} className="text-cine-muted" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No movies found</h3>
      <p className="text-cine-subtle text-sm max-w-md">
        {query
          ? `No results for "${query}". Try another title or change your filters.`
          : 'Try another title or change your filters.'}
      </p>
    </div>
  );
}

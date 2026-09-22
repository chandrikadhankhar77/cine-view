import { Info } from 'lucide-react';

export default function MovieDetailsCard({ movie }) {
  const details = [
    { label: 'Release Date', value: movie.releaseDate },
    { label: 'Runtime', value: movie.runtime },
    { label: 'Director', value: movie.director },
    { label: 'Screenwriter', value: movie.screenwriter },
    { label: 'Genres', value: movie.genre?.join(', ') },
    { label: 'Languages', value: movie.languages?.join(', ') },
    { label: 'Production Companies', value: movie.productionCompanies?.join(', ') },
    { label: 'Worldwide Box Office', value: movie.boxOffice },
  ].filter((d) => d.value);

  return (
    <div className="bg-cine-card border border-cine-border rounded-2xl p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Info size={18} className="text-cine-amber" />
        <h3 className="text-lg font-bold text-white">Movie Details</h3>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
        {details.map(({ label, value }) => (
          <div key={label}>
            <p className="text-[11px] uppercase tracking-wider text-cine-muted font-medium mb-1">
              {label}
            </p>
            <p className={`text-sm font-medium ${
              label === 'Worldwide Box Office' ? 'text-cine-amber' : 'text-white'
            }`}>
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

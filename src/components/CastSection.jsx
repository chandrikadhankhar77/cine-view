import { useState } from 'react';

export default function CastSection({ cast }) {
  if (!cast || cast.length === 0) return null;

  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-cine-amber rounded-full" />
          <h2 className="text-xl font-bold text-white">Cast</h2>
        </div>
        <span className="text-sm text-cine-subtle">Top Billed</span>
      </div>

      {/* Cast Scroll */}
      <div className="flex gap-4 overflow-x-auto pb-4 cast-scroll">
        {cast.map((member, index) => (
          <CastCard key={index} member={member} />
        ))}
      </div>
    </section>
  );
}

function CastCard({ member }) {
  const [imgError, setImgError] = useState(false);

  // Generate initials for fallback
  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Deterministic color based on name
  const colors = [
    'from-blue-800 to-blue-900',
    'from-purple-800 to-purple-900',
    'from-emerald-800 to-emerald-900',
    'from-amber-800 to-amber-900',
    'from-rose-800 to-rose-900',
    'from-cyan-800 to-cyan-900',
    'from-indigo-800 to-indigo-900',
    'from-teal-800 to-teal-900',
  ];
  const colorIndex = member.name.length % colors.length;

  return (
    <div className="flex-shrink-0 w-[110px] text-center group">
      {/* Avatar */}
      <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-2.5 border-2 border-cine-border group-hover:border-cine-amber/50 transition-colors duration-300">
        {member.photo && !imgError ? (
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center`}
          >
            <span className="text-white font-bold text-sm">{initials}</span>
          </div>
        )}
      </div>

      {/* Name */}
      <p className="text-white text-xs font-semibold leading-tight line-clamp-2">
        {member.name}
      </p>

      {/* Character */}
      <p className="text-cine-subtle text-[11px] mt-0.5 line-clamp-1">
        {member.character}
      </p>
    </div>
  );
}

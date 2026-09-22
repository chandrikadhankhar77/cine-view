import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Generate page numbers with ellipsis logic
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= Math.min(maxVisible, totalPages); i++) pages.push(i);
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) pages.push(i);
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all duration-200 ${
          currentPage === 1
            ? 'border-cine-border text-cine-muted cursor-not-allowed'
            : 'border-cine-border text-cine-subtle hover:text-white hover:border-cine-subtle'
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
        Previous
      </button>

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
            page === currentPage
              ? 'bg-cine-amber text-cine-dark'
              : 'text-cine-subtle hover:text-white hover:bg-cine-card border border-cine-border'
          }`}
          aria-label={`Page ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all duration-200 ${
          currentPage === totalPages
            ? 'border-cine-border text-cine-muted cursor-not-allowed'
            : 'border-cine-border text-cine-subtle hover:text-white hover:border-cine-subtle'
        }`}
        aria-label="Next page"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

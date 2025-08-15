import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const getVisiblePages = () => {
    const delta = 2;
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);
    
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 mt-12">
      <Button
        variant="outline"
        size="lg"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border-netflix-red/40 text-netflix-white hover:bg-netflix-red/20 font-semibold px-6"
      >
        <ChevronLeft className="h-5 w-5" />
        Anterior
      </Button>

      <div className="flex gap-2">
        {currentPage > 3 && (
          <>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onPageChange(1)}
              className="border-netflix-red/40 text-netflix-white hover:bg-netflix-red/20 font-semibold"
            >
              1
            </Button>
            {currentPage > 4 && <span className="px-2 text-netflix-white/60 flex items-center">...</span>}
          </>
        )}

        {getVisiblePages().map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="lg"
            onClick={() => onPageChange(page)}
            className={
              page === currentPage
                ? "bg-gradient-red hover:shadow-glow-red font-bold"
                : "border-netflix-red/40 text-netflix-white hover:bg-netflix-red/20 font-semibold"
            }
          >
            {page}
          </Button>
        ))}

        {currentPage < totalPages - 2 && (
          <>
            {currentPage < totalPages - 3 && <span className="px-2 text-netflix-white/60 flex items-center">...</span>}
            <Button
              variant="outline"
              size="lg"
              onClick={() => onPageChange(totalPages)}
              className="border-netflix-red/40 text-netflix-white hover:bg-netflix-red/20 font-semibold"
            >
              {totalPages}
            </Button>
          </>
        )}
      </div>

      <Button
        variant="outline"
        size="lg"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border-netflix-red/40 text-netflix-white hover:bg-netflix-red/20 font-semibold px-6"
      >
        Próxima
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
};
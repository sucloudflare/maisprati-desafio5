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
    <div className="flex flex-wrap items-center justify-center gap-3 mt-12">
      {/* Botão Anterior */}
      <Button
        variant="outline"
        size="lg"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border-gradient-red/40 text-white hover:bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 hover:shadow-[0_0_15px_rgba(255,69,0,0.5)] font-semibold px-6 transition-all duration-300"
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        Anterior
      </Button>

      {/* Páginas */}
      <div className="flex gap-2">
        {currentPage > 3 && (
          <>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onPageChange(1)}
              className="border-gradient-red/40 text-white hover:bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 font-semibold transition-all duration-300"
            >
              1
            </Button>
            {currentPage > 4 && <span className="px-2 text-white/60 flex items-center select-none">...</span>}
          </>
        )}

        {getVisiblePages().map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? 'default' : 'outline'}
            size="lg"
            onClick={() => onPageChange(page)}
            className={`transition-all duration-300 font-semibold px-5 ${
              page === currentPage
                ? 'bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-black shadow-glow-red transform scale-105'
                : 'border-gradient-red/40 text-white hover:bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 hover:shadow-[0_0_10px_rgba(255,69,0,0.4)]'
            }`}
          >
            {page}
          </Button>
        ))}

        {currentPage < totalPages - 2 && (
          <>
            {currentPage < totalPages - 3 && <span className="px-2 text-white/60 flex items-center select-none">...</span>}
            <Button
              variant="outline"
              size="lg"
              onClick={() => onPageChange(totalPages)}
              className="border-gradient-red/40 text-white hover:bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 font-semibold transition-all duration-300"
            >
              {totalPages}
            </Button>
          </>
        )}
      </div>

      {/* Botão Próxima */}
      <Button
        variant="outline"
        size="lg"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border-gradient-red/40 text-white hover:bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 hover:shadow-[0_0_15px_rgba(255,69,0,0.5)] font-semibold px-6 transition-all duration-300"
      >
        Próxima
        <ChevronRight className="h-5 w-5 ml-1" />
      </Button>
    </div>
  );
};

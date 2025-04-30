import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange 
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Show max 5 page buttons, centered around current page
  const visiblePages = () => {
    if (totalPages <= 5) return pages;
    
    const leftOffset = Math.min(2, currentPage - 1);
    const rightOffset = Math.min(2, totalPages - currentPage);
    
    const start = Math.max(1, currentPage - leftOffset);
    const end = Math.min(totalPages, currentPage + rightOffset);
    
    return pages.slice(start - 1, end);
  };

  return (
    <div className="mt-8 flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-600">
          Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of <span className="font-medium">{totalItems}</span> results
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {visiblePages().map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => onPageChange(page)}
            className="px-3 py-1 h-8 w-8"
          >
            {page}
          </Button>
        ))}
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default Pagination;

import React from "react";
function Pagination({ currentPage, totalPages, hasNext, hasPrev, onPageChange }) {
  const generatePageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first, last, and pages around current
      pages.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      if (start > 2) pages.push('...');
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages - 1) pages.push('...');
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev || currentPage === 1}
        className="pagination-btn"
      >
        ← Previous
      </button>

      <div className="page-numbers">
        {pageNumbers.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="ellipsis">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`page-btn ${page === currentPage ? 'active' : ''}`}
            >
              {page}
            </button>
          )
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext || currentPage === totalPages}
        className="pagination-btn"
      >
        Next →
      </button>
    </div>
  );
}

export default Pagination;
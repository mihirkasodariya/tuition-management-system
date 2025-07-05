import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const CustomPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingsCount = 1,
  boundaryCount = 1,
}) => {
  // Helper function to create range of numbers
  const range = (start, end) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // Calculate the main pagination items
  const generatePagination = () => {
    // Always include first and last page
    const firstPage = 1;
    const lastPage = totalPages;

    const leftSiblingIndex = Math.max(currentPage - siblingsCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingsCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    // Case 1: No dots needed
    if (totalPages <= 5) {
      return range(1, totalPages);
    }

    // Case 2: Only right dots
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftRange = range(1, 4);
      return [...leftRange, 'rightDots', totalPages];
    }

    // Case 3: Only left dots
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightRange = range(totalPages - 3, totalPages);
      return [1, 'leftDots', ...rightRange];
    }

    // Case 4: Both dots
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [1, 'leftDots', ...middleRange, 'rightDots', totalPages];
    }

    return range(1, totalPages);
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            className={
              currentPage <= 1
                ? 'pointer-events-none cursor-not-allowed opacity-50'
                : 'cursor-pointer'
            }
          />
        </PaginationItem>

        {generatePagination().map((item, index) => {
          if (item === 'leftDots' || item === 'rightDots') {
            return (
              <PaginationItem key={`${item}-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={item}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(item);
                }}
                isActive={currentPage === item}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;

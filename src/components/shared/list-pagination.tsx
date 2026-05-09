"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface ListPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Generates the page numbers to display in the pagination bar.
 * Shows: first page, last page, current page ± 1, and ellipsis where needed.
 */
function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [];

  // Always show first page
  pages.push(1);

  if (current > 3) {
    pages.push("ellipsis");
  }

  // Show current ± 1 (clamped)
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("ellipsis");
  }

  // Always show last page
  pages.push(total);

  return pages;
}

export function ListPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ListPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <Pagination className="mt-8 sm:mt-10">
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious
            className={currentPage <= 1 ? "pointer-events-none opacity-40" : "cursor-pointer"}
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          />
        </PaginationItem>

        {/* Page numbers */}
        {pages.map((page, idx) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                className="cursor-pointer"
                onClick={() => onPageChange(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {/* Next */}
        <PaginationItem>
          <PaginationNext
            className={currentPage >= totalPages ? "pointer-events-none opacity-40" : "cursor-pointer"}
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

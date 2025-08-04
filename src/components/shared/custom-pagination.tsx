import React, { useEffect, useState } from 'react'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination'
import Link from 'next/link';

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => () => void;
  createQueryString: (key: string, value: string) => string;
}

const CustomPagination = ({ currentPage, totalPages, onPageChange, createQueryString }: CustomPaginationProps) => {
  const [isFirstPage, setIsFirstPage] = useState(currentPage === 1);
  const [isLastPage, setIsLastPage] = useState(currentPage === totalPages);

  useEffect(() => {
    setIsFirstPage(currentPage === 1);
    setIsLastPage(currentPage === totalPages);
  }, [currentPage, totalPages]);

  return (
    <Pagination>
        <PaginationContent>
            <PaginationItem>
              <PaginationPrevious className={isFirstPage ? "opacity-50 pointer-events-none" : ""} onClick={onPageChange(currentPage - 1)} href={`/home?${createQueryString("page", String(currentPage - 1))}`} />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink onClick={onPageChange(currentPage)} isActive href={`/home?${createQueryString("page", String(currentPage))}`}>{currentPage}</PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext className={isLastPage ? "opacity-50 pointer-events-none" : ""} onClick={onPageChange(currentPage + 1)} href={`/home?${createQueryString("page", String(currentPage + 1))}`} />
            </PaginationItem>

        </PaginationContent>
    </Pagination>
  )
}

export default CustomPagination

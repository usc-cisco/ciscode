import React, { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => () => void;
  createQueryString: (data: { name: string; value: string }[]) => string;
  path: string;
}

const CustomPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  createQueryString,
  path,
}: CustomPaginationProps) => {
  const [isFirstPage, setIsFirstPage] = useState(currentPage === 1);
  const [isLastPage, setIsLastPage] = useState(currentPage === totalPages);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ page: number }>();

  const handlePageChange = (data: { page: number }) => {
    setOpen(false);
    onPageChange(Number(data.page))();

    router.push(
      `${path}?${createQueryString([{ name: "page", value: String(data.page) }])}`,
    );
  };

  useEffect(() => {
    setIsFirstPage(currentPage === 1);
    setIsLastPage(currentPage === totalPages);
  }, [currentPage, totalPages]);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={isFirstPage ? "opacity-20 pointer-events-none" : ""}
            onClick={onPageChange(currentPage - 1)}
            href={`${path}?${createQueryString([{ name: "page", value: String(currentPage - 1) }])}`}
          />
        </PaginationItem>

        <PaginationItem>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="cursor-pointer">{currentPage}</Button>
            </DialogTrigger>
            <DialogContent className="bg-vscode-light dark:bg-vscode-dark">
              <form onSubmit={handleSubmit(handlePageChange)}>
                <DialogTitle>
                  Page {currentPage} out of {totalPages}
                </DialogTitle>
                <div className="my-4 flex flex-col gap-1">
                  <p>Go to page</p>
                  <Input
                    type="number"
                    defaultValue={currentPage}
                    className="w-full"
                    {...register("page", {
                      required: "Page number is required",
                      min: {
                        value: 1,
                        message: "Page number must be at least 1",
                      },
                      max: {
                        value: totalPages,
                        message: `Page number must be at most ${totalPages}`,
                      },
                    })}
                  />
                  <p className="text-red-500 text-xs">{errors.page?.message}</p>
                </div>

                <Button type="submit" className="w-full">
                  Go
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            className={isLastPage ? "opacity-20 pointer-events-none" : ""}
            onClick={onPageChange(currentPage + 1)}
            href={`${path}?${createQueryString([{ name: "page", value: String(currentPage + 1) }])}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;

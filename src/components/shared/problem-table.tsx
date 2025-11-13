"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProblemSchemaDisplayResponseType } from "@/dtos/problem.dto";
import { useRouter } from "next/navigation";
import { getDifficultyColor } from "@/lib/types/enums/difficulty.enum";
import {
  CheckIcon,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  FileText,
  User,
  Users,
  TrendingUp,
  Hash,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import SubmissionStatusEnum from "@/lib/types/enums/problemstatus.enum";
import { formatNumberCompact, formatPercentage, cn } from "@/lib/utils";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

interface ProblemTableProps {
  problems: ProblemSchemaDisplayResponseType[];
  inAdmin?: boolean;
  loading: boolean;
}

const ITEMS_PER_PAGE = 10;

export interface CategoryTableProps {
  problems: ProblemSchemaDisplayResponseType[];
  inAdmin?: boolean;
}

export const CategoryTable = ({ problems, inAdmin }: CategoryTableProps) => {
  const router = useRouter();
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column)
      return <ArrowUpDown className="ml-2 h-4 w-4 text-foreground/40" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  const sortedProblems = useMemo(() => {
    if (!sortColumn) return problems;
    return [...problems].sort((a, b) => {
      let aVal: string | number, bVal: string | number;
      switch (sortColumn) {
        case "id":
          aVal = a.id;
          bVal = b.id;
          break;
        case "title":
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case "author":
          aVal = (a.author || "").toLowerCase();
          bVal = (b.author || "").toLowerCase();
          break;
        case "submissions":
          aVal = a.numOfSubmissions;
          bVal = b.numOfSubmissions;
          break;
        case "success":
          aVal = a.success ?? 0;
          bVal = b.success ?? 0;
          break;
        case "difficulty":
          const diffOrder: Record<string, number> = {
            "Prog 1": 1,
            "Prog 2": 2,
            DSA: 3,
          };
          aVal = diffOrder[a.difficulty] ?? 0;
          bVal = diffOrder[b.difficulty] ?? 0;
          break;
        default:
          return 0;
      }
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [problems, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedProblems.length / ITEMS_PER_PAGE);
  const paginatedProblems = sortedProblems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleRowClick = (id: number) => {
    router.push(inAdmin ? `/admin/problem/${id}` : `/problem/${id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      <div className="bg-vscode-light dark:bg-vscode-dark rounded-lg shadow overflow-hidden">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow>
              {inAdmin ? (
                <TableHead
                  onClick={() => handleSort("id")}
                  className="w-20 cursor-pointer select-none text-left"
                >
                  <div className="flex justify-between items-center">
                    <Hash className="mr-2 h-4 w-4" />
                    <span>#</span>
                    {getSortIcon("id")}
                  </div>
                </TableHead>
              ) : (
                <TableHead className="w-8"></TableHead>
              )}
              <TableHead
                onClick={() => handleSort("title")}
                className="cursor-pointer select-none text-left"
              >
                <div className="flex justify-between items-center text-left">
                  <div className="flex flex-row items-center justify-center">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Title</span>
                  </div>
                  {getSortIcon("title")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("author")}
                className="w-64 hidden md:table-cell cursor-pointer select-none text-left"
              >
                <div className="flex justify-between items-center text-left">
                  <div className="flex flex-row items-center justify-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Author</span>
                  </div>
                  {getSortIcon("author")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("submissions")}
                className="w-40 hidden md:table-cell cursor-pointer select-none text-left"
              >
                <div className="flex justify-between items-center text-left">
                  <div className="flex flex-row items-center justify-center">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Submissions</span>
                  </div>
                  {getSortIcon("submissions")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("success")}
                className="w-32 hidden md:table-cell cursor-pointer select-none text-left"
              >
                <div className="flex justify-between items-center text-left">
                  <div className="flex flex-row items-center justify-center">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    <span>Success</span>
                  </div>
                  {getSortIcon("success")}
                </div>
              </TableHead>
              <TableHead
                onClick={() => handleSort("difficulty")}
                className="w-32 cursor-pointer select-none text-left"
              >
                <div className="flex justify-between items-center text-left">
                  <span>Difficulty</span>
                  {getSortIcon("difficulty")}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProblems.map((problem, index) => (
              <TableRow
                key={index}
                onClick={() => handleRowClick(problem.id)}
                className="cursor-pointer odd:bg-neutral-100 odd:dark:bg-neutral-800 hover:bg-neutral-50 hover:dark:bg-neutral-700"
              >
                <TableCell className="font-medium truncate opacity-90">
                  {inAdmin
                    ? problem.id
                    : problem.status &&
                      problem.status === SubmissionStatusEnum.SOLVED && (
                        <CheckIcon className="text-green-500 size-4" />
                      )}
                </TableCell>
                <TableCell className="truncate w-full opacity-90">
                  <div className="font-medium">{problem.title}</div>
                </TableCell>
                <TableCell className="truncate hidden md:table-cell opacity-90">
                  <Badge variant="outline">{problem.author}</Badge>
                </TableCell>

                <TableCell className="overflow-hidden hidden md:table-cell opacity-90">
                  <Badge variant="outline">
                    {formatNumberCompact(problem.numOfSubmissions)}{" "}
                    {problem.numOfSubmissions === 1 ? "student" : "students"}
                  </Badge>
                </TableCell>
                <TableCell className="overflow-hidden hidden md:table-cell opacity-90">
                  <Badge
                    variant="outline"
                    className={cn(
                      (problem.success ?? 0) < 0.4 && "text-red-500",
                      (problem.success ?? 0) >= 0.4 &&
                        (problem.success ?? 0) < 0.7 &&
                        "text-yellow-500",
                      (problem.success ?? 0) >= 0.7 && "text-green-500",
                    )}
                  >
                    {formatPercentage(problem.success ?? 0)}
                  </Badge>
                </TableCell>

                <TableCell className="truncate opacity-90">
                  <Badge className={getDifficultyColor(problem.difficulty)}>
                    {problem.difficulty}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

const ProblemTable = ({
  problems,
  inAdmin = false,
  loading,
}: ProblemTableProps) => {
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);

  const problemsByCategory = useMemo(() => {
    const grouped: Record<string, ProblemSchemaDisplayResponseType[]> = {};

    problems.forEach((problem) => {
      if (problem.categories && problem.categories.length > 0) {
        problem.categories.forEach((category) => {
          if (!grouped[category]) {
            grouped[category] = [];
          }
          grouped[category].push(problem);
        });
      } else {
        // Problems without categories go into a default group
        if (!grouped["Uncategorized"]) {
          grouped["Uncategorized"] = [];
        }
        grouped["Uncategorized"].push(problem);
      }
    });

    return grouped;
  }, [problems]);

  const categoryKeys = Object.keys(problemsByCategory).sort();

  const handleToggleAll = () => {
    if (openAccordions.length === categoryKeys.length) {
      // All are open, close all
      setOpenAccordions([]);
    } else {
      // Open all
      setOpenAccordions(categoryKeys);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 py-8">Loading...</p>;
  }

  if (problems.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">
        No problems found matching your criteria.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggleAll}
          className="flex items-center gap-2"
        >
          {openAccordions.length === categoryKeys.length ? (
            <>
              <EyeOff className="h-4 w-4" />
              Hide All
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Show All
            </>
          )}
        </Button>
      </div>

      <Accordion
        type="multiple"
        className="w-full space-y-4"
        value={openAccordions}
        onValueChange={setOpenAccordions}
      >
        {categoryKeys.map((category) => (
          <AccordionItem
            key={category}
            value={category}
            className="border rounded-lg bg-vscode-light dark:bg-vscode-dark"
          >
            <AccordionTrigger className="px-6 py-4 hover:no-underline dark:bg-vscode-dark">
              <div className="flex items-center justify-between w-full mr-4">
                <span className="font-medium">
                  {category.replace(/^\./, "")}
                </span>
                <Badge variant="outline" className="ml-2">
                  {problemsByCategory[category].length} problem
                  {problemsByCategory[category].length !== 1 ? "s" : ""}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              <CategoryTable
                problems={problemsByCategory[category]}
                inAdmin={inAdmin}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ProblemTable;

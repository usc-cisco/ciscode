"use client";

import DropDownSelect from '@/components/home/drop-down-select';
import ProblemTable from '@/components/home/problem-table';
import SearchBar from '@/components/home/search-bar';
import CustomPagination from '@/components/shared/custom-pagination';
import ProtectedRoute from '@/components/shared/protected-route';
import { useAuth } from '@/contexts/auth.context';
import { ProblemSchemaDisplayResponseType } from '@/dtos/problem.dto';
import env from '@/lib/env';
import { fetchProblems } from '@/lib/fetchers/problem.fetchers';
import DifficultyEnum from '@/lib/types/enums/difficulty.enum';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { FormEventHandler, useCallback, useEffect, useState } from 'react'
import { set } from 'zod';

export default function Home() {
  const { token } = useAuth();
  const router = useRouter()
  const params = useSearchParams();

  const [page, setPage] = useState<number>(Number(params.get("page")) || 1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [difficultyFilter, setDifficultyFilter] = useState<string>(params.get("difficulty") || "all");
  const [filter, setFilter] = useState<string>(params.get("filter") || "");
  const [displayFilter, setDisplayFilter] = useState<string>(params.get("filter") || "");
  const [problems, setProblems] = useState<ProblemSchemaDisplayResponseType[]>([]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const newParams = new URLSearchParams(params.toString())
      newParams.set(name, value)

      return newParams.toString()
    },
    [params]
  )

  useEffect(() => {
    if (!token) return;

    // Fetch problems based on filters
    const getProblems = async () => {
      try {
        const response = await fetchProblems(
          token ?? "", 
          page,
          env.PROBLEM_LIMIT_PER_PAGE, 
          filter, 
          difficultyFilter !== "all" ? difficultyFilter : null
        );
        setProblems(response.data.problems || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    getProblems();
  }, [token, page, filter, difficultyFilter]);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    setFilter(displayFilter);
    router.push("/home?" + createQueryString("filter", filter)); // Reset to first page on filter change
  };

  const handleValueChange = (value: string) => {
    router.push("/home?" + createQueryString("difficulty", value));
    setDifficultyFilter(value);
  };

  const handlePageChange = (newPage: number) => {
    return () => {
      setPage(newPage);
    }
  }

  return (
    <ProtectedRoute>
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-8">
              <h3 className="text-2xl font-bold">Practice Problems</h3>
              <p>Choose from our curated collection of coding challenges</p>
            </div>

            {/* Filters */}
            <form className="flex flex-col sm:flex-row gap-4 mb-6" onSubmit={handleSubmit}>
              <SearchBar searchTerm={displayFilter} handleChange={setDisplayFilter} placeholder='Search problems...' />
              <DropDownSelect
                value={difficultyFilter}
                handleValueChange={handleValueChange}
                placeholder="Difficulty"
                pairs={[
                  { value: 'all', label: 'All Difficulties' },
                  { value: DifficultyEnum.PROG1, label: 'Prog 1' },
                  { value: DifficultyEnum.PROG2, label: 'Prog 2' },
                  { value: DifficultyEnum.DSA, label: 'DSA' },
                ]}
              />
              {/* <DropDownSelect
                value={statusFilter}
                handleValueChange={setStatusFilter}
                placeholder="Status"
                pairs={[
                  { value: 'all', label: 'All Status' },
                  { value: 'solved', label: 'Solved' },
                  { value: 'attempted', label: 'Attempted' },
                  { value: 'not-started', label: 'Not Started' },
                ]}
              /> */}
            </form>

          {/* Problems Table */}
          <ProblemTable problems={problems} />
          {
            totalPages > 1 &&
            <div className='my-4'>
              <CustomPagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} createQueryString={createQueryString} />
            </div>
          }
        </div>
      </section>
    </ProtectedRoute>
  )
}

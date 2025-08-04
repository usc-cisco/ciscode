"use client";

import DropDownSelect from '@/components/home/drop-down-select';
import ProblemTable from '@/components/home/problem-table';
import SearchBar from '@/components/home/search-bar';
import ProtectedRoute from '@/components/shared/protected-route';
import { useAuth } from '@/contexts/auth.context';
import { ProblemSchemaDisplayResponseType } from '@/dtos/problem.dto';
import env from '@/lib/env';
import { fetchProblems } from '@/lib/fetchers/problem.fetchers';
import DifficultyEnum from '@/lib/types/enums/difficulty.enum';
import ProblemStatusEnum from '@/lib/types/enums/problemstatus.enum';
import React, { FormEventHandler, useEffect, useState } from 'react'

export default function Home() {
  const { token } = useAuth();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedSearchTerm, setDisplayedSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [problems, setProblems] = useState<ProblemSchemaDisplayResponseType[]>([]);

  useEffect(() => {
    if (!token) return;

    // Fetch problems based on filters
    const getProblems = async () => {
      try {
        const response = await fetchProblems(token ?? "", page, env.PROBLEM_LIMIT_PER_PAGE, searchTerm, difficultyFilter !== "all" ? difficultyFilter : null);
        setProblems(response.data || []);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    getProblems();
  }, [token, searchTerm, difficultyFilter]);

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    setSearchTerm(displayedSearchTerm);
  };

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
              <SearchBar searchTerm={displayedSearchTerm} handleChange={setDisplayedSearchTerm} placeholder='Search problems...' />
              <DropDownSelect
                value={difficultyFilter}
                handleValueChange={setDifficultyFilter}
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
          </div>
      </section>
    </ProtectedRoute>
  )
}

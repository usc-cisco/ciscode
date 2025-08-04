"use client";

import DropDownSelect from '@/components/home/drop-down-select';
import ProblemTable from '@/components/home/problem-table';
import SearchBar from '@/components/home/search-bar';
import ProtectedRoute from '@/components/shared/protected-route';
import { ProblemSchemaDisplayResponseType } from '@/dtos/problem.dto';
import DifficultyEnum from '@/lib/types/enums/difficulty.enum';
import ProblemStatusEnum from '@/lib/types/enums/problemstatus.enum';
import React, { useState } from 'react'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const sampleProblems: ProblemSchemaDisplayResponseType[] = [
    {
      id: 1,
      title: "Two Sum",
      author: "John Doe",
      difficulty: DifficultyEnum.PROG1,
      acceptance: 75,
      status: ProblemStatusEnum.SOLVED
    },
    {
      id: 2,
      title: "Valid Parentheses",
      author: "Jane Smith",
      difficulty: DifficultyEnum.DSA,
      acceptance: 80,
      status: ProblemStatusEnum.NOT_STARTED
    },
    {
      id: 3,
      title: "Merge Two Sorted Lists",
      author: "Alice Johnson",
      difficulty: DifficultyEnum.PROG2,
      acceptance: 85,
      status: ProblemStatusEnum.ATTEMPTED
    }
  ];

  return (
    <ProtectedRoute>
      <div className="h-[calc(100vh-4rem)]">
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-8">
              <h3 className="text-2xl font-bold">Practice Problems</h3>
              <p>Choose from our curated collection of coding challenges</p>
            </div>

            {/* Filters */}
            <form className="flex flex-col sm:flex-row gap-4 mb-6">
              <SearchBar searchTerm={searchTerm} handleChange={setSearchTerm} placeholder='Search problems...' />
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
              <DropDownSelect
                value={statusFilter}
                handleValueChange={setStatusFilter}
                placeholder="Status"
                pairs={[
                  { value: 'all', label: 'All Status' },
                  { value: 'solved', label: 'Solved' },
                  { value: 'attempted', label: 'Attempted' },
                  { value: 'not-started', label: 'Not Started' },
                ]}
              />
            </form>

          {/* Problems Table */}
          <ProblemTable problems={sampleProblems} />
          </div>
      </section>
      </div>
    </ProtectedRoute>
  )
}

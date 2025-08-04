"use client";

import DropDownSelect from '@/components/home/drop-down-select';
import ProblemTable from '@/components/shared/problem-table';
import SearchBar from '@/components/home/search-bar';
import CustomPagination from '@/components/shared/custom-pagination';
import ProtectedRoute from '@/components/shared/protected-route';
import { useAuth } from '@/contexts/auth.context';
import { ProblemSchemaDisplayResponseType } from '@/dtos/problem.dto';
import env from '@/lib/env';
import { fetchProblems } from '@/lib/fetchers/problem.fetchers';
import DifficultyEnum from '@/lib/types/enums/difficulty.enum';
import { create } from 'domain';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { FormEventHandler, useCallback, useEffect, useState } from 'react'
import { set } from 'zod';
import ProblemContainer from '@/components/shared/problem-container';

export default function Home() {
  return (
    <ProtectedRoute>
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <h3 className="text-2xl font-bold">Practice Problems</h3>
            <p>Choose from our curated collection of coding challenges</p>
          </div>

          <ProblemContainer/>
        </div>
      </section>
    </ProtectedRoute>
  )
}

"use client";

import DropDownSelect from '@/components/home/drop-down-select';
import ProblemTable from '@/components/shared/problem-table';
import SearchBar from '@/components/home/search-bar';
import CustomPagination from '@/components/shared/custom-pagination';
import { useAuth } from '@/contexts/auth.context';
import { ProblemSchemaDisplayResponseType } from '@/dtos/problem.dto';
import env from '@/lib/env';
import { fetchProblems } from '@/lib/fetchers/problem.fetchers';
import DifficultyEnum from '@/lib/types/enums/difficulty.enum';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { FormEventHandler, useCallback, useEffect, useState } from 'react'
import { Button } from '../ui/button';

interface ProblemContainerProps {
    inAdmin?: boolean;
    verified?: boolean;
}

const ProblemContainer = ({ inAdmin, verified = true }: ProblemContainerProps) => {
    const { token } = useAuth();
    const router = useRouter()
    const params = useSearchParams();
    const path = inAdmin ? "/admin" : "/home";

    const [loading, setLoading] = useState<boolean>(true);    
    const [page, setPage] = useState<number>(Number(params.get("page")) || 1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [difficultyFilter, setDifficultyFilter] = useState<string>(params.get("difficulty") || "all");
    const [filter, setFilter] = useState<string>(params.get("filter") || "");
    const [displayFilter, setDisplayFilter] = useState<string>(params.get("filter") || "");
    const [problems, setProblems] = useState<ProblemSchemaDisplayResponseType[]>([]);

    const createQueryString = useCallback(
        (data: {name: string, value: string}[]) => {
            const newParams = new URLSearchParams(params.toString())
            data.forEach(({name, value}) => {
                newParams.set(name, value)
            })
            
            return newParams.toString()
        },
        [params]
    )
    
    useEffect(() => {
        if (!token) return;
        
        setLoading(true);

        // Fetch problems based on filters
        const getProblems = async () => {
            try {
                const response = await fetchProblems(
                token ?? "", 
                page,
                env.PROBLEM_LIMIT_PER_PAGE, 
                filter, 
                difficultyFilter !== "all" ? difficultyFilter : null,
                verified
                );
                setProblems(response.data.problems || []);
                setTotalPages(response.data.totalPages || 1);

                if (page !== 1 && response.data.problems.length === 0) {
                    setPage(1);
                    setTotalPages(1);
                    router.push(path + "?" + createQueryString([{name: "page", value: "1"}]));
                }
            } catch (error) {
                console.error("Error fetching problems:", error);
            }
            finally{
                setLoading(false);
            }
        };

        getProblems();
    }, [token, page, filter, difficultyFilter, verified, createQueryString, path, router]);

const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page on filter change
    setFilter(displayFilter);
    router.push(path + "?" + createQueryString([{name: "page", value: "1"}, {name: "filter", value: displayFilter}]));
};

const handleValueChange = (value: string) => {
    router.push(path + "?" + createQueryString([{name: "page", value: "1"}, {name: "difficulty", value}]));
    setPage(1);
    setDifficultyFilter(value);
};

const handlePageChange = (newPage: number) => {
    return () => {
        setPage(newPage);
    }
}

return (
    <>
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
            {inAdmin && verified && (
                <Button type='button' className="cursor-pointer w-full md:w-32" onClick={() => router.push("/admin/problem/add")}>
                    Add Problem
                </Button>
            )}
        </form>
        
        {/* Problems Table */}
        <ProblemTable problems={problems} inAdmin={inAdmin} loading={loading} />
        {
            totalPages > 1 &&
            <div className='mt-8'>
                <CustomPagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} createQueryString={createQueryString} path={path}/>
            </div>
        }
    </>
  )
}

export default ProblemContainer

"use client";

import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ProblemSchemaDisplayResponseType } from '@/dtos/problem.dto'
import { useRouter } from 'next/navigation';
import { getDifficultyColor } from '@/lib/types/enums/difficulty.enum';
import { CheckIcon } from 'lucide-react';
import SubmissionStatusEnum from '@/lib/types/enums/problemstatus.enum';

interface ProblemTableProps {
  problems: ProblemSchemaDisplayResponseType[]
  inAdmin?: boolean;
  loading: boolean;
}

const ProblemTable = ({ problems, inAdmin = false, loading }: ProblemTableProps) => {
    const router = useRouter();

    const handleRowClick = (id: number) => {
        router.push(inAdmin ? `/admin/problem/${id}` : `/problem/${id}`);
    }

  return (
    <>
        <div className="bg-vscode-light dark:bg-vscode-dark rounded-lg shadow overflow-hidden">
            <Table>
                <TableHeader>
                <TableRow>
                    {inAdmin 
                    ? 
                    <TableHead className="w-16">#</TableHead>
                    :
                    <TableHead className="w-3"></TableHead>
                    }
                    <TableHead>Title</TableHead>
                    <TableHead className='w-40'>Author</TableHead>
                    <TableHead className='w-40'>Difficulty</TableHead>
                    {/* <TableHead>Acceptance</TableHead> */}
                    {/* <TableHead>Status</TableHead> */}
                </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        loading
                        ||
                        problems.map((problem, index) => (
                            <TableRow key={index} onClick={() => handleRowClick(problem.id)} className="cursor-pointer odd:bg-neutral-100 odd:dark:bg-neutral-800">
                                <TableCell className="font-medium">{inAdmin ? problem.id : (problem.status && problem.status === SubmissionStatusEnum.SOLVED && <CheckIcon className='text-green-500 size-4' />)}</TableCell>
                                <TableCell className='truncate table-fixed flex-1'>
                                    <div className="font-medium">{problem.title}</div>
                                </TableCell>
                                <TableCell className='truncate table-fixed'>
                                    <Badge variant="outline">{problem.author}</Badge>
                                </TableCell>
                                <TableCell className='truncate table-fixed'>
                                    <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>
         {loading ? 
         <p className="text-center text-gray-500 py-8">
            Loading...
        </p>
         :
         problems.length === 0 && (
            <p className="text-center text-gray-500 py-8">
                No problems found matching your criteria.
            </p>
        )}
    </>
  )
}

export default ProblemTable

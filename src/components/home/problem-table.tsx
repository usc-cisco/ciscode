"use client";

import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ProblemSchemaDisplayResponseType } from '@/dtos/problem.dto'
import { useRouter } from 'next/navigation';
import { getDifficultyColor } from '@/lib/types/enums/difficulty.enum';
import { getStatusColor } from '@/lib/types/enums/problemstatus.enum';

interface ProblemTableProps {
  problems: ProblemSchemaDisplayResponseType[]
}

const ProblemTable = ({ problems }: ProblemTableProps) => {
    const router = useRouter();

    const handleRowClick = (id: number) => {
        router.push(`/problem/${id}`);
    }

  return (
    <>
        <div className="bg-vscode-light dark:bg-vscode-dark rounded-lg shadow overflow-hidden">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Acceptance</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {problems.map((problem) => (
                    <TableRow onClick={() => handleRowClick(problem.id)} key={problem.id} className="cursor-pointer odd:bg-neutral odd:dark:bg-neutral-800">
                        <TableCell className="font-medium">{problem.id}</TableCell>
                        <TableCell>
                            <div className="font-medium">{problem.title}</div>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline">{problem.author}</Badge>
                        </TableCell>
                        <TableCell>
                            <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                        </TableCell>
                        <TableCell>
                            {problem.acceptance ? problem.acceptance.toFixed(1) : "0.0" }%
                        </TableCell>
                        <TableCell>
                            <Badge className={getStatusColor(problem.status)}>{problem.status}</Badge>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </div>
         {problems.length === 0 && (
            <div className="text-center text-gray-500 py-8">
                No problems found matching your criteria.
            </div>
        )}
    </>
  )
}

export default ProblemTable

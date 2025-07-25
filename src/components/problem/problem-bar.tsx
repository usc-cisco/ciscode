import React from 'react'
import ProblemCard from './problem-card';
import { ProblemSchemaResponseType } from '@/dtos/problem.dto';

interface ProblemBarProps {
    problem: ProblemSchemaResponseType;
}

const ProblemBar: React.FC<ProblemBarProps> = ({ problem }) => {
  const { title, author, description } = problem;
  return (
    <ProblemCard classList='p-6 overflow-y-scroll'>
        <h1 className='text-xl font-semibold'>{title}</h1>
        <p className='text-sm text-muted-foreground'>By {author}</p>

        <div className='mt-4 text-sm'>
            {/* Maybe add a markdown renderer */}
            <p>{description}</p>
        </div>
    </ProblemCard>
  )
}

export default ProblemBar

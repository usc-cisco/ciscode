import React from 'react'
import ProblemCard from './problem-card';
import { ProblemSchemaResponseType } from '@/dtos/problem.dto';
import { Badge } from '../ui/badge';
import { getDifficultyColor } from '@/lib/types/enums/difficulty.enum';
import { cn } from '@/lib/utils';

interface ProblemBarProps {
    problem: ProblemSchemaResponseType;
}

const ProblemBar: React.FC<ProblemBarProps> = ({ problem }) => {
  const { title, difficulty, author, description } = problem;
  return (
    <ProblemCard className='p-6 overflow-y-auto hide-scrollbar'>
        <div className='flex gap-2 justify-between'>
          <h1 className='text-xl font-semibold truncate'>{title}</h1>
          <div className='flex items-center'>
            <Badge className={cn(getDifficultyColor(difficulty), "rounded-xl text-xs px-3")}>{difficulty}</Badge>
          </div>
        </div>
        <p className='text-sm text-muted-foreground'>By {author}</p>

        <div className='mt-4 text-sm'>
            {/* Maybe add a markdown renderer */}
            <p>{description}</p>
        </div>
    </ProblemCard>
  )
}

export default ProblemBar

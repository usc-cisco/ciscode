import React from 'react'
import ProblemCard from '@/components/problem/problem-card';
import { Button } from '@/components/ui/button';
import DifficultyEnum, { getDifficultyColor } from '@/lib/types/enums/difficulty.enum';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Trash2Icon } from 'lucide-react';

interface AdminProblemBarProps {
    problem: {
        title: string;
        description: string;
        difficulty: string;
    };
    onProblemChange: (field: string, value: string | DifficultyEnum) => void;
    onSave: () => void;
    onDelete?: () => void;
    canSubmit: boolean;
}

const AdminProblemBar: React.FC<AdminProblemBarProps> = ({ problem, onProblemChange, onSave, onDelete, canSubmit }) => {
  const { title, difficulty, description } = problem;
  return (
    <ProblemCard className='overflow-hidden hide-scrollbar relative'>
        <div className='p-6 max-h-full overflow-y-auto overflow-x-hidden pb-26'>
            <input className='text-xl font-semibold truncate max-w-full' placeholder={'Title here...'} value={title} onChange={(e) => onProblemChange('title', e.target.value)}/>
            <div className='flex justify-between gap-2 items-center py-2'>
                <p className='text-sm font-semibold'>Difficulty: </p>
                <div className='flex gap-2 items-center'>
                    <Badge className={cn(getDifficultyColor(DifficultyEnum.PROG1), `${difficulty === DifficultyEnum.PROG1 ? 'opacity-100' : 'opacity-40'} cursor-pointer rounded-xl`)} onClick={() => onProblemChange('difficulty', DifficultyEnum.PROG1)}>{DifficultyEnum.PROG1}</Badge>
                    <Badge className={cn(getDifficultyColor(DifficultyEnum.PROG2), `${difficulty === DifficultyEnum.PROG2 ? 'opacity-100' : 'opacity-40'} cursor-pointer rounded-xl`)} onClick={() => onProblemChange('difficulty', DifficultyEnum.PROG2)}>{DifficultyEnum.PROG2}</Badge>
                    <Badge className={cn(getDifficultyColor(DifficultyEnum.DSA), `${difficulty === DifficultyEnum.DSA ? 'opacity-100' : 'opacity-40'} cursor-pointer rounded-xl`)} onClick={() => onProblemChange('difficulty', DifficultyEnum.DSA)}>{DifficultyEnum.DSA}</Badge>
                </div>
            </div>

            <div className='mt-4 text-sm h-full'>
            {/* Maybe add a markdown renderer */}
                <textarea className='w-full min-h-96 resize-y' placeholder='Description here...' value={description} onChange={(e) => onProblemChange('description', e.target.value)}></textarea>
            </div>
        </div>

        <div className='px-2 h-14 absolute bottom-0 w-full border-t border-gray-200 dark:border-gray-700 flex justify-center items-center bg-vscode-light dark:bg-vscode-dark z-10 gap-2'>
          <Button className={`bg-primary py-2 rounded-lg cursor-pointer flex-1 ${canSubmit ? 'opacity-100' : 'opacity-40 pointer-events-none'}`} onClick={onSave}>Save Problem</Button>
          {onDelete && <Button className='bg-red-400 hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600 transition-colors py-2 rounded-lg cursor-pointer' onClick={onDelete}><Trash2Icon /></Button>}
        </div>
    </ProblemCard>
  )
}

export default AdminProblemBar

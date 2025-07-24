import { cn } from '@/lib/utils';
import React from 'react'

interface ProblemCardProps {
    children?: React.ReactNode;
    classList?: string;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ children, classList }) => {
  return (
    <div className='px-1 py-2'>
        <div className={cn(`h-full w-full bg-vscode-light dark:bg-vscode-dark rounded-2xl`, classList)}>
          {children}
        </div>
    </div>
  )
}

export default ProblemCard

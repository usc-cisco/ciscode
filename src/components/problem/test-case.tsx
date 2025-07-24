import { cn } from '@/lib/utils';
import { stat } from 'fs';
import { ChevronDown, Circle, CircleCheck, CircleX, Play } from 'lucide-react';
import React from 'react'
import { FaPlay } from "react-icons/fa";


interface TestCaseProps {
    testCaseNumber: number;
    status: 'passed' | 'failed' | 'neutral'; // Change to enum
    isHidden?: boolean; // Optional prop to hide the test case
}

const TestCase: React.FC<TestCaseProps> = ({ testCaseNumber, status, isHidden }) => {
    let StatusIcon: React.ElementType = Circle;
    let statusClassName: string = 'text-gray-300 dark:text-gray-600';

    switch(status) {
        case 'passed':
            StatusIcon = CircleCheck;
            statusClassName = 'text-green-500';
            break;
        case 'failed':
            StatusIcon = CircleX;
            statusClassName = 'text-red-500';
            break;
    }

  return (
    <div className={`w-full h-14 flex items-center justify-between px-2 rounded-xl shadow-md ${isHidden ? 'cursor-not-allowed opacity-50' : 'cursor-pointer bg-vscode-light dark:bg-vscode-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200'}`}>
        <div className='flex items-center gap-2 px-2'>
            <StatusIcon className={cn('size-4', statusClassName)} />
            <p className='text-sm font-semibold'>Test case #{testCaseNumber}</p>
            {isHidden && (
                <p className='text-xs text-gray-500'>Hidden</p>
            )}
        </div>

        <button className={`relative rounded-full flex items-center justify-center border border-primary size-6 ${isHidden || ' hover:bg-background cursor-pointer'}`}>
            <FaPlay className='size-2 text-primary absolute left-2' />
        </button>
    </div>
  )
}

export default TestCase

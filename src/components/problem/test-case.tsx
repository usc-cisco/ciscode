import { TestCaseResponseType } from '@/dtos/testcase.dto';
import SubmissionStatusEnum from '@/lib/types/enums/submissionstatus.enum';
import { cn } from '@/lib/utils';
import { stat } from 'fs';
import { ChevronDown, Circle, CircleCheck, CircleX, Play } from 'lucide-react';
import React, { useState } from 'react'
import { FaPlay } from "react-icons/fa";
import { ClipLoader } from 'react-spinners';


interface TestCaseProps {
    testCaseNumber: number;
    testCase: TestCaseResponseType;
    onStatusChange: (status: SubmissionStatusEnum) => void;
}

const TestCase: React.FC<TestCaseProps> = ({ testCaseNumber, testCase, onStatusChange }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [sending, setSending] = useState(false);

    let StatusIcon: React.ElementType = Circle;
    let statusClassName: string = 'text-gray-300 dark:text-gray-600';

    switch(testCase.status) { 
        case SubmissionStatusEnum.COMPLETED:
            StatusIcon = CircleCheck;
            statusClassName = 'text-green-500';
            break;
        case SubmissionStatusEnum.FAILED:
            StatusIcon = CircleX;
            statusClassName = 'text-red-500';
            break;
    }
    
    const handleToggleDetails = () => {
        if (!testCase.hidden) {
            setShowDetails(!showDetails);
        }
    }

    const handleGetOutput = async () => {
        // Start off with a loading state
        onStatusChange(SubmissionStatusEnum.PENDING);
        setSending(true);

        setSending(false);
    };

  return (
    <div className={`w-full flex flex-col justify-center rounded-xl shadow-md bg-vscode dark:bg-vscode-dark transition-all duration-200 relative`}>
        <button onClick={handleToggleDetails} className='flex items-center px-2 py-4 justify-between w-full h-full rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer select-none'>
            <div className='flex items-center gap-2 px-2 h-full'>
                <StatusIcon className={cn('size-4', statusClassName)} />
                <p className='text-sm font-semibold'>Test case #{testCaseNumber}</p>
                {testCase.hidden && (
                    <p className='text-xs text-gray-500'>Hidden</p>
                )}
            </div>
        </button>

        {sending ? (
                <ClipLoader size={20} color='#1752F0' className='absolute top-4 right-2 size-4 text-primary' />
        ) : (
            <button onClick={() => {}} className={`absolute top-4 right-2 rounded-full flex items-center justify-center border border-primary size-6 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer transition-colors`}>
                <FaPlay className='size-2 text-primary absolute left-[0.45rem]' />
            </button>
        )}

        {
            showDetails
            &&
            !testCase.hidden
            &&
            (
                <div className='flex flex-col gap-2 px-4 py-2 w-full text-xs'>
                    <div className='flex flex-col gap-2 h-full'>
                        <label className='font-semibold'>Expected Output:</label>
                        <div className='bg-neutral-100 dark:bg-neutral-800 rounded-sm p-2 text-gray-400 overflow-x-auto h-auto'>
                            <code className='whitespace-pre text-foreground h-full'>
                                {testCase.output || 'No output provided.'}
                            </code>
                        </div>
                    </div>
                    <div className='flex flex-col gap-2 h-full'>
                        <label className='font-semibold'>Actual Output:</label>
                        <div className='bg-neutral-100 dark:bg-neutral-800 rounded-sm p-2 text-gray-400 overflow-x-auto h-auto'>
                            <code className='whitespace-pre text-foreground h-full'>
                                {testCase.output || 'No output provided.'}
                            </code>
                        </div>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default TestCase

import { CheckCodeResponseType, RunCodeResponseType } from '@/dtos/code.dto';
import { TestCaseResponseType } from '@/dtos/testcase.dto';
import SubmissionStatusEnum from '@/lib/types/enums/submissionstatus.enum';
import { cn } from '@/lib/utils';
import { stat } from 'fs';
import { ChevronDown, Circle, CircleCheck, CircleX, Play } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { FaPlay } from "react-icons/fa";
import { ClipLoader } from 'react-spinners';
import { set } from 'zod';


interface TestCaseProps {
    testCaseNumber: number;
    testCase: TestCaseResponseType;
    onChange: (field: string, value: string | boolean) => void;
    onCheckCode: (testCase: TestCaseResponseType) => Promise<CheckCodeResponseType>;
    submitted: boolean;
    sending: boolean;
}

const TestCase: React.FC<TestCaseProps> = ({ testCaseNumber, testCase, onChange, onCheckCode, submitted, sending }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [checking, setChecking] = useState(submitted);

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

    const handleStatusChange = (status: SubmissionStatusEnum) => {
        onChange('status', status);
    };

    const handleCheckCode = async () => {
        setChecking(true);
        onChange('actualOutput', "Loading...");
        onChange('status', SubmissionStatusEnum.PENDING);

        const { output, error, status } = await onCheckCode(testCase);
        
        if (output) {
            onChange('actualOutput', output);
        }
        else if (error) {
            onChange('actualOutput', error || "An error occurred while checking the code.");
        }
        else {
            onChange('actualOutput', "");
        }

        handleStatusChange(status);
        setChecking(false);
    };

    useEffect(() => {
        setChecking(submitted);

        if (submitted) {
            onChange('status', SubmissionStatusEnum.PENDING);
            onChange('actualOutput', "Loading...");
        }

    }, [submitted]);

  return (
    <div className={`w-full flex flex-col justify-center rounded-xl shadow-md bg-vscode dark:bg-vscode-dark transition-all duration-200 relative`}>
        <button onClick={handleToggleDetails} className={`flex items-center px-2 py-4 justify-between w-full h-full rounded-xl select-none ${testCase.hidden ? 'cursor-not-allowed' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer'}`}>
            <div className='flex items-center gap-2 px-2 h-full'>
                <StatusIcon className={cn('size-4', statusClassName)} />
                <p className='text-sm font-semibold'>Test case #{testCaseNumber}</p>
                {testCase.hidden && (
                    <p className='text-xs text-gray-500'>Hidden</p>
                )}
            </div>
        </button>

        {checking ? (
                <ClipLoader size={20} color='#1752F0' className='absolute top-4 right-2 size-4 text-primary' />
        ) : (
            <button onClick={handleCheckCode} className={`absolute top-4 right-2 rounded-full flex items-center justify-center border border-primary size-6 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer transition-colors ${sending && 'pointer-events-none opacity-50'}`}>
                <FaPlay className='size-2 text-primary absolute left-[0.45rem]' />
            </button>
        )}

        {
            showDetails
            &&
            !testCase.hidden
            &&
            (
                <div className='flex flex-col gap-2 px-4 pt-2 pb-4 w-full text-xs'>
                    <div className='flex flex-col gap-2 h-full'>
                        <label className='font-semibold'>Expected Output:</label>
                        {
                            testCase.output 
                            ?
                            <div className='bg-neutral-100 dark:bg-neutral-800 rounded-sm p-2 text-gray-400 overflow-x-auto min-h-2'>
                                <p className='whitespace-pre text-foreground min-h-3 font-mono'>
                                    {testCase.output}
                                </p>
                            </div>
                            :
                            <p className='text-neutral-400 dark:text-neutral-600 pb-2'>No output provided.</p>
                        }
                    </div>
                    <div className='flex flex-col gap-2 h-full'>
                        <label className='font-semibold'>Actual Output:</label>
                        {
                            testCase.actualOutput
                            ?
                            <div className='bg-neutral-100 dark:bg-neutral-800 rounded-sm p-2 text-gray-400 overflow-x-auto min-h-2'>
                                <p className='whitespace-pre text-foreground min-h-3 font-mono'>
                                    {testCase.actualOutput}
                                </p>
                            </div>
                            :
                            <p className='text-neutral-400 dark:text-neutral-600 pb-2'>No output provided.</p>
                        }
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default TestCase

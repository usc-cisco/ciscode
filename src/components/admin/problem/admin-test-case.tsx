import Markdown from '@/components/shared/markdown';
import { Button } from '@/components/ui/button';
import { RunCodeResponseType } from '@/dtos/code.dto';
import { AddTestCaseSchemaType } from '@/dtos/testcase.dto';
import TestCaseSubmissionStatusEnum from '@/lib/types/enums/submissionstatus.enum';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Circle, CircleCheck, CircleX, Delete, DeleteIcon, Trash } from 'lucide-react';
import React, { useState } from 'react'
import { FaPlay } from "react-icons/fa";
import { ClipLoader } from 'react-spinners';


interface AdminTestCaseProps {
    testCaseNumber: number;
    testCase: AddTestCaseSchemaType;
    isHidden?: boolean; // Optional prop to hide the test case
    onChange: (field: string, value: string | boolean) => void;
    onDelete: () => void;
    handleCheckCode: (testCase: AddTestCaseSchemaType) => Promise<RunCodeResponseType>;
}

const AdminTestCase: React.FC<AdminTestCaseProps> = ({ testCaseNumber, testCase, isHidden, onChange, onDelete, handleCheckCode }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [sending, setSending] = useState(false);

    let StatusIcon: React.ElementType = Circle;
    let statusClassName: string = 'text-gray-300 dark:text-gray-600';

    switch(testCase.status) {
        case TestCaseSubmissionStatusEnum.COMPLETED:
            StatusIcon = CircleCheck;
            statusClassName = 'text-green-500';
            break;
        case TestCaseSubmissionStatusEnum.FAILED:
            StatusIcon = CircleX;
            statusClassName = 'text-red-500';
            break;
    }
    
    const handleToggleDetails = () => {
        setShowDetails(!showDetails);
    }
    
    const handleToggleHidden = () => {
        onChange('hidden', !isHidden);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange('input', e.target.value);
    };

    const handleGetOutput = async () => {
        // Start off with a loading state
        onChange('output', "Loading...");
        onChange('status', TestCaseSubmissionStatusEnum.PENDING);
        setSending(true);

        // Check code and get output
        const { output, error } = await handleCheckCode(testCase);

        
        if (output) {
            onChange('output', output);
            onChange('status', error ? TestCaseSubmissionStatusEnum.FAILED : TestCaseSubmissionStatusEnum.COMPLETED);
        }
        else if (error) {
            onChange('output', error || "An error occurred while checking the code.");
            onChange('status', TestCaseSubmissionStatusEnum.FAILED);
        }
        else {
            onChange('output', "No output received.");
            onChange('status', TestCaseSubmissionStatusEnum.COMPLETED);
        }

        setSending(false);
    };
  
    return (
    <div className={`w-full flex flex-col justify-center rounded-xl shadow-md bg-vscode dark:bg-vscode-dark transition-all duration-200 relative`}>
        <button onClick={handleToggleDetails} className='flex items-center px-2 py-4 justify-between w-full h-full rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer select-none'>
            <div className='flex items-center gap-2 px-2 h-full'>
                <StatusIcon className={cn('size-4', statusClassName)} />
                <p className='text-sm font-semibold'>Test case #{testCaseNumber}</p>
                {isHidden && (
                    <p className='text-xs text-gray-500'>Hidden</p>
                )}
            </div>
        </button>

        {sending ? (
                <ClipLoader size={20} color='#1752F0' className='absolute top-4 right-2 size-4 text-primary' />
        ) : (
            <button onClick={handleGetOutput} className={`absolute top-4 right-2 rounded-full flex items-center justify-center border border-primary size-6 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer transition-colors`}>
                <FaPlay className='size-2 text-primary absolute left-[0.45rem]' />
            </button>
        )}

        {
            showDetails
            &&
            (
                <div className='flex flex-col gap-2 px-4 pt-2 pb-4 w-full text-xs'>
                    <div className='flex flex-col gap-2'>
                        <label className='font-semibold mt-1'>Input:</label>
                        <textarea
                            value={testCase.input}
                            className='w-full p-1 min-h-40 border border-gray-300 rounded-md dark:border-gray-600'
                            placeholder='New line after each input...'
                            onChange={handleInputChange}
                        ></textarea>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='font-semibold'>Hidden:</label>
                        <button onClick={handleToggleHidden} className={cn('p-1 rounded-full cursor-pointer', isHidden ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900')}>
                            {isHidden ? <CircleCheck className='size-4 text-green-500' /> : <CircleX className='size-4 text-red-500' />}
                        </button>
                    </div>

                    <div className='flex flex-col gap-2 h-full'>
                        <label className='font-semibold'>Output:</label>
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

                    <Button className='w-full bg-red-500 dark:bg-red-900 hover:dark:bg-red-800 text-white hover:bg-red-600 mt-4 cursor-pointer' variant="destructive" size="sm" onClick={onDelete}>
                        <Trash className='size-4' onClick={onDelete} />
                        Delete Test Case
                    </Button>
                </div>
            )
        }
    </div>
  )
}

export default AdminTestCase

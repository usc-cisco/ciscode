import { Button } from '@/components/ui/button';
import { AddTestCaseSchemaType } from '@/dtos/testcase.dto';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Circle, CircleCheck, CircleX, Delete, DeleteIcon, Trash } from 'lucide-react';
import React, { useState } from 'react'
import { FaPlay } from "react-icons/fa";


interface AdminTestCaseProps {
    testCaseNumber: number;
    testCase: AddTestCaseSchemaType;
    isHidden?: boolean; // Optional prop to hide the test case
    onChange: (field: string, value: string | boolean) => void;
    onDelete: () => void;
}

const AdminTestCase: React.FC<AdminTestCaseProps> = ({ testCaseNumber, testCase, isHidden, onChange, onDelete }) => {
    const [showDetails, setShowDetails] = useState(false);
    
    const handleToggleDetails = () => {
        setShowDetails(!showDetails);
    }
    
    const handleToggleHidden = () => {
        onChange('hidden', !isHidden);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange('input', e.target.value);
    };
  
    return (
    <div className={`w-full min-h-14 flex flex-col justify-center p-2 rounded-xl shadow-md bg-vscode dark:bg-vscode-dark transition-all duration-200`}>
        <div className='flex items-center justify-between w-full'>
            <div className='flex items-center gap-2 px-2'>
                <Button variant="ghost" onClick={handleToggleDetails} className='cursor-pointer'>
                    <ChevronDown className={`size-4 transition-transform ${showDetails && '-rotate-180'}`}/>
                </Button>
                <p className='text-sm font-semibold'>Test case #{testCaseNumber}</p>
                {isHidden && (
                    <p className='text-xs text-gray-500'>Hidden</p>
                )}
            </div>
            <button className={`relative rounded-full flex items-center justify-center border border-primary size-6 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer transition-colors`}>
                <FaPlay className='size-2 text-primary absolute left-[0.45rem]' />
            </button>
        </div>

        {
            showDetails
            &&
            (
                <div className='flex flex-col gap-2 px-4 py-2 w-full text-xs'>
                    <div className='flex gap-2'>
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

                    <div className='flex items-center gap-2'>
                        <label className='font-semibold'>Output:</label>
                        <p>
                            {testCase.output || 'No output provided'}
                        </p>
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

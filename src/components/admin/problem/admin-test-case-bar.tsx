import React from 'react'
import ProblemCard from '@/components/problem/problem-card'
import { Button } from '@/components/ui/button'
import { AddTestCaseSchemaType } from '@/dtos/testcase.dto';
import AdminTestCase from './admin-test-case';

interface AdminTestCaseBarProps {
  testCases: AddTestCaseSchemaType[];
  onAddTestCase: () => void;
  onTestCaseChange: (index: number) => (field: string, value: string | boolean) => void;
  onDeleteTestCase: (index: number) => () => void;
  handleCheckCode: (testCase: AddTestCaseSchemaType) => Promise<string | undefined>;
}

const AdminTestCaseBar: React.FC<AdminTestCaseBarProps> = ({ testCases, onAddTestCase, onTestCaseChange, onDeleteTestCase, handleCheckCode }) => {
  return (
    <ProblemCard className='relative overflow-hidden'>
        <div className='px-4 py-3 rounded-t-xl border-b border-gray-200 dark:border-gray-700'>
            <p className='text-sm text-center font-semibold'>Test Cases</p>
        </div>

        <div className='max-h-full overflow-auto pb-26'>
          <div className='px-4 py-2 flex flex-col gap-2'>
            {
              testCases.map((testCase, index) => (
                  <AdminTestCase
                      key={index}
                      testCaseNumber={index + 1}
                      testCase={testCase}
                      isHidden={testCase.hidden}
                      onChange={onTestCaseChange(index)}
                      onDelete={onDeleteTestCase(index)}
                      handleCheckCode={handleCheckCode}
                  />
              ))
            }
          </div>
        </div>

        <div className='px-4 h-14 absolute bottom-0 w-full border-t border-gray-200 dark:border-gray-700 flex justify-center items-center bg-vscode-light dark:bg-vscode-dark'>
          <Button className='w-full bg-primary py-2 rounded-lg cursor-pointer' onClick={onAddTestCase}>Add Test Case</Button>
        </div>
    </ProblemCard>
  )
}

export default AdminTestCaseBar
import React from 'react'
import ProblemCard from './problem-card'
import { Button } from '../ui/button'
import TestCase from './test-case'
import { TestCaseResponseType } from '@/dtos/testcase.dto'
import { CheckCodeResponseType } from '@/dtos/code.dto'

interface TestCaseBarProps {
  testCases: TestCaseResponseType[];
  onSubmit: () => void;
  onEditTestCase: (index: number) => (field: string, value: string | boolean) => void;
  onCheckCode: (testCase: TestCaseResponseType) => Promise<CheckCodeResponseType>;
}

const TestCaseBar: React.FC<TestCaseBarProps> = ({ testCases, onSubmit, onEditTestCase, onCheckCode }) => {
  return (
    <ProblemCard className='relative overflow-hidden'>
        <div className='px-4 py-3 rounded-t-xl border-b border-gray-200 dark:border-gray-700'>
            <p className='text-sm text-center font-semibold'>Test Cases</p>
        </div>

        <div className='max-h-full overflow-auto pb-26'>
          <div className='px-4 py-2 flex flex-col gap-2'>
            {
              testCases.map((testCase, index) => (
                  <TestCase
                      key={index}
                      testCaseNumber={index + 1}
                      testCase={testCase}
                      onChange={onEditTestCase(index)}
                      onCheckCode={onCheckCode}
                  />
              ))
            }
          </div>
        </div>

        <div className='px-4 h-14 absolute bottom-0 w-full border-t border-gray-200 dark:border-gray-700 flex justify-center items-center bg-vscode-light dark:bg-vscode-dark'>
          <Button className='w-full bg-primary py-2 rounded-lg cursor-pointer' onClick={onSubmit}>Submit</Button>
        </div>
    </ProblemCard>
  )
}

export default TestCaseBar

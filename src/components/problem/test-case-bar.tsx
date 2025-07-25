import React from 'react'
import ProblemCard from './problem-card'
import { Button } from '../ui/button'
import TestCase from './test-case'

interface TestCaseBarProps {
  onSubmit?: () => void;
}

const TestCaseBar: React.FC<TestCaseBarProps> = ({ onSubmit }) => {
  return (
    <ProblemCard className='relative overflow-hidden'>
        <div className='px-4 py-3 rounded-t-xl border-b border-gray-200 dark:border-gray-700'>
            <p className='text-sm text-center font-semibold'>Test Cases</p>
        </div>

        <div className='max-h-full overflow-auto pb-26'>
          <div className='px-4 py-2 flex flex-col gap-2'>
            <TestCase testCaseNumber={1} status='passed' isHidden/>
            <TestCase testCaseNumber={2} status='failed'/>
            <TestCase testCaseNumber={3} status='neutral'/>
            <TestCase testCaseNumber={1} status='passed'/>
            <TestCase testCaseNumber={2} status='failed'/>
            <TestCase testCaseNumber={3} status='neutral'/>
            <TestCase testCaseNumber={1} status='passed'/>
            <TestCase testCaseNumber={2} status='failed'/>
            <TestCase testCaseNumber={3} status='neutral'/>
            <TestCase testCaseNumber={1} status='passed'/>
            <TestCase testCaseNumber={2} status='failed'/>
            <TestCase testCaseNumber={3} status='neutral'/>
            <TestCase testCaseNumber={1} status='passed'/>
            <TestCase testCaseNumber={2} status='failed'/>
            <TestCase testCaseNumber={3} status='neutral'/>
          </div>
        </div>

        <div className='px-4 h-14 absolute bottom-0 w-full border-t border-gray-200 dark:border-gray-700 flex justify-center items-center bg-vscode-light dark:bg-vscode-dark'>
          <Button className='w-full bg-primary py-2 rounded-lg cursor-pointer' onClick={onSubmit}>Submit</Button>
        </div>
    </ProblemCard>
  )
}

export default TestCaseBar

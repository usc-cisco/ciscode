import React from 'react'
import ProblemCard from './problem-card'

const TestCaseBar = () => {
  return (
    <ProblemCard classList='overflow-scroll'>
        <div className='px-4 py-3 rounded-t-xl border-b border-gray-200 dark:border-gray-700'>
            <p className='text-sm text-center font-semibold'>Test Cases</p>
        </div>
    </ProblemCard>
  )
}

export default TestCaseBar

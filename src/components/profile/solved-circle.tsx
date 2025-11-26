"use client";

import React from "react";

interface SolvedCircleProps {
  totalSolved: number;
  totalProblems: number;
}

const SolvedCircle = ({ totalSolved, totalProblems }: SolvedCircleProps) => {
  const percentage =
    totalProblems > 0 ? (totalSolved / totalProblems) * 100 : 0;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-48 h-48">
        <svg
          className="transform -rotate-90"
          width="192"
          height="192"
          viewBox="0 0 192 192"
        >
          {/* Background circle */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-primary transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-bold">{totalSolved}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Solved</div>
        </div>
      </div>
    </div>
  );
};

export default SolvedCircle;

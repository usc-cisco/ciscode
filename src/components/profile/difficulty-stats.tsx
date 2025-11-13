"use client";

import React from "react";
import { DifficultyEnum } from "@/lib/types/enums/difficulty.enum";
import { DifficultyStatsType } from "@/dtos/user-statistics.dto";

interface DifficultyStatsProps {
  solvedByDifficulty: DifficultyStatsType;
  totalByDifficulty: DifficultyStatsType;
}

interface DifficultyRow {
  label: string;
  solved: number;
  total: number;
  color: string;
}

const DifficultyStats = ({
  solvedByDifficulty,
  totalByDifficulty,
}: DifficultyStatsProps) => {
  const difficulties: DifficultyRow[] = [
    {
      label: DifficultyEnum.PROG1,
      solved: solvedByDifficulty[DifficultyEnum.PROG1],
      total: totalByDifficulty[DifficultyEnum.PROG1],
      color: "bg-green-500",
    },
    {
      label: DifficultyEnum.PROG2,
      solved: solvedByDifficulty[DifficultyEnum.PROG2],
      total: totalByDifficulty[DifficultyEnum.PROG2],
      color: "bg-yellow-500",
    },
    {
      label: DifficultyEnum.DSA,
      solved: solvedByDifficulty[DifficultyEnum.DSA],
      total: totalByDifficulty[DifficultyEnum.DSA],
      color: "bg-red-500",
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      {difficulties.map((difficulty) => {
        const percentage =
          difficulty.total > 0
            ? (difficulty.solved / difficulty.total) * 100
            : 0;
        const beatsPercentage = percentage.toFixed(1);

        return (
          <div key={difficulty.label} className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium min-w-20">{difficulty.label}</span>
              <span className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-foreground">
                  {difficulty.solved}
                </span>
                /{difficulty.total}
              </span>
              <span className="text-gray-600 dark:text-gray-400 min-w-24 text-right">
                Beats{" "}
                <span className="font-semibold text-foreground">
                  {beatsPercentage}%
                </span>
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full ${difficulty.color} transition-all duration-1000 ease-out rounded-full`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DifficultyStats;

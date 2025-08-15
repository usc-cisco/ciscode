"use client";

import React from "react";
import SplitView from "./split-view";
import { Button } from "../ui/button";
import { ProblemPageEnum } from "@/lib/types/enums/problempage.enum";

interface ProblemLayoutProps {
  problemPage: ProblemPageEnum;
  handleChangeProblemPage: (page: ProblemPageEnum) => void;
  Details: React.ReactNode;
  Code: React.ReactNode;
  TestCases: React.ReactNode;
}

const ProblemLayout = ({
  problemPage,
  handleChangeProblemPage,
  Details,
  Code,
  TestCases,
}: ProblemLayoutProps) => {
  return (
    <>
      <div className="hidden lg:block">
        <SplitView sizes={[25, 50, 25]}>
          {Details}
          {Code}
          {TestCases}
        </SplitView>
      </div>

      <div className="lg:hidden h-cscreen flex flex-col">
        <div className="h-4rem grid grid-cols-3">
          <Button
            className={`rounded-none transition-colors cursor-pointer hover:text-white ${problemPage === ProblemPageEnum.DETAILS ? "bg-primary" : "bg-transparent text-foreground"}`}
            onClick={() => handleChangeProblemPage(ProblemPageEnum.DETAILS)}
          >
            Details
          </Button>
          <Button
            className={`rounded-none transition-colors cursor-pointer hover:text-white ${problemPage === ProblemPageEnum.CODE ? "bg-primary" : "bg-transparent text-foreground"}`}
            onClick={() => handleChangeProblemPage(ProblemPageEnum.CODE)}
          >
            Code
          </Button>
          <Button
            className={`rounded-none transition-colors cursor-pointer hover:text-white ${problemPage === ProblemPageEnum.TEST_CASE ? "bg-primary" : "bg-transparent text-foreground"}`}
            onClick={() => handleChangeProblemPage(ProblemPageEnum.TEST_CASE)}
          >
            Test Cases
          </Button>
        </div>
        <div className="flex-1 flex w-full max-h-[calc(100vh-7rem)]">
          {problemPage === ProblemPageEnum.DETAILS && Details}
          {problemPage === ProblemPageEnum.CODE && Code}
          {problemPage === ProblemPageEnum.TEST_CASE && TestCases}
        </div>
      </div>
    </>
  );
};

export default ProblemLayout;

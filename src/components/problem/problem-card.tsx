import { cn } from "@/lib/utils";
import React from "react";

interface ProblemCardProps {
  children?: React.ReactNode;
  className?: string;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ children, className }) => {
  return (
    <div className="px-1 py-2 w-full">
      <div
        className={cn(
          `h-full w-full bg-vscode-light dark:bg-vscode-dark rounded-2xl`,
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default ProblemCard;

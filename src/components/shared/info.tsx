import { cn } from "@/lib/utils";
import { Info as InfoIcon } from "lucide-react";
import React from "react";

interface InfoProps {
  text: string;
  className?: string;
}

const Info = ({ text, className }: InfoProps) => {
  return (
    <div
      className={cn(
        "text-gray-400 dark:text-gray-600 flex  gap-1 items-start justify-center mt-2 px-2",
        className,
      )}
    >
      <InfoIcon className="size-3 mt-[0.125rem]" />
      <p className="text-xs">{text}</p>
    </div>
  );
};

export default Info;

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import React from "react";

interface DropDownSelectProps {
  value: string;
  handleValueChange: (value: string) => void;
  placeholder: string;
  pairs: { value: string; label: string }[];
  className?: string;
}

const DropDownSelect = ({
  value,
  handleValueChange,
  placeholder,
  pairs,
  className,
}: DropDownSelectProps) => {
  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger
        className={cn(
          "w-full md:w-[12rem] bg-vscode-light dark:bg-vscode-dark",
          className,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-vscode-light dark:bg-vscode-dark">
        {pairs.map((pair) => (
          <SelectItem key={pair.value} value={pair.value}>
            {pair.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DropDownSelect;

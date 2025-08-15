import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

interface DropDownSelectProps {
  value: string;
  handleValueChange: (value: string) => void;
  placeholder: string;
  pairs: { value: string; label: string }[];
}

const DropDownSelect = ({
  value,
  handleValueChange,
  placeholder,
  pairs,
}: DropDownSelectProps) => {
  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full sm:w-[180px] bg-vscode-light dark:bg-vscode-dark">
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

import React from "react";
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from "../ui/multi-select";
import { cn } from "@/lib/utils";

interface DropDownMultiSelectProps {
  values: string[];
  handleValueChange: (values: string[]) => void;
  placeholder: string;
  pairs: { value: string; label: string }[];
  className?: string;
}

const DropDownMultiSelect: React.FC<DropDownMultiSelectProps> = ({
  values,
  handleValueChange,
  placeholder,
  pairs,
  className,
}) => {
  return (
    <MultiSelect values={values} onValuesChange={handleValueChange}>
      <MultiSelectTrigger
        className={cn(
          "w-full md:w-[12rem] bg-vscode-light dark:bg-vscode-dark",
          className,
        )}
      >
        <MultiSelectValue placeholder={placeholder} />
      </MultiSelectTrigger>
      <MultiSelectContent className="bg-vscode-light dark:bg-vscode-dark">
        <MultiSelectGroup>
          {pairs.map(({ value, label }) => (
            <MultiSelectItem key={value} value={value} badgeLabel={value}>
              {label}
            </MultiSelectItem>
          ))}
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  );
};

export default DropDownMultiSelect;

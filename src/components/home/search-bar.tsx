import { Search } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";

interface SearchBarProps {
  searchTerm: string;
  handleChange: (term: string) => void;
  placeholder?: string;
}

const SearchBar = ({
  searchTerm,
  handleChange,
  placeholder,
}: SearchBarProps) => {
  return (
    <div className="relative flex-1 min-w-52">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder={placeholder || ""}
        value={searchTerm}
        onChange={(e) => handleChange(e.target.value)}
        className="pl-10 bg-vscode-light dark:bg-vscode-dark"
      />
    </div>
  );
};

export default SearchBar;

import React from "react";
import ProblemCard from "./problem-card";
import { ProblemSchemaResponseType } from "@/dtos/problem.dto";
import { Badge } from "../ui/badge";
import { getDifficultyColor } from "@/lib/types/enums/difficulty.enum";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

interface ProblemBarProps {
  problem: ProblemSchemaResponseType;
  className?: string;
}

const ProblemBar: React.FC<ProblemBarProps> = ({ problem, className }) => {
  const { title, difficulty, author, description, categories } = problem;

  const categoryList = categories
    ? categories
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c.length > 0)
    : [];

  const maxVisible = 1;
  const extraCategories =
    categoryList.length > maxVisible ? categoryList.slice(maxVisible) : [];
  const extraCount = extraCategories.length;

  return (
    <ProblemCard
      className={cn("p-6 overflow-y-auto hide-scrollbar", className)}
    >
      <Link
        href={`/home`}
        className="flex items-center gap-1 hover:underline mb-2"
      >
        <ArrowLeft className="size-3" />
        <p className="text-xs">Back to Home</p>
      </Link>
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="flex gap-2 justify-between">
        <p className="text-sm text-muted-foreground truncate">By {author}</p>
        <div className="flex items-center">
          <Badge
            className={cn(
              getDifficultyColor(difficulty),
              "rounded-xl text-xs px-3",
            )}
          >
            {difficulty}
          </Badge>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 my-2">
        <p className="text-xs">Categories:</p>
        {categoryList.length > 0 ? (
          <div className="flex gap-1">
            {/* Show the first N categories */}
            {categoryList.slice(0, maxVisible).map((category, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="rounded-xl text-xs text-muted-foreground"
              >
                {category}
              </Badge>
            ))}

            {/* Show +N with hover */}
            {extraCount > 0 && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Badge
                    variant="outline"
                    className="rounded-xl text-xs text-muted-foreground cursor-pointer"
                  >
                    +{extraCount}
                  </Badge>
                </HoverCardTrigger>
                <HoverCardContent className="flex flex-wrap gap-1 max-w-xs">
                  {extraCategories.map((cat, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="rounded-xl text-xs text-muted-foreground cursor-pointer"
                    >
                      {cat}
                    </Badge>
                  ))}
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
        ) : (
          <Badge
            variant="outline"
            className="rounded-xl text-xs text-muted-foreground"
          >
            None
          </Badge>
        )}
      </div>

      <div className="mt-4 text-sm">
        {/* Maybe add a markdown renderer */}
        <p className="whitespace-pre-wrap">{description}</p>
      </div>
    </ProblemCard>
  );
};

export default ProblemBar;

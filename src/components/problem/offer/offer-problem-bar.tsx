import React from "react";
import ProblemCard from "@/components/problem/problem-card";
import { Button } from "@/components/ui/button";
import {
  DifficultyEnum,
  getDifficultyColor,
} from "@/lib/types/enums/difficulty.enum";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowLeft, Trash2Icon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Link from "next/link";
import DropDownMultiSelect from "@/components/shared/drop-down-multi-select";
import { CategoryEnum } from "@/lib/types/enums/category.enum";

interface OfferProblemBarProps {
  problem: {
    title: string;
    description: string;
    difficulty: string;
    categories: string[];
  };
  onProblemChange: (
    field: string,
    value: string | DifficultyEnum | string[],
  ) => void;
  onSave: () => void;
  onDelete?: () => void;
  canSubmit: boolean;
}

const OfferProblemBar: React.FC<OfferProblemBarProps> = ({
  problem,
  onProblemChange,
  onSave,
  onDelete,
  canSubmit,
}) => {
  const { title, difficulty, description } = problem;
  return (
    <ProblemCard className="overflow-hidden hide-scrollbar relative">
      <div className="p-6 max-h-full overflow-y-auto overflow-x-hidden pb-26">
        <Link
          href={`/home`}
          className="flex items-center gap-1 hover:underline mb-2"
        >
          <ArrowLeft className="size-3" />
          <p className="text-xs">Back to Home</p>
        </Link>
        <input
          className="text-xl font-semibold truncate max-w-full"
          placeholder={"Title here..."}
          value={title}
          onChange={(e) => onProblemChange("title", e.target.value)}
        />
        <div className="flex justify-between gap-2 items-center py-2">
          <p className="text-sm font-semibold">Difficulty: </p>
          <div className="flex gap-2 items-center">
            <Badge
              className={cn(
                getDifficultyColor(DifficultyEnum.PROG1),
                `${difficulty === DifficultyEnum.PROG1 ? "opacity-100" : "opacity-40"} cursor-pointer rounded-xl`,
              )}
              onClick={() =>
                onProblemChange("difficulty", DifficultyEnum.PROG1)
              }
            >
              {DifficultyEnum.PROG1}
            </Badge>
            <Badge
              className={cn(
                getDifficultyColor(DifficultyEnum.PROG2),
                `${difficulty === DifficultyEnum.PROG2 ? "opacity-100" : "opacity-40"} cursor-pointer rounded-xl`,
              )}
              onClick={() =>
                onProblemChange("difficulty", DifficultyEnum.PROG2)
              }
            >
              {DifficultyEnum.PROG2}
            </Badge>
            <Badge
              className={cn(
                getDifficultyColor(DifficultyEnum.DSA),
                `${difficulty === DifficultyEnum.DSA ? "opacity-100" : "opacity-40"} cursor-pointer rounded-xl`,
              )}
              onClick={() => onProblemChange("difficulty", DifficultyEnum.DSA)}
            >
              {DifficultyEnum.DSA}
            </Badge>
          </div>
        </div>

        <DropDownMultiSelect
          className="md:w-full my-2 px-0"
          values={problem.categories}
          handleValueChange={(values) => onProblemChange("categories", values)}
          placeholder="Select Categories"
          pairs={Object.values(CategoryEnum).map((category) => ({
            value: category,
            label: category,
          }))}
        />

        <div className="mt-4 text-sm h-full">
          {/* Maybe add a markdown renderer */}
          <textarea
            className="w-full min-h-96 resize-y"
            placeholder="Description here..."
            value={description}
            onChange={(e) => onProblemChange("description", e.target.value)}
          ></textarea>
        </div>
      </div>

      <div className="px-2 h-14 absolute bottom-0 w-full border-t border-gray-200 dark:border-gray-700 flex justify-center items-center bg-vscode-light dark:bg-vscode-dark z-10 gap-2">
        <HoverCard>
          <HoverCardTrigger className="flex-1">
            <Button
              className={`bg-primary py-2 rounded-lg cursor-pointer w-full ${canSubmit ? "opacity-100" : "opacity-40 pointer-events-none"}`}
              onClick={onSave}
            >
              Offer Problem
            </Button>
          </HoverCardTrigger>
          {canSubmit || (
            <HoverCardContent>
              <p className="text-xs">
                Must check all test cases before submitting.
              </p>
            </HoverCardContent>
          )}
        </HoverCard>

        {onDelete && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-red-400 hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600 transition-colors py-2 rounded-lg cursor-pointer">
                <Trash2Icon />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-vscode-light dark:bg-vscode-dark">
              <DialogTitle>
                Are you sure you want to delete this problem?
              </DialogTitle>
              <div className="grid grid-cols-2 gap-x-2">
                <DialogClose asChild>
                  <Button className="w-full mt-4 bg-neutral-400 hover:bg-neutral-500 dark:bg-neutral-700 dark:hover:bg-neutral-600 cursor-pointer">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  className="w-full mt-4 bg-red-400 hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-600 cursor-pointer"
                  onClick={onDelete}
                >
                  Delete
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </ProblemCard>
  );
};

export default OfferProblemBar;

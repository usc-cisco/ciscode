import { Editor } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import React from "react";
import ProblemCard from "@/components/problem/problem-card";
import { ClipboardList, CodeXml } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

interface AdminCodeEditorProps {
  defaultCode?: string;
  solutionCode?: string;
  isSolution: boolean;
  handleChangeIsSolution: (value: boolean) => () => void;
  onCodeChange: (value: string | undefined) => void;
  submissionCount?: number;
}

const AdminCodeEditor: React.FC<AdminCodeEditorProps> = ({
  onCodeChange,
  defaultCode,
  solutionCode,
  isSolution,
  handleChangeIsSolution,
  submissionCount,
}) => {
  const { resolvedTheme } = useTheme();

  return (
    <ProblemCard className="overflow-hidden relative">
      <div className="px-2 py-2 rounded-t-xl border-b border-gray-200 dark:border-gray-700 flex items-center">
        <button
          onClick={handleChangeIsSolution(true)}
          className={`py-1 px-2 bg-vscode-light dark:bg-vscode-dark flex items-center gap-1 rounded-lg hover:brightness-90 dark:hover:brightness-110 cursor-pointer ${isSolution ? "opacity-100" : "opacity-40"}`}
        >
          <CodeXml className="size-4 text-primary" />
          <p className="text-sm font-semibold">solution.c</p>
        </button>
        <button
          onClick={handleChangeIsSolution(false)}
          className={`py-1 px-2 bg-vscode-light dark:bg-vscode-dark flex items-center gap-1 rounded-lg hover:brightness-90 dark:hover:brightness-110 cursor-pointer ${!isSolution ? "opacity-100" : "opacity-40"}`}
        >
          <CodeXml className="size-4 text-primary" />
          <p className="text-sm font-semibold">boilerplate.c</p>
        </button>
      </div>
      <Editor
        theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
        height="100%"
        value={isSolution ? solutionCode : defaultCode || ""}
        defaultLanguage="c"
        onChange={onCodeChange}
        options={{
          fontSize: 14,
          lineHeight: 22,
          minimap: { enabled: false },
          lineNumbersMinChars: 2,
        }}
      />
      {submissionCount !== undefined && (
        <HoverCard>
          <HoverCardTrigger className="absolute bottom-4 right-6">
            <Button
              onClick={() => {}}
              className="rounded-full size-12 flex justify-center items-center transition-opacity cursor-pointer relative"
            >
              <ClipboardList />
              <div className="absolute top-0 left-8 p-0.5 min-h-4 min-w-4 bg-red-500 rounded-full text-[0.6rem] flex items-center justify-center">
                <p>{submissionCount}</p>
              </div>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="text-xs">View submissions.</p>
          </HoverCardContent>
        </HoverCard>
      )}
    </ProblemCard>
  );
};

export default AdminCodeEditor;

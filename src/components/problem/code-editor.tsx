import { Editor } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import React from "react";
import ProblemCard from "./problem-card";
import { CodeXml, RefreshCcw } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Button } from "../ui/button";

interface CodeEditorProps {
  code: string;
  onCodeChange?: (value: string | undefined) => void;
  handleReset?: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onCodeChange,
  handleReset,
}) => {
  const { resolvedTheme } = useTheme();

  return (
    <ProblemCard className="overflow-hidden relative">
      <div className="px-2 py-2 rounded-t-xl border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="py-1 px-2 bg-vscode-light dark:bg-vscode-dark flex items-center gap-1 rounded-lg hover:brightness-90 dark:hover:brightness-110 cursor-pointer">
          <CodeXml className="size-4 text-primary" />
          <p className="text-sm font-semibold">main.c</p>
        </div>
      </div>
      <Editor
        theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
        height="100%"
        value={code}
        defaultLanguage="c"
        onChange={onCodeChange}
        options={{
          fontSize: 14,
          lineHeight: 22,
          minimap: { enabled: false },
          lineNumbersMinChars: 2,
          readOnly: onCodeChange === undefined,
        }}
      />
      {handleReset && (
        <HoverCard>
          <HoverCardTrigger className="absolute bottom-4 right-6">
            <Button
              onClick={handleReset}
              className="rounded-full size-12 flex justify-center items-center transition-opacity cursor-pointer"
            >
              <RefreshCcw className="size-6" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="text-xs">Reset the code to the default version.</p>
          </HoverCardContent>
        </HoverCard>
      )}
    </ProblemCard>
  );
};

export default CodeEditor;

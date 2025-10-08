"use client";

import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { useEditorSettings } from "@/hooks/use-editor-settings";
import ProblemCard from "@/components/problem/problem-card";
import EditorSettings from "@/components/problem/editor-settings";
import { ClipboardList, CodeXml } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";

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
  const { settings, update_setting, get_extensions, reset_settings } =
    useEditorSettings();

  const handle_change = (val: string) => {
    onCodeChange(val);
  };

  const current_code = isSolution ? solutionCode : defaultCode || "";
  const router = useRouter();
  const path = usePathname();

  return (
    <ProblemCard className="flex flex-col h-full relative">
      <div className="flex-shrink-0 px-2 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-vscode-light dark:bg-vscode-dark rounded-t-2xl sticky top-0 z-10">
        <div className="flex items-center gap-1">
          <button
            onClick={handleChangeIsSolution(true)}
            className={`py-1 px-2 bg-gray-100 dark:bg-gray-800 flex items-center gap-1 rounded-lg hover:brightness-90 dark:hover:brightness-110 cursor-pointer transition-all ${isSolution ? "opacity-100 ring-2 ring-primary/50" : "opacity-60"}`}
          >
            <CodeXml className="size-4 text-primary" />
            <p className="text-sm font-semibold">solution.c</p>
          </button>
          <button
            onClick={handleChangeIsSolution(false)}
            className={`py-1 px-2 bg-gray-100 dark:bg-gray-800 flex items-center gap-1 rounded-lg hover:brightness-90 dark:hover:brightness-110 cursor-pointer transition-all ${!isSolution ? "opacity-100 ring-2 ring-primary/50" : "opacity-60"}`}
          >
            <CodeXml className="size-4 text-primary" />
            <p className="text-sm font-semibold">boilerplate.c</p>
          </button>
        </div>

        <EditorSettings
          settings={settings}
          update_setting={update_setting}
          reset_settings={reset_settings}
        />
      </div>

      <div className="flex-1 min-h-0 relative">
        <div className="absolute inset-0 overflow-auto hide-scrollbar">
          <CodeMirror
            value={current_code}
            onChange={handle_change}
            extensions={get_extensions()}
            editable={true}
            basicSetup={{
              lineNumbers: settings.show_line_nums,
              foldGutter: true,
              dropCursor: false,
              allowMultipleSelections: false,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              highlightSelectionMatches: false,
              searchKeymap: true,
            }}
            theme="none"
            height="100vh"
            style={{
              fontSize: `${settings.font_size}px`,
            }}
          />
        </div>
      </div>

      {submissionCount !== undefined && (
        <HoverCard>
          <HoverCardTrigger className="absolute bottom-4 right-6">
            <Button
              onClick={() => {
                router.push(path + `/submission`);
              }}
              className="rounded-full size-12 flex justify-center items-center transition-opacity cursor-pointer relative"
              disabled={submissionCount === 0}
            >
              <ClipboardList />
              <div className="absolute top-0 left-8 p-0.5 min-h-4 min-w-4 bg-red-500 rounded-full text-[0.6rem] flex items-center justify-center">
                <p>{submissionCount}</p>
              </div>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="text-xs">
              {submissionCount > 0
                ? `View submissions (${submissionCount})`
                : "No submissions yet."}
            </p>
          </HoverCardContent>
        </HoverCard>
      )}
    </ProblemCard>
  );
};

export default AdminCodeEditor;

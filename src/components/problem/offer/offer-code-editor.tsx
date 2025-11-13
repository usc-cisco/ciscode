"use client";

import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { useEditorSettings } from "@/hooks/use-editor-settings";
import ProblemCard from "@/components/problem/problem-card";
import EditorSettings from "@/components/problem/editor-settings";
import { CodeXml } from "lucide-react";

interface OfferCodeEditorProps {
  defaultCode?: string;
  solutionCode?: string;
  isSolution: boolean;
  handleChangeIsSolution: (value: boolean) => () => void;
  onCodeChange: (value: string | undefined) => void;
}

const OfferCodeEditor: React.FC<OfferCodeEditorProps> = ({
  onCodeChange,
  defaultCode,
  solutionCode,
  isSolution,
  handleChangeIsSolution,
}) => {
  const { settings, update_setting, get_extensions, reset_settings } =
    useEditorSettings();

  const handle_change = (val: string) => {
    onCodeChange(val);
  };

  const current_code = isSolution ? solutionCode : defaultCode || "";

  return (
    <ProblemCard className="flex flex-col h-full">
      <div className="shrink-0 px-2 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-vscode-light dark:bg-vscode-dark rounded-t-2xl sticky top-0 z-10">
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
    </ProblemCard>
  );
};

export default OfferCodeEditor;

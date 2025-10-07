"use client";

import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { useEditorSettings } from "@/hooks/use-editor-settings";
import ProblemCard from "./problem-card";
import EditorSettings from "./editor-settings";
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
  const { settings, update_setting, get_extensions, reset_settings } =
    useEditorSettings();

  const handle_change = (val: string) => {
    if (onCodeChange) {
      onCodeChange(val);
    }
  };

  return (
    <ProblemCard className="flex flex-col h-full relative">
      <div className="flex-shrink-0 px-2 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-vscode-light dark:bg-vscode-dark rounded-t-2xl sticky top-0 z-10">
        <div className="py-1 px-2 bg-gray-100 dark:bg-gray-800 flex items-center gap-1 rounded-lg hover:brightness-90 dark:hover:brightness-110 cursor-pointer">
          <CodeXml className="size-4 text-primary" />
          <p className="text-sm font-semibold">main.c</p>
        </div>

        {/* editor settings */}
        <EditorSettings
          settings={settings}
          update_setting={update_setting}
          reset_settings={reset_settings}
        />
      </div>

      <div className="flex-1 min-h-0 relative">
        <div className="absolute inset-0 overflow-auto hide-scrollbar">
          <CodeMirror
            value={code}
            onChange={handle_change}
            extensions={get_extensions()}
            editable={onCodeChange !== undefined}
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

      {handleReset && (
        <HoverCard>
          <HoverCardTrigger className="absolute bottom-4 right-6 z-20">
            <Button
              onClick={handleReset}
              className="rounded-full size-12 flex justify-center items-center transition-opacity cursor-pointer shadow-lg"
            >
              <RefreshCcw className="size-6" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent side="left" align="end">
            <p className="text-xs">reset code to default version</p>
          </HoverCardContent>
        </HoverCard>
      )}
    </ProblemCard>
  );
};

export default CodeEditor;

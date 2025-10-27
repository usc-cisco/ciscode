import MDEditor, { commands } from "@uiw/react-md-editor";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

interface MarkdownEditorProps {
  value: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
}

const MarkdownEditor = ({
  value,
  onChange,
  className = "",
  placeholder = "Write your Markdown here...",
}: MarkdownEditorProps) => {
  const [internalValue, setInternalValue] = useState(value);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (val?: string) => {
    const next = val || "";
    setInternalValue(next);
    onChange?.(next);
  };

  const customCommands = commands
    .getCommands()
    .filter((cmd) => !["image"].includes(cmd.name || ""));

  return (
    <div
      className={`w-full h-full ${className} border-0 rounded-lg`}
      data-color-mode={resolvedTheme === "dark" ? "dark" : "light"}
    >
      <MDEditor
        value={internalValue}
        onChange={handleChange}
        preview="edit"
        commands={customCommands}
        className="h-full"
        textareaProps={{
          placeholder,
          className: `w-full h-full text-sm bg-vscode-light dark:bg-vscode-dark text-black dark:text-white outline-none focus:ring-0 border-none shadow-none resize-none`,
        }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html:
            ".w-md-editor .w-md-editor-bar-right { display: none !important; }",
        }}
      />
    </div>
  );
};

export default MarkdownEditor;

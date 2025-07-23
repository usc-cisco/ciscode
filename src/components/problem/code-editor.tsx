import { Editor } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import React from 'react'

interface CodeEditorProps {
    handleCodeChange: (value: string | undefined) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ handleCodeChange }) => {
    const { theme } = useTheme();

  return (
    <Editor
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        height="500px"
        defaultLanguage="c"
        onChange={handleCodeChange}
        options={{
            fontSize: 16,
            lineHeight: 22,
            minimap: { enabled: false },
        }}
    />
  );
}

export default CodeEditor

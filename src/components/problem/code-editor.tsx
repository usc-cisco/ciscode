import { Editor } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import React from 'react'
import ProblemCard from './problem-card';

interface CodeEditorProps {
    handleCodeChange: (value: string | undefined) => void;
    className?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ handleCodeChange, className }) => {
    const { resolvedTheme } = useTheme();

  return (
    <ProblemCard classList='overflow-hidden'>
      <div className='px-4 py-3 rounded-t-xl border-b border-gray-200 dark:border-gray-700 flex justify-between items-center'>
        <p className='text-sm font-semibold hover:underline cursor-pointer'>main.c</p>
      </div>
      <Editor
          theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
          height="100%"
          defaultLanguage="c"
          onChange={handleCodeChange}
          options={{
              fontSize: 14,
              lineHeight: 22,
              minimap: { enabled: false },
              lineNumbersMinChars: 2,
          }}
      />
    </ProblemCard>
  );
}

export default CodeEditor

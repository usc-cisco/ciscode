import { Editor } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import React from 'react'
import ProblemCard from './problem-card';
import { CodeXml } from 'lucide-react';
import { COriginal } from 'devicons-react';

interface CodeEditorProps {
    handleCodeChange: (value: string | undefined) => void;
    className?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ handleCodeChange, className }) => {
    const { resolvedTheme } = useTheme();

  return (
    <ProblemCard classList='overflow-hidden'>
      <div className='px-2 py-2 rounded-t-xl border-b border-gray-200 dark:border-gray-700 flex justify-between items-center'>
        <div className='py-1 px-2 bg-vscode-light dark:bg-vscode-dark flex items-center gap-1 rounded-lg hover:brightness-90 dark:hover:brightness-110 cursor-pointer'>
          <CodeXml className='size-4 text-primary' />
          <p className='text-sm font-semibold'>main.c</p>
        </div>
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

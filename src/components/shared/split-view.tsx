'use client';
import Split from 'react-split';

interface SplitViewProps {
    children?: React.ReactNode;
    sizes?: number[];
}

export default function SplitView({ children, sizes }: SplitViewProps) {
  return (
    <Split className="flex h-screen" minSize={150} gutterSize={8} sizes={sizes}>
      {children}
    </Split>
  );
}

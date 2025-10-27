"use client";
import { cn } from "@/lib/utils";
import Split from "react-split";

interface SplitViewProps {
  children?: React.ReactNode;
  sizes?: number[];
  classList?: string;
}

export default function SplitView({
  children,
  sizes,
  classList,
}: SplitViewProps) {
  return (
    <Split
      className={cn(`flex h-cscreen overflow-hidden`, classList)}
      minSize={300}
      gutterSize={4}
      sizes={sizes}
    >
      {children}
    </Split>
  );
}

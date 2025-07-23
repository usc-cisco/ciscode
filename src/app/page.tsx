"use client"

import CodeEditor from "@/components/problem/code-editor";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <div>
        <ThemeToggle />
      </div>
      <div>
        <CodeEditor 
          handleCodeChange={(value) => console.log(value)}
        />
      </div>
    </div>
  );
}

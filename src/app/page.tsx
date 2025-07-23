"use client"

import CodeEditor from "@/components/problem/code-editor";
import SplitView from "@/components/shared/split-view";

export default function Home() {
  return (
    <div>
      <div>
        <SplitView sizes={[25, 50, 25]}>
          <div>Left</div>
          <CodeEditor 
            handleCodeChange={(value) => console.log(value)}
          />
          <div>Right</div>
        </SplitView>
      </div>
    </div>
  );
}

"use client"

import CodeEditor from "@/components/problem/code-editor";
import ProblemBar from "@/components/problem/problem-bar";
import TestCaseBar from "@/components/problem/test-case-bar";
import SplitView from "@/components/shared/split-view";
import { checkCode } from "@/lib/fetchers/code.fetchers";
import { useState } from "react";

export default function Home() {
  return (
    <div>
      <p>This is the home page</p>
    </div>
  )
}

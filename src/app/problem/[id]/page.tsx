"use client"

import CodeEditor from "@/components/problem/code-editor";
import ProblemBar from "@/components/problem/problem-bar";
import TestCaseBar from "@/components/problem/test-case-bar";
import SplitView from "@/components/shared/split-view";
import { ProblemSchemaResponseType } from "@/dtos/problem.dto";
import { checkCode } from "@/lib/fetchers/code.fetchers";
import { fetchProblem } from "@/lib/fetchers/problem.fetchers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home({ params }: { params: { id: string } }) {
  const router = useRouter();
  if (!params || !params.id) {
    router.push("/");
    return null;
  }

  const [problem, setProblem] = useState<ProblemSchemaResponseType | null>(null);
  const [code, setCode] = useState<string>("");

  const handleCodeChange = (value: string | undefined) => {
    setCode(value || "");
  };

  const onSubmit = async () => {
    const input = ""; // You can replace this with actual input if needed
    const { output, error } = await checkCode(code, input);
    if (error) {
      console.error("Error checking code:", error);
    } else {
      console.log("Output:", output);
    }
  };

  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        const problemData = await fetchProblem(params.id);
        if (problemData) {
          setProblem(problemData);
        } else {
          console.error("Problem not found");
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching problem:", error);
        router.push("/");
      }
    };

    fetchProblemData();
  }, []);

  return (
    <div>
      <div>
        <SplitView 
          sizes={[25, 50, 25]}
        >
          <ProblemBar problem={problem}/>
          <CodeEditor 
            handleCodeChange={handleCodeChange}
          />
          <TestCaseBar onSubmit={onSubmit} />
        </SplitView>
      </div>
    </div>
  );
}
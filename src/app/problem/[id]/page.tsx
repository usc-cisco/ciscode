"use client"

import CodeEditor from "@/components/problem/code-editor";
import ProblemBar from "@/components/problem/problem-bar";
import TestCaseBar from "@/components/problem/test-case-bar";
import SplitView from "@/components/shared/split-view";
import { ProblemSchemaResponseType } from "@/dtos/problem.dto";
import { checkCode } from "@/lib/fetchers/code.fetchers";
import { fetchProblem } from "@/lib/fetchers/problem.fetchers";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();

  const params = useParams();
  if (!params.id) {
    router.push("/problem");
    return null;
  }

  const [problem, setProblem] = useState<ProblemSchemaResponseType | null>(null);
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

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
        const response = await fetchProblem(params.id as string);
        if (response.data) {
          setProblem(response.data);
        } else {
          console.error("Problem not found");
          router.push("/");
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        router.push("/");
      }
    };

    fetchProblemData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-lg text-gray-500">Loading problem...</div>
      </div>
    );
  }

  if (!problem) {
    router.push("/problem");
    return null;
  }

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
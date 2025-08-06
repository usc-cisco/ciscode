"use client"

import CodeEditor from "@/components/problem/code-editor";
import ProblemBar from "@/components/problem/problem-bar";
import TestCaseBar from "@/components/problem/test-case-bar";
import ProtectedRoute from "@/components/shared/protected-route";
import SplitView from "@/components/shared/split-view";
import { useAuth } from "@/contexts/auth.context";
import { CheckCodeResponseType } from "@/dtos/code.dto";
import { ProblemSchemaResponseType, ProblemSchemaResponseWithTestCasesType } from "@/dtos/problem.dto";
import { TestCaseResponseType } from "@/dtos/testcase.dto";
import { checkCode, runCode } from "@/lib/fetchers/code.fetchers";
import { fetchProblem } from "@/lib/fetchers/problem.fetchers";
import SubmissionStatusEnum from "@/lib/types/enums/submissionstatus.enum";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Problem() {
  const { token } = useAuth();
  const router = useRouter();

  const params = useParams();
  if (!params.id) {
    router.push("/problem");
    return null;
  }

  const [problem, setProblem] = useState<ProblemSchemaResponseType | null>(null);
  const [testCases, setTestCases] = useState<TestCaseResponseType[]>([]);
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const handleCodeChange = (value: string | undefined) => {
    setCode(value || "");
  };

  const handleEditTestCase = (index: number) => (field: string, value: string | boolean) => {
      setTestCases(prev => {
          const updatedTestCases = [...prev];
          updatedTestCases[index] = {
              ...updatedTestCases[index],
              [field]: value
          };
          return updatedTestCases;
      });
  };

  const handleCheckCode = async (testCase: TestCaseResponseType): Promise<CheckCodeResponseType> => {
      if (!token) {
          console.error("User is not authenticated");
          return { output: null, error: "User is not authenticated", status: SubmissionStatusEnum.FAILED };
      }

      try {
          const response = await checkCode(code, testCase.id, token);
          return response;
      } catch (error) {
          console.error("Error checking code:", error);
          return { output: null, error: "Error checking code", status: SubmissionStatusEnum.FAILED };
      }
  };

  const handleSubmit = async () => {
    if (!token) {
      console.error("User is not authenticated");
      return;
    }

    // Submit logic here
  };

  useEffect(() => {
    if (!token) return;

    const fetchProblemData = async () => {
      try {
        const response = await fetchProblem(params.id as string, token || "");
        if (response.data) {
          setCode(response.data.defaultCode || "");
          setProblem(response.data);
          setTestCases(response.data.testCases || []);
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
  }, [token]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-lg text-gray-500">Loading problem...</div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!problem) {
    router.push("/problem");
    return null;
  }

  return (
    <ProtectedRoute>
      <div>
        <div>
          <SplitView
            sizes={[25, 50, 25]}
          >
            <ProblemBar problem={problem}/>
            <CodeEditor
              defaultCode={problem.defaultCode ?? ""}
              onCodeChange={handleCodeChange}
            />
            <TestCaseBar 
              testCases={testCases} 
              onSubmit={handleSubmit} 
              onEditTestCase={handleEditTestCase} 
              onCheckCode={handleCheckCode}
            />
          </SplitView>
        </div>
      </div>
    </ProtectedRoute>
  );
}
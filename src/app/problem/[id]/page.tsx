"use client"

import CodeEditor from "@/components/problem/code-editor";
import ProblemBar from "@/components/problem/problem-bar";
import TestCaseBar from "@/components/problem/test-case-bar";
import ProtectedRoute from "@/components/shared/protected-route";
import SplitView from "@/components/shared/split-view";
import { useAuth } from "@/contexts/auth.context";
import { CheckCodeResponseType } from "@/dtos/code.dto";
import { ProblemSchemaResponseType } from "@/dtos/problem.dto";
import { TestCaseResponseType } from "@/dtos/testcase.dto";
import { runTestCase } from "@/lib/fetchers/code.fetchers";
import { fetchProblem } from "@/lib/fetchers/problem.fetchers";
import { submitCode } from "@/lib/fetchers/submission.fetchers";
import TestCaseSubmissionStatusEnum from "@/lib/types/enums/submissionstatus.enum";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Problem() {
  const { token } = useAuth();
  const router = useRouter();

  const [sending, setSending] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const params = useParams();
  if (!params.id) {
    router.push("/home");
    return null;
  }

  const [problem, setProblem] = useState<ProblemSchemaResponseType | null>(null);
  const [testCases, setTestCases] = useState<TestCaseResponseType[]>([]);
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const handleCodeChange = (value: string | undefined) => {
    setCode(value || "");
  };

  const handleRestoreDefaultCode = () => {
    if (problem) {
      setCode(problem.defaultCode || "");
    }
  }

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
          return { output: null, error: "User is not authenticated", status: TestCaseSubmissionStatusEnum.FAILED };
      }

      setSending(true);

      try {
          const response = await runTestCase(code, testCase.id, token);
          setSending(false);
          return response;
      } catch (error) {
          console.error("Error checking code:", error);
          setSending(false);
          return { output: null, error: "Error checking code", status: TestCaseSubmissionStatusEnum.FAILED };
      }
  };

  const handleSubmit = async () => {
    if (!token) {
      console.error("User is not authenticated");
      return;
    }

    setSubmitted(true);

    try {
      const response = await submitCode(code, Number(params.id), token);
      if (response) {
        console.log("Status: ", response.status);
        setTestCases(prev => {
          const updatedTestCases = [...prev];
          response.testCaseSubmissions.forEach((testCase, index) => {
            updatedTestCases[index] = {
              ...updatedTestCases[index],
              status: testCase.status,
              actualOutput: testCase.output ?? ""
            };
          });
          return updatedTestCases;
        });
      }
    } catch (error) {
      console.error("Error submitting code:", error);
    }
    finally {
      setSubmitted(false);
    }
  };

  useEffect(() => {
    if (!token) return;

    const fetchProblemData = async () => {
      try {
        const response = await fetchProblem(params.id as string, token || "");
        if (response.data) {
          setCode(response.data.answerCode || response.data.defaultCode || "");
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
              defaultCode={problem.answerCode || problem.defaultCode || ""}
              onCodeChange={handleCodeChange}
            />
            <TestCaseBar 
              testCases={testCases} 
              onSubmit={handleSubmit} 
              onEditTestCase={handleEditTestCase} 
              onCheckCode={handleCheckCode}
              submitted={submitted}
              sending={!code || sending}
            />
          </SplitView>
        </div>
      </div>
    </ProtectedRoute>
  );
}
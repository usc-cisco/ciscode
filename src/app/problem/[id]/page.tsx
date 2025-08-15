"use client"

import CodeEditor from "@/components/problem/code-editor";
import ProblemBar from "@/components/problem/problem-bar";
import TestCaseBar from "@/components/problem/test-case-bar";
import ProblemLayout from "@/components/shared/problem-layout";
import ProtectedRoute from "@/components/shared/protected-route";
import { useAuth } from "@/contexts/auth.context";
import { CheckCodeResponseType } from "@/dtos/code.dto";
import { ProblemSchemaResponseType } from "@/dtos/problem.dto";
import { TestCaseResponseType } from "@/dtos/testcase.dto";
import { runTestCase } from "@/lib/fetchers/code.fetchers";
import { fetchProblem } from "@/lib/fetchers/problem.fetchers";
import { submitCode } from "@/lib/fetchers/submission.fetchers";
import { toastr } from "@/lib/toastr";
import { ProblemPageEnum } from "@/lib/types/enums/problempage.enum";
import SubmissionStatusEnum from "@/lib/types/enums/problemstatus.enum";
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
  }

  const [problem, setProblem] = useState<ProblemSchemaResponseType | null>(null);
  const [testCases, setTestCases] = useState<TestCaseResponseType[]>([]);
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [problemPage, setProblemPage] = useState<ProblemPageEnum>(ProblemPageEnum.DETAILS);

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

  const handleReset = () => {
    setCode(problem?.defaultCode || "");
  }

  const handleSubmit = async () => {
    if (!token) {
      console.error("User is not authenticated");
      return;
    }

    setSubmitted(true);
    setTestCases(prev => {
      return prev.map(testCase => ({
        ...testCase,
        status: TestCaseSubmissionStatusEnum.PENDING,
        actualOutput: "Loading..."
      }));
    });

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

        switch(response.status) {
          case SubmissionStatusEnum.SOLVED:
            toastr.success("All test cases passed");
            break;
          case SubmissionStatusEnum.ATTEMPTED:
            const numberOfPassed = response.testCaseSubmissions.filter(testCase => testCase.status === TestCaseSubmissionStatusEnum.COMPLETED).length;
            toastr.error(`${numberOfPassed === 0 ? "All test cases failed." : `Passed only ${numberOfPassed} out of ${testCases.length}`}`);
            break;
          default:
            console.log("Unknown status");
        }
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
  }, [token, params.id, router]);

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
        <ProblemLayout
          problemPage={problemPage}
          handleChangeProblemPage={setProblemPage}
          Details={<ProblemBar problem={problem} />}
          Code={<CodeEditor
            code={code}
            onCodeChange={handleCodeChange}
            handleReset={handleReset}
          />}
          TestCases={<TestCaseBar
            testCases={testCases}
            onSubmit={handleSubmit}
            onEditTestCase={handleEditTestCase}
            onCheckCode={handleCheckCode}
            submitted={submitted}
            sending={!code || sending}
          />}
        />
      </div>
    </ProtectedRoute>
  );
}
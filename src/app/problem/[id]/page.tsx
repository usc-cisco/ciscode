"use client";

import Loading from "@/app/loading";
import CodeEditor from "@/components/problem/code-editor";
import ProblemBar from "@/components/problem/problem-bar";
import TestCaseBar from "@/components/problem/test-case-bar";
import ProblemLayout from "@/components/shared/problem-layout";
import ProtectedRoute from "@/components/shared/protected-route";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/auth.context";
import { CheckCodeResponseType } from "@/dtos/code.dto";
import { ProblemSchemaResponseType } from "@/dtos/problem.dto";
import { TestCaseResponseType } from "@/dtos/testcase.dto";
import { runTestCase } from "@/lib/fetchers/code.fetchers";
import { fetchProblem } from "@/lib/fetchers/problem.fetchers";
import { submitCode } from "@/lib/fetchers/submission.fetchers";
import { ProblemPageEnum } from "@/lib/types/enums/problempage.enum";
import SubmissionStatusEnum from "@/lib/types/enums/problemstatus.enum";
import TestCaseSubmissionStatusEnum from "@/lib/types/enums/submissionstatus.enum";
import { error } from "console";
import Image from "next/image";
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

  const [problem, setProblem] = useState<ProblemSchemaResponseType | null>(
    null,
  );
  const [testCases, setTestCases] = useState<TestCaseResponseType[]>([]);
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [problemPage, setProblemPage] = useState<ProblemPageEnum>(
    ProblemPageEnum.DETAILS,
  );
  const [submissionStatus, setSubmissionStatus] =
    useState<SubmissionStatusEnum>(SubmissionStatusEnum.ATTEMPTED);
  const [numberOfPassed, setNumberOfPassed] = useState<number>(0);
  const [nextProblemId, setNextProblemId] = useState<number | null>(null);

  const handleCodeChange = (value: string | undefined) => {
    setCode(value || "");
  };

  const handleEditTestCase =
    (index: number) => (field: string, value: string | boolean) => {
      setTestCases((prev) => {
        const updatedTestCases = [...prev];
        updatedTestCases[index] = {
          ...updatedTestCases[index],
          [field]: value,
        };
        return updatedTestCases;
      });
    };

  const handleCheckCode = async (
    testCase: TestCaseResponseType,
  ): Promise<CheckCodeResponseType> => {
    if (!token) {
      console.error("User is not authenticated");
      return {
        output: null,
        error: "User is not authenticated",
        status: TestCaseSubmissionStatusEnum.FAILED,
      };
    }

    setSending(true);

    try {
      const response = await runTestCase(code, testCase.id, token);
      setSending(false);
      return response;
    } catch (error) {
      console.error("Error checking code:", error);
      setSending(false);
      return {
        output: null,
        error: "Error checking code",
        status: TestCaseSubmissionStatusEnum.FAILED,
      };
    }
  };

  const handleReset = () => {
    setCode(problem?.defaultCode || "");
  };

  const handleSubmit = async () => {
    if (!token) {
      console.error("User is not authenticated");
      return;
    }

    setSubmitted(true);
    setTestCases((prev) => {
      return prev.map((testCase) => ({
        ...testCase,
        status: TestCaseSubmissionStatusEnum.PENDING,
        actualOutput: "Loading...",
      }));
    });

    try {
      const response = await submitCode(code, Number(params.id), token);
      if (response) {
        console.log("Status: ", response.status);

        setTestCases((prev) => {
          const updatedTestCases = [...prev];
          response.testCaseSubmissions.forEach((testCase, index) => {
            let actualOutput = "";
            if (testCase.output) {
              actualOutput = testCase.output;
            } else if (testCase.error) {
              actualOutput =
                testCase.error || "An error occurred while checking the code.";
            } else {
              actualOutput = "";
            }

            updatedTestCases[index] = {
              ...updatedTestCases[index],
              status: testCase.status,
              actualOutput,
            };
          });
          return updatedTestCases;
        });
        setSubmissionStatus(response.status);
        setNumberOfPassed(
          response.testCaseSubmissions.filter(
            (testCase) =>
              testCase.status === TestCaseSubmissionStatusEnum.COMPLETED,
          ).length,
        );
        setNextProblemId(response.nextProblemId);
      }
    } catch (error) {
      console.error("Error submitting code:", error);
    } finally {
      setSubmitted(false);
      setTimeout(() => {
        setOpen(true);
      }, 200);
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
        <Loading />
      </ProtectedRoute>
    );
  }

  if (!problem) {
    router.push("/problem");
    return null;
  }

  return (
    <ProtectedRoute>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-vscode-light dark:bg-vscode-dark p-0 overflow-hidden border-none">
          <div className="flex divide-x divide-neutral-300 dark:divide-neutral-700">
            <div className="p-4 w-1/2">
              {submissionStatus === SubmissionStatusEnum.SOLVED ? (
                <>
                  <DialogTitle className="text-xl font-semibold">
                    Lovely! 🎉
                  </DialogTitle>
                  <p className="text-xs">You passed.</p>
                </>
              ) : (
                <>
                  <DialogTitle className="text-xl font-semibold">
                    Oh no... 😭
                  </DialogTitle>
                  <p className="text-xs">You failed.</p>
                </>
              )}

              <div className="flex justify-between text-sm mt-4 mb-12">
                <p>Your score: </p>
                <p
                  className={`font-semibold ${numberOfPassed === testCases.length ? "text-green-500" : "text-red-500"}`}
                >
                  {numberOfPassed} / {testCases.length}
                </p>
              </div>

              <div className="flex flex-col items-center gap-2">
                {submissionStatus === SubmissionStatusEnum.SOLVED ? (
                  <Button
                    className="w-full rounded-md cursor-pointer"
                    onClick={() => {
                      router.push(
                        nextProblemId ? `/problem/${nextProblemId}` : "/home",
                      );
                    }}
                  >
                    Next Problem
                  </Button>
                ) : (
                  <Button
                    className="w-full rounded-md cursor-pointer"
                    onClick={() => setOpen(false)}
                  >
                    Try Again
                  </Button>
                )}

                <Button
                  className="w-full rounded-md cursor-pointer"
                  variant="outline"
                  onClick={() => router.push("/home")}
                >
                  Return Home
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center w-1/2 p-4 bg-primary">
              <Image
                className="w-auto"
                src="/cisco-logo-white.png"
                alt="CISCO logo"
                width={1000}
                height={1000}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <div>
        <ProblemLayout
          problemPage={problemPage}
          handleChangeProblemPage={setProblemPage}
          Details={<ProblemBar problem={problem} />}
          Code={
            <CodeEditor
              code={code}
              onCodeChange={handleCodeChange}
              handleReset={handleReset}
            />
          }
          TestCases={
            <TestCaseBar
              testCases={testCases}
              onSubmit={handleSubmit}
              onEditTestCase={handleEditTestCase}
              onCheckCode={handleCheckCode}
              submitted={submitted}
              sending={!code || sending}
            />
          }
        />
      </div>
    </ProtectedRoute>
  );
}

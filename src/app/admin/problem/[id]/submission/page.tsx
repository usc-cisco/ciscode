"use client";

import Loading from "@/app/loading";
import AdminCodeEditor from "@/components/admin/problem/admin-code-editor";
import AdminTestCaseBar from "@/components/admin/problem/admin-test-case-bar";
import DropDownSelect from "@/components/home/drop-down-select";
import CodeEditor from "@/components/problem/code-editor";
import ProblemCard from "@/components/problem/problem-card";
import TestCaseBar from "@/components/problem/test-case-bar";
import CustomPagination from "@/components/shared/custom-pagination";
import ProblemLayout from "@/components/shared/problem-layout";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth.context";
import { CheckCodeResponseType } from "@/dtos/code.dto";
import { ProblemSchemaResponseType } from "@/dtos/problem.dto";
import { SubmissionResponseWithTestCaseSubmissionAndUserType } from "@/dtos/submission.dto";
import { TestCaseResponseType } from "@/dtos/testcase.dto";
import env from "@/lib/env";
import { runTestCaseAsAdmin } from "@/lib/fetchers/code.fetchers";
import { fetchSubmissionsByProblemId } from "@/lib/fetchers/submission.fetchers";
import DifficultyEnum, {
  getDifficultyColor,
} from "@/lib/types/enums/difficulty.enum";
import { ProblemPageEnum } from "@/lib/types/enums/problempage.enum";
import SubmissionStatusEnum from "@/lib/types/enums/problemstatus.enum";
import TestCaseSubmissionStatusEnum from "@/lib/types/enums/submissionstatus.enum";
import { cn } from "@/lib/utils";
import { ArrowLeft, Check, X } from "lucide-react";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const Submissions = () => {
  const { token } = useAuth();
  const params = useParams();
  const searchParams = useSearchParams();
  const path = usePathname();
  const router = useRouter();

  const [submissions, setSubmissions] = useState<
    SubmissionResponseWithTestCaseSubmissionAndUserType[]
  >([]);
  const [problem, setProblem] = useState<ProblemSchemaResponseType>({
    id: 0,
    title: "",
    difficulty: DifficultyEnum.PROG1,
    description: "",
    defaultCode: "",
    answerCode: "",
    authorId: -1,
  });
  const [testCases, setTestCases] = useState<TestCaseResponseType[]>([]);
  const [submissionIndex, setSubmissionIndex] = useState<number>(0);
  const [problemPage, setProblemPage] = useState(ProblemPageEnum.DETAILS);
  const [sending, setSending] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(
    searchParams.get("page") ? Number(searchParams.get("page")) : 1,
  );
  const [totalPages, setTotalPages] = useState<number>(0);
  const [submissionStatus, setSubmissionStatus] = useState<string | "all">(
    searchParams.get("status") || "all",
  );

  const createQueryString = useCallback(
    (data: { name: string; value: string }[]) => {
      const newParams = new URLSearchParams(searchParams.toString());
      data.forEach(({ name, value }) => {
        newParams.set(name, value);
      });

      return newParams.toString();
    },
    [searchParams],
  );

  const setFromSubmissions = (
    _submissions: SubmissionResponseWithTestCaseSubmissionAndUserType[],
  ) => {
    if (_submissions.length === 0) return;

    setProblem((prev) => ({
      ...prev,
      answerCode: _submissions[submissionIndex]?.code || "",
    }));
    setTestCases((prev) => {
      return prev.map((testCase) => {
        const matchingTestCase = _submissions[
          submissionIndex
        ].testCaseSubmissions.find(
          (testCaseSubmission) => testCaseSubmission.testCaseId === testCase.id,
        );
        return {
          ...testCase,
          status: matchingTestCase
            ? matchingTestCase.status
            : TestCaseSubmissionStatusEnum.PENDING,
          actualOutput: matchingTestCase ? matchingTestCase.output : "",
        };
      });
    });
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
      const response = await runTestCaseAsAdmin(
        problem.answerCode ?? "",
        testCase.id,
        token,
      );
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

  const handleChangeStatus = (value: string) => {
    setSubmissionIndex(0);
    setSubmissionStatus(value);
    setCurrentPage(1);

    router.push(
      `${path}?${createQueryString([
        { name: "status", value: String(value) },
        { name: "page", value: String(1) },
      ])}`,
    );
  };

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!token) return;

      try {
        const response = await fetchSubmissionsByProblemId(
          Number(params.id),
          token,
          submissionStatus === "all" ? null : submissionStatus,
          currentPage,
          env.SUBMISSION_LIMIT_PER_PAGE,
        );

        setSubmissions(response.submissions);
        setProblem(response.problem);
        setTestCases(response.problem.testCases);
        setFromSubmissions(response.submissions);
        setTotalPages(response.totalPages);

        if (response.submissions.length === 0 && currentPage !== 1) {
          setCurrentPage(1);
          router.push(
            `${path}?${createQueryString([{ name: "page", value: String(1) }])}`,
          );
        }
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [params.id, submissionStatus, currentPage]);

  useEffect(() => {
    if (submissions.length > 0) {
      setFromSubmissions(submissions);
    }
  }, [submissionIndex]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <ProblemLayout
        problemPage={problemPage}
        handleChangeProblemPage={setProblemPage}
        Details={
          <ProblemCard className="overflow-hidden hide-scrollbar relative">
            <div className="p-6 max-h-full overflow-y-auto overflow-x-hidden pb-26">
              <div>
                <Link
                  href={`/admin/problem/${params.id}`}
                  className="flex items-center gap-1 hover:underline mb-2"
                >
                  <ArrowLeft className="size-3" />
                  <p className="text-xs">Back to Problem</p>
                </Link>
                <h1 className="text-xl font-semibold truncate">
                  {problem.title}
                </h1>
                <div className="flex gap-2 justify-between">
                  <p className="text-sm text-muted-foreground truncate">
                    By {problem.author}
                  </p>
                  <div className="flex items-center">
                    <Badge
                      className={cn(
                        getDifficultyColor(problem.difficulty),
                        "rounded-xl text-xs px-3",
                      )}
                    >
                      {problem.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h1 className="text-xs font-semibold">Submissions</h1>

                <DropDownSelect
                  className="md:w-full mt-2"
                  value={submissionStatus}
                  handleValueChange={handleChangeStatus}
                  placeholder="Difficulty"
                  pairs={[
                    { value: "all", label: "All" },
                    { value: SubmissionStatusEnum.SOLVED, label: "Solved" },
                    {
                      value: SubmissionStatusEnum.ATTEMPTED,
                      label: "Attempted",
                    },
                  ]}
                />

                <div className="flex flex-col gap-1 mt-2">
                  {submissions.map((submission, index) => {
                    const Icon =
                      submission.status === SubmissionStatusEnum.SOLVED ? (
                        <Check className="text-green-500 size-4" />
                      ) : (
                        <X className="text-red-500 size-4" />
                      );

                    return (
                      <div
                        onClick={() => setSubmissionIndex(index)}
                        key={submission.id}
                        className={`py-1 px-3 rounded-sm border flex justify-between items-center cursor-pointer transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900 ${submissionIndex === index && "border-primary"}`}
                      >
                        <div className="flex items-center gap-2 flex-1 overflow-hidden">
                          <div>{Icon}</div>
                          <div className="flex flex-col truncate">
                            <p className="text-sm font-semibold truncate">
                              {submission.user.username}
                            </p>
                            <p className="text-xs truncate">
                              {submission.user.name}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 w-16 text-end">
                          {new Date(submission.updatedAt).getMonth() +
                            "/" +
                            new Date(submission.updatedAt).getDate() +
                            "/" +
                            new Date(submission.updatedAt).getFullYear()}
                        </p>
                      </div>
                    );
                  })}
                  {submissions.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center mt-2">
                      No submissions found.
                    </p>
                  )}

                  {totalPages > 1 && (
                    <div className="mt-4">
                      <CustomPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page: number) => () => {
                          setSubmissionIndex(0);
                          setCurrentPage(page);
                        }}
                        createQueryString={createQueryString}
                        path={path}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ProblemCard>
        }
        Code={<CodeEditor code={problem?.answerCode ?? ""} />}
        TestCases={
          <TestCaseBar
            testCases={testCases}
            onCheckCode={handleCheckCode}
            onEditTestCase={handleEditTestCase}
            sending={sending}
            overrideHidden
          />
        }
      />
    </div>
  );
};

export default Submissions;

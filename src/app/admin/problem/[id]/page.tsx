"use client";

import AdminCodeEditor from "@/components/admin/problem/admin-code-editor";
import AdminProblemBar from "@/components/admin/problem/admin-problem-bar";
import AdminTestCaseBar from "@/components/admin/problem/admin-test-case-bar";
import ProblemLayout from "@/components/shared/problem-layout";
import { useAuth } from "@/contexts/auth.context";
import { RunCodeResponseType } from "@/dtos/code.dto";
import { AddProblemSchemaType } from "@/dtos/problem.dto";
import { AddTestCaseSchemaType } from "@/dtos/testcase.dto";
import { runCode } from "@/lib/fetchers/code.fetchers";
import {
  deleteProblem,
  fetchProblemWithSolution,
  updateProblem,
} from "@/lib/fetchers/problem.fetchers";
import { toastr } from "@/lib/toastr";
import DifficultyEnum from "@/lib/types/enums/difficulty.enum";
import { ProblemPageEnum } from "@/lib/types/enums/problempage.enum";
import TestCaseSubmissionStatusEnum from "@/lib/types/enums/submissionstatus.enum";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const UpdateProblem = () => {
  const router = useRouter();
  const { token } = useAuth();

  const params = useParams();
  if (!params.id) {
    router.push("/admin");
  }

  const [loading, setLoading] = useState<boolean>(true);
  const [isSolution, setIsSolution] = useState(true);
  const [checked, setChecked] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [problemPage, setProblemPage] = useState(ProblemPageEnum.DETAILS);

  const [problem, setProblem] = useState<AddProblemSchemaType>({
    title: "",
    description: "",
    difficulty: DifficultyEnum.PROG1,
    defaultCode: "// Write your boilerplate code here...",
    solutionCode: "// Write your solution code here...",
  });

  const [testCases, setTestCases] = useState<AddTestCaseSchemaType[]>([
    {
      input: "",
      hidden: false,
      status: TestCaseSubmissionStatusEnum.PENDING,
    },
  ]);

  const setAllToPending = () => {
    setTestCases((prev) =>
      prev.map((testCase) => ({
        ...testCase,
        status: TestCaseSubmissionStatusEnum.PENDING,
      })),
    );
  };

  const handleProblemChange = (
    field: string,
    value: string | DifficultyEnum,
  ) => {
    setProblem((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddTestCase = () => {
    setTestCases((prev) => [
      ...prev,
      {
        input: "",
        hidden: false,
        status: TestCaseSubmissionStatusEnum.PENDING,
      },
    ]);
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

  const handleDeleteTestCase = (index: number) => () => {
    setTestCases((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveProblem = async () => {
    if (!token) {
      console.error("User is not authenticated");
      return;
    }

    try {
      await updateProblem(
        params.id as string,
        {
          ...problem,
          defaultCode:
            problem.defaultCode == "// Write your boilerplate code here..."
              ? ""
              : problem.defaultCode,
          solutionCode:
            problem.solutionCode == "// Write your solution code here..."
              ? ""
              : problem.solutionCode,
          testCases: testCases,
        } as AddProblemSchemaType,
        token,
      );
      toastr.success("Problem updated successfully");
      router.push("/admin");
    } catch (error) {
      toastr.error("Error saving problem");
      console.error("Error saving problem:", error);
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    if (checked && isSolution) {
      setChecked(false);
      setAllToPending();
    }

    if (isSolution) handleProblemChange("solutionCode", value ?? "");
    else handleProblemChange("defaultCode", value ?? "");
  };

  const handleChangeIsSolution = (value: boolean) => () => {
    setIsSolution(value);
    if (value) {
      handleProblemChange(
        "solutionCode",
        problem.solutionCode || "// Write your solution code here...",
      );
    } else {
      handleProblemChange(
        "defaultCode",
        problem.defaultCode || "// Write your boilerplate code here...",
      );
    }
  };

  const handleCheckCode = async (
    testCase: AddTestCaseSchemaType,
  ): Promise<RunCodeResponseType> => {
    if (!token) {
      console.error("User is not authenticated");
      return { output: null, error: "User is not authenticated" };
    }

    setChecked(true);

    try {
      const response = await runCode(
        problem.solutionCode,
        testCase.input ?? "",
        token,
      );
      return response;
    } catch (error) {
      console.error("Error checking code:", error);
      return { output: null, error: "Error checking code" };
    }
  };

  const handleDelete = async () => {
    if (!token) {
      console.error("User is not authenticated");
      return;
    }

    try {
      await deleteProblem(params.id as string, token);
      router.push("/admin");
      toastr.success("Problem deleted successfully");
    } catch (error) {
      console.error("Error deleting problem:", error);
      toastr.error("Error deleting problem");
    }
  };

  useEffect(() => {
    if (!token) return;

    const fetchProblemData = async () => {
      try {
        const response = await fetchProblemWithSolution(
          params.id as string,
          token || "",
        );
        if (response.data) {
          const _testCases = response.data.testCases || [];
          setProblem({
            title: response.data.title,
            description: response.data.description,
            difficulty: response.data.difficulty,
            defaultCode: response.data.defaultCode,
            solutionCode: response.data.solutionCode ?? "",
          });
          setTestCases(
            _testCases.map((testCase) => ({
              ...testCase,
              status: TestCaseSubmissionStatusEnum.PENDING,
            })),
          );
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

  useEffect(() => {
    if (testCases.length > 0) {
      setCanSubmit(
        testCases.every(
          (testCase) =>
            testCase.status === TestCaseSubmissionStatusEnum.COMPLETED,
        ),
      );
    } else {
      setCanSubmit(false);
    }
  }, [testCases]);

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-lg text-gray-500">Loading problem...</div>
        </div>
      </>
    );
  }

  return (
    <div>
      <ProblemLayout
        problemPage={problemPage}
        handleChangeProblemPage={setProblemPage}
        Details={
          <AdminProblemBar
            problem={problem}
            onProblemChange={handleProblemChange}
            onSave={handleSaveProblem}
            canSubmit={canSubmit}
            onDelete={handleDelete}
          />
        }
        Code={
          <AdminCodeEditor
            defaultCode={problem.defaultCode ?? undefined}
            solutionCode={problem.solutionCode}
            onCodeChange={handleCodeChange}
            isSolution={isSolution}
            handleChangeIsSolution={handleChangeIsSolution}
          />
        }
        TestCases={
          <AdminTestCaseBar
            testCases={testCases}
            onAddTestCase={handleAddTestCase}
            onTestCaseChange={handleEditTestCase}
            onDeleteTestCase={handleDeleteTestCase}
            handleCheckCode={handleCheckCode}
          />
        }
      />
    </div>
  );
};

export default UpdateProblem;

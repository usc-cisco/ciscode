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
import { addProblem } from "@/lib/fetchers/problem.fetchers";
import { toastr } from "@/lib/toastr";
import { DifficultyEnum } from "@/lib/types/enums/difficulty.enum";
import { ProblemPageEnum } from "@/lib/types/enums/problempage.enum";
import TestCaseSubmissionStatusEnum from "@/lib/types/enums/submissionstatus.enum";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AddProblemPage = () => {
  const router = useRouter();
  const { token } = useAuth();

  const [isSolution, setIsSolution] = useState(true);
  const [checked, setChecked] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [problemPage, setProblemPage] = useState(ProblemPageEnum.DETAILS);

  const [problem, setProblem] = useState({
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

    setCanSubmit(false);

    try {
      await addProblem(
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
      toastr.success("Problem added successfully");
      router.push("/admin");
    } catch (error) {
      toastr.error("Error saving problem");
      console.error("Error saving problem:", error);
    } finally {
      setCanSubmit(true);
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
          />
        }
        Code={
          <AdminCodeEditor
            defaultCode={problem.defaultCode}
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

export default AddProblemPage;

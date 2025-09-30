export const runtime = "nodejs";

import {
  AddProblemSchema,
  ProblemSchemaResponseType,
  ProblemSchemaResponseWithTestCases,
} from "@/dtos/problem.dto";
import { TestCaseSubmissionResponseType } from "@/dtos/testcase-submission.dto";
import { PtyModule } from "@/lib/code-runner";
import { requireRole } from "@/lib/require-role";
import { ActionTypeEnum } from "@/lib/types/enums/actiontype.enum";
import RoleEnum from "@/lib/types/enums/role.enum";
import TestCaseSubmissionStatusEnum from "@/lib/types/enums/submissionstatus.enum";
import ActivityLogService from "@/services/activity-log.service";
import ProblemService from "@/services/problem.service";
import SubmissionService from "@/services/submission.service";
import TestCaseSubmissionService from "@/services/testcase-submission.service";
import TestCaseService from "@/services/testcase.service";
import UserService from "@/services/user.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: "Invalid problem ID" }, { status: 400 });
  }

  const userIdString = req.headers.get("x-user-id");
  if (!userIdString || isNaN(Number(userIdString))) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  const userId = Number(userIdString);

  try {
    const problem = await ProblemService.getProblemById(Number(id));
    if (!problem || !problem.verified) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    const submission =
      await SubmissionService.getSubmissionByProblemIdAndUserId(
        Number(id),
        userId,
      );
    let testCaseSubmissions: TestCaseSubmissionResponseType[] = [];

    if (submission) {
      testCaseSubmissions =
        await TestCaseSubmissionService.getTestCaseSubmissionsBySubmissionId(
          submission.id,
        );
    }

    const user = await UserService.getUserById(userId);
    await ActivityLogService.createLogEntry(
      userId,
      `[${user.username} - ${user.name}] fetched problem [${id} - ${problem.title}].`,
      ActionTypeEnum.READ,
    );

    return NextResponse.json(
      {
        message: "Problem fetched successfully",
        data: ProblemSchemaResponseWithTestCases.parse({
          ...problem,
          solutionCode: undefined,
          answerCode: submission ? submission.code : null,
          testCases: problem.testCases.map((testCase) => {
            const testCaseSubmission = testCaseSubmissions.filter(
              (submission) => submission.testCaseId === testCase.id,
            );

            return {
              ...testCase,
              actualOutput:
                testCaseSubmission[0] && !testCase.hidden
                  ? testCaseSubmission[0].output || testCaseSubmission[0].error
                  : "",
              status: testCaseSubmission[0]
                ? testCaseSubmission[0].status
                : TestCaseSubmissionStatusEnum.PENDING,
            };
          }),
        }),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching problem:", error);
    return NextResponse.json(
      { error: (error as { message: string }).message },
      { status: 500 },
    );
  }
}

export const PUT = requireRole<[{ params: Promise<{ id: string }> }]>(
  async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const pty = await import("node-pty");

    const { id } = await context.params;
    const userIdString = req.headers.get("x-user-id");
    if (!userIdString || isNaN(Number(userIdString))) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    try {
      const problem = await ProblemService.getProblemById(Number(id));
      if (!problem) {
        return NextResponse.json(
          { error: "Problem not found" },
          { status: 404 },
        );
      }

      const body = await req.json();
      const parsedData = AddProblemSchema.parse(body);
      parsedData.verified = true;

      const problemTestCases = await TestCaseService.getTestCasesByProblemId(
        Number(id),
      );
      if (!problemTestCases) {
        return NextResponse.json(
          { error: "Problem test cases not found" },
          { status: 404 },
        );
      }

      if (parsedData.testCases) {
        const existingTestCaseIds = problemTestCases.map(
          (testCase) => testCase.id,
        );
        const newTestCases = parsedData.testCases.filter(
          (testCase) =>
            !testCase.id || !existingTestCaseIds.includes(testCase.id),
        );
        const updatedTestCases = parsedData.testCases.filter(
          (testCase) =>
            testCase.id && existingTestCaseIds.includes(testCase.id),
        );
        const deletedTestCases = problemTestCases.filter(
          (testCase) =>
            !parsedData.testCases!.find((tc) => tc.id === testCase.id),
        );

        // Add new test cases
        await TestCaseService.addTestCases(
          newTestCases,
          problem as ProblemSchemaResponseType,
          pty as PtyModule,
        );

        // Update existing test cases
        await Promise.all(
          updatedTestCases.map((testCase) => {
            if (testCase.id) {
              return TestCaseService.updateTestCase(testCase.id, testCase);
            }
          }),
        );

        // Delete test cases
        await Promise.all(
          deletedTestCases.map((testCase) => {
            if (testCase.id) {
              return TestCaseService.deleteTestCase(testCase.id);
            }
          }),
        );
      }

      const updatedProblem = await ProblemService.updateProblem(
        Number(id),
        parsedData,
      );

      const user = await UserService.getUserById(Number(userIdString));
      await ActivityLogService.createLogEntry(
        Number(userIdString),
        `[${user.username} - ${user.name}] ` +
          (problem.verified ? `updated` : `verified`) +
          ` problem [${id} - ${problem.title}].`,
        ActionTypeEnum.UPDATE,
      );

      return NextResponse.json(
        { message: "Problem updated successfully", data: updatedProblem },
        { status: 200 },
      );
    } catch (error) {
      console.error("Error updating problem:", error);
      return NextResponse.json(
        { error: (error as { message: string }).message },
        { status: 500 },
      );
    }
  },
  [RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN],
);

export const DELETE = requireRole<[{ params: Promise<{ id: string }> }]>(
  async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;

    const userIdString = req.headers.get("x-user-id");
    if (!userIdString || isNaN(Number(userIdString))) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    try {
      const problem = await ProblemService.getProblemById(Number(id));
      if (!problem) {
        return NextResponse.json(
          { error: "Problem not found" },
          { status: 404 },
        );
      }

      await ProblemService.deleteProblem(Number(id));

      const user = await UserService.getUserById(Number(userIdString));
      await ActivityLogService.createLogEntry(
        Number(userIdString),
        `[${user.username} - ${user.name}] deleted problem [${id} - ${problem.title}].`,
        ActionTypeEnum.DELETE,
      );

      return NextResponse.json(
        { message: "Problem deleted successfully" },
        { status: 200 },
      );
    } catch (error) {
      console.error("Error deleting problem:", error);
      return NextResponse.json(
        { error: (error as { message: string }).message },
        { status: 500 },
      );
    }
  },
  [RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN],
);

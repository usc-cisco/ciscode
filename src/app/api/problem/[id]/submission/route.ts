export const runtime = "nodejs";

import { CheckCodeResponseSchema } from "@/dtos/code.dto";
import { ProblemSchemaResponseWithTestCasesType } from "@/dtos/problem.dto";
import {
  SubmissionResponse,
  SubmissionResponseWithTestCaseSubmissionAndUserType,
  SubmissionResponseWithTestCaseSubmissionType,
  UpdateSubmissionType,
} from "@/dtos/submission.dto";
import { PtyModule, runCCode } from "@/lib/code-runner";
import SubmissionStatusEnum from "@/lib/types/enums/problemstatus.enum";
import TestCaseSubmissionStatusEnum from "@/lib/types/enums/submissionstatus.enum";
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

  try {
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status") as SubmissionStatusEnum | null;
    const offset = searchParams.get("offset")
      ? Number(searchParams.get("offset"))
      : 0;
    const limit = searchParams.get("limit")
      ? Number(searchParams.get("limit"))
      : 10;

    const problem = await ProblemService.getProblemById(Number(id), true);
    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    const submissions = await SubmissionService.getSubmissionsByProblemId(
      Number(id),
      limit,
      offset,
      status,
    );

    const submissionsWithTestCaseSubmissionsAndUsers = await Promise.all(
      submissions.map(async (submission) => {
        const testCaseSubmissions =
          await TestCaseSubmissionService.getTestCaseSubmissionsBySubmissionId(
            submission.id,
          );

        if (testCaseSubmissions.length === 0) {
          throw new Error("Test case submissions not found");
        }

        const user = await UserService.getUserById(submission.userId);

        if (!user) {
          throw new Error("User not found");
        }

        return {
          ...submission,
          testCaseSubmissions,
          user,
        } as SubmissionResponseWithTestCaseSubmissionAndUserType;
      }),
    );

    // Return the enriched submissions
    return NextResponse.json(
      {
        message: "Submissions fetched successfully",
        data: {
          problem: problem as ProblemSchemaResponseWithTestCasesType,
          submissions: submissionsWithTestCaseSubmissionsAndUsers,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { error: (error as { message: string }).message },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const pty = await import("node-pty");

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
    const body = await req.json();

    const { code } = body;
    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    // Save submission
    const submission = await SubmissionService.saveSubmission(
      Number(id),
      userId,
      {
        code,
        status: SubmissionStatusEnum.ATTEMPTED,
      },
    );

    // Run the different test cases
    let submissionStatus = SubmissionStatusEnum.SOLVED;

    const testCases = await TestCaseService.getTestCasesByProblemId(
      Number(id),
      true,
    );
    const results = await Promise.all(
      testCases.map(async (testCase) => {
        const result = await runCCode(
          code,
          testCase.input || "",
          pty as PtyModule,
        );
        let status = TestCaseSubmissionStatusEnum.COMPLETED;

        if (result.error || result.output !== testCase.output) {
          status = TestCaseSubmissionStatusEnum.FAILED;
          submissionStatus = SubmissionStatusEnum.ATTEMPTED;
        }

        // Save as Test Case Submission
        await TestCaseSubmissionService.saveTestCaseSubmission(
          testCase.id,
          submission.id,
          {
            output: result.output,
            error: result.error,
            status,
          },
        );

        return CheckCodeResponseSchema.parse({
          id: testCase.id,
          output: testCase.hidden ? null : result.output || "",
          error: testCase.hidden ? null : result.error || "",
          status,
        });
      }),
    );

    // Update submission status if Solved
    if (submissionStatus === SubmissionStatusEnum.SOLVED) {
      await SubmissionService.updateSubmission(submission.id, {
        status: submissionStatus,
      } as UpdateSubmissionType);
      submission.status = submissionStatus;
    }

    // Return the results
    return NextResponse.json({
      message: "Test cases executed",
      data: {
        ...SubmissionResponse.parse(submission),
        testCaseSubmissions: results,
      },
    });
  } catch (error) {
    console.error("Error updating problem:", error);
    return NextResponse.json(
      { error: (error as { message: string }).message },
      { status: 500 },
    );
  }
}

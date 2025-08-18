import { ProblemSchemaResponseWithTestCasesType } from "@/dtos/problem.dto";
import {
  SubmissionResponseWithTestCaseSubmissionAndUserType,
  SubmissionResponseWithTestCaseSubmissionType,
} from "@/dtos/submission.dto";
import SubmissionStatusEnum from "@/lib/types/enums/problemstatus.enum";
import ProblemService from "@/services/problem.service";
import SubmissionService from "@/services/submission.service";
import TestCaseSubmissionService from "@/services/testcase-submission.service";
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

import { CheckCodeResponseSchema } from "@/dtos/code.dto";
import { SubmissionResponse, UpdateSubmissionType } from "@/dtos/submission.dto";
import { runCCode } from "@/lib/code-runner";
import ProblemStatusEnum from "@/lib/types/enums/problemstatus.enum";
import SubmissionStatusEnum from "@/lib/types/enums/submissionstatus.enum";
import SubmissionService from "@/services/submission.service";
import TestCaseSubmissionService from "@/services/testcase-submission.service";
import TestCaseService from "@/services/testcase.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: { params: { id: string } }) {
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
        const submission = await SubmissionService.saveSubmission(Number(id), userId, {
            code,
            status: ProblemStatusEnum.ATTEMPTED
        });

        
        // Run the different test cases
        let submissionStatus = ProblemStatusEnum.SOLVED;

        const testCases = await TestCaseService.getTestCasesByProblemId(Number(id), true);
        const results = await Promise.all(testCases.map(async (testCase) => {
            const result = await runCCode(code, testCase.input || "");
            let status = SubmissionStatusEnum.COMPLETED;

            if (result.error || result.output !== testCase.output) {
                status = SubmissionStatusEnum.FAILED;
                submissionStatus = ProblemStatusEnum.ATTEMPTED;
            }

            // Save as Test Case Submission
            await TestCaseSubmissionService.saveTestCaseSubmission(testCase.id, submission.id, {
                output: result.output,
                error: result.error,
                status
            });

            return CheckCodeResponseSchema.parse({
                id: testCase.id,
                output: testCase.hidden ? null : result.output || "",
                error: testCase.hidden ? null : result.error || "",
                status
            })
        }));

        // Update submission status if Solved
        if (submissionStatus === ProblemStatusEnum.SOLVED) {
            await SubmissionService.updateSubmission(submission.id, {
                status: submissionStatus
            } as UpdateSubmissionType);
        }

        // Return the results
        return NextResponse.json({ message: "Test cases executed", data: {
            ...SubmissionResponse.parse(submission),
            testCaseSubmissions: results
        } });

    } catch (error: any) {
        console.error("Error updating problem:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
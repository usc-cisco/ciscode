import { runCCode } from "@/lib/code-runner";
import { CheckCodeResponseSchema, RunCodeSchema } from "@/dtos/code.dto";
import { NextRequest, NextResponse } from "next/server";
import TestCaseService from "@/services/testcase.service";
import SubmissionStatusEnum from "@/lib/types/enums/submissionstatus.enum";

export async function POST(req: NextRequest, context: { params: { id: string } }) {
    const { id } = context.params;
    if (!id || isNaN(Number(id))) {
        return NextResponse.json({ error: "Invalid problem ID" }, { status: 400 });
    }

    const testCaseId = Number(id);

    try {
        const body = await req.json();
        const { code } = body;
        if (!code) {
            return NextResponse.json({ error: "Code is required" }, { status: 400 });
        }

        // Fetch the test case by ID
        const testCase = await TestCaseService.getTestCaseById(testCaseId);
        if (!testCase) {
            return NextResponse.json({ error: "Test case not found" }, { status: 404 });
        }

        const result = await runCCode(code, testCase.input || "");
        
        let status = SubmissionStatusEnum.COMPLETED;

        if (result.error || result.output !== testCase.output) {
            status = SubmissionStatusEnum.FAILED;
        }

        return NextResponse.json({
            message: "Code executed successfully",
            data: CheckCodeResponseSchema.parse({
                output: testCase.hidden ? null : result.output,
                error: testCase.hidden ? null : result.error,
                status
            })
        });
    }
    catch (error) {
        console.error("Error running code:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
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
        const parsedData = await RunCodeSchema.safeParseAsync(body);
        if (!parsedData.success) {
            return NextResponse.json({ error: parsedData.error }, { status: 400 });
        }

        // Fetch the test case by ID
        const testCase = await TestCaseService.getTestCaseById(testCaseId);
        if (!testCase) {
            return NextResponse.json({ error: "Test case not found" }, { status: 404 });
        }

        // Run code first
        const { code, input } = parsedData.data;
        const result = await runCCode(code, input || "");

        let status = SubmissionStatusEnum.COMPLETED;

        if (result.error || (result.output && result.output !== testCase.output)) {
            status = SubmissionStatusEnum.FAILED;
        }

        return NextResponse.json({
            message: "Code executed successfully",
            data: CheckCodeResponseSchema.parse({
                output: testCase.hidden || result.output || "",
                error: testCase.hidden || result.error || null,
                status
            })
        });
    }
    catch (error) {
        console.error("Error running code:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
import Problem from "@/app/problem/[id]/page";
import { sequelize } from "@/db/sequelize";
import { CheckCodeResponseSchema } from "@/dtos/code.dto";
import { UpdateSubmissionType } from "@/dtos/submission.dto";
import { TestCaseSubmissionResponseType } from "@/dtos/testcase-submission.dto";
import { runCCode } from "@/lib/code-runner";
import SubmissionStatusEnum from "@/lib/types/enums/problemstatus.enum";
import TestCaseSubmissionStatusEnum from "@/lib/types/enums/submissionstatus.enum";
import ProblemService from "@/services/problem.service";
import SubmissionService from "@/services/submission.service";
import TestCaseSubmissionService from "@/services/testcase-submission.service";
import TestCaseService from "@/services/testcase.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
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
        console.log("Sequelize dialect:", sequelize.getDialect());
        const problem = await ProblemService.getProblemById(Number(id));
        if (!problem) {
            return NextResponse.json({ error: "Problem not found" }, { status: 404 });
        }

        const submission = await SubmissionService.getSubmissionByProblemIdAndUserId(Number(id), userId);
        let testCaseSubmissions: TestCaseSubmissionResponseType[] = [];

        if (submission) {
            testCaseSubmissions = await TestCaseSubmissionService.getTestCaseSubmissionsBySubmissionId(submission.id);
        }

        return NextResponse.json({ 
            message: "Problem fetched successfully", 
            data: {
                ...problem,
                defaultCode: submission ? submission.code : problem.defaultCode,
                testCases: problem.testCases.map((testCase, index) => {
                    return {
                        ...testCase,
                        actualOutput: (testCaseSubmissions[index] && !testCase.hidden) ? (testCaseSubmissions[index].output || testCaseSubmissions[index].error) : "",
                        status: (testCaseSubmissions[index]) ? testCaseSubmissions[index].status : TestCaseSubmissionStatusEnum.PENDING,
                    };
                })
            },
        }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching problem:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
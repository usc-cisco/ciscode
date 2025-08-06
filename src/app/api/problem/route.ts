import { AddProblemSchema } from "@/dtos/problem.dto";
import RoleEnum from "@/lib/types/enums/role.enum";
import { requireRole } from "@/lib/require-role";
import ProblemService from "@/services/problem.service";
import { NextRequest, NextResponse } from "next/server";
import DifficultyEnum from "@/lib/types/enums/difficulty.enum";
import TestCaseService from "@/services/testcase.service";

export const GET = async (req: NextRequest) => {
    try {
        const searchParams = req.nextUrl.searchParams;
        const offset = searchParams.get("offset") ? Number(searchParams.get("offset")) : 0;
        const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 10;
        const search = searchParams.get("search") || "";
        const difficulty = searchParams.get("difficulty") || null;

        const problems = await ProblemService.getProblems(offset, limit, search, difficulty ? difficulty as DifficultyEnum : null);
        const totalCount = await ProblemService.getTotalCount(search, difficulty ? difficulty as DifficultyEnum : null);

        return NextResponse.json({ data: {
            problems: problems,
            totalPages: Math.ceil(totalCount / limit),
            totalCount
        } }, { status: 200 });
    }
    catch (error: any) {
        console.error("Error fetching problems:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};

export const POST = requireRole(async (req: NextRequest) => {
    const userIdString = req.headers.get("x-user-id");
    if (!userIdString || isNaN(Number(userIdString))) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const userId = Number(userIdString);

    try {
        const body = await req.json();
        const parsedData = await AddProblemSchema.safeParseAsync(body);
        if (!parsedData.success) {
            return NextResponse.json({ error: parsedData.error }, { status: 400 });
        }

        const data = parsedData.data;
        console.log(userId);
        const newProblem = await ProblemService.addProblem(data, userId);

        const testCases = await TestCaseService.addTestCases(data.testCases, newProblem);

        return NextResponse.json({ message: "Problem created successfully", data: {
            ...newProblem,
            testCases
        } }, { status: 201 });
    }
    catch (error: any) {
        console.error("Error running code:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}, [RoleEnum.ADMIN]);
import { AddProblemSchema } from "@/dtos/problem.dto";
import RoleEnum from "@/lib/types/enums/role.enum";
import { requireRole } from "@/lib/require-role";
import ProblemService from "@/services/problem.service";
import { NextRequest, NextResponse } from "next/server";
import { ca } from "zod/locales";

export const GET = async (req: NextRequest) => {
    try {

    }
    catch (error: any) {
        console.error("Error fetching problems:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "GET request not implemented" }, { status: 501 });
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

        return NextResponse.json({ message: "Problem created successfully", data: newProblem }, { status: 201 });
    }
    catch (error: any) {
        console.error("Error running code:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}, [RoleEnum.ADMIN]);